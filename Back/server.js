require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const viagemRoutes = require('./routes/viagemRoutes');
const cargaRoutes = require('./routes/cargaRoutes');
const app = express();
const port = Number(process.env.PORT || 3000);
const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173').split(',').map(s=>s.trim()).filter(Boolean);
app.disable('x-powered-by');
app.use(cors({origin:(origin,done)=>done(null,!origin || origins.includes(origin)),credentials:true}));
app.use(express.json({limit:'32kb'}));
// Bloqueia solicitações de alteração entre sites; cookies de sessão são HttpOnly e SameSite=Lax.
app.use((req,res,next)=>{
  if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    const origin = req.get('origin');
    if (origin && !origins.includes(origin)) return res.status(403).json({erro:'Origem não permitida.'});
    if (req.get('sec-fetch-site') === 'cross-site') return res.status(403).json({erro:'Requisição entre sites bloqueada.'});
    if (req.is('application/json') === false && Number(req.get('content-length')||0) > 0) return res.status(415).json({erro:'Envie JSON.'});
  }
  next();
});
app.get('/api/health', (_req,res)=>res.json({status:'ok'}));
app.use('/api/auth',authRoutes);
app.use('/api/usuarios',usuarioRoutes);
app.use('/api/viagens',viagemRoutes);
app.use('/api/cargas',cargaRoutes);
app.use((_req,res)=>res.status(404).json({erro:'Rota não encontrada.'}));
app.use((error,_req,res,_next)=>{
  console.error('Erro na API:',error.message);
  res.status(500).json({erro:'Erro interno no servidor. Consulte o terminal do backend.'});
});
async function start(){
  await sequelize.authenticate();
  console.log('Conexão com o PostgreSQL realizada com sucesso.');
  app.listen(port,()=>console.log(`API disponível em http://localhost:${port}/api/health`));
}
if (require.main === module) start().catch(e=>{console.error('Backend não iniciado:',e.message);process.exitCode=1;});
module.exports = app;
