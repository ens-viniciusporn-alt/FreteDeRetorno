import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Cliente from './pages/Cliente';
import Transportadora from './pages/Transportadora';
import ConfiguracoesPerfil from './pages/ConfiguracoesPerfil';
import RecuperarSenha from './pages/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import Cargas from './pages/Cargas';
import Viagens from './pages/Viagens';
import Disponiveis from './pages/Disponiveis';
import Chats from './pages/Chats';
import MeusContratos from './pages/MeusContratos';
import AdminDisputas from './pages/AdminDisputas';
import Suporte from './pages/Suporte';
import InformacoesLegais from './pages/InformacoesLegais';
import './styles/base.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/react-adjustments.css';
import './styles/dashboard.css';
import './styles/operacoes.css';
const Protect=({tipo,children})=><ProtectedRoute tipo={tipo}>{children}</ProtectedRoute>;
export default function App(){return <BrowserRouter><AuthProvider><Routes>
  <Route path="/" element={<Inicio/>}/><Route path="/login" element={<Login/>}/><Route path="/cadastro" element={<Cadastro/>}/>
  <Route path="/termos" element={<InformacoesLegais tipo="termos"/>}/><Route path="/privacidade" element={<InformacoesLegais tipo="privacidade"/>}/>
  <Route path="/recuperar-senha" element={<RecuperarSenha/>}/><Route path="/redefinir-senha" element={<RedefinirSenha/>}/>
  <Route path="/admin/disputas" element={<Protect tipo="ADMIN"><AdminDisputas/></Protect>}/>
  <Route path="/cliente" element={<Protect tipo="CLIENTE"><Cliente/></Protect>}/>
  <Route path="/cliente/configuracoes" element={<Protect tipo="CLIENTE"><ConfiguracoesPerfil tipo="cliente"/></Protect>}/>
  <Route path="/cliente/cargas" element={<Protect tipo="CLIENTE"><Cargas/></Protect>}/>
  <Route path="/cliente/transporte" element={<Protect tipo="CLIENTE"><Disponiveis tipo="viagens"/></Protect>}/>
  <Route path="/cliente/pagamentos" element={<Navigate to="/cliente/chats" replace/>}/>
  <Route path="/cliente/contratos" element={<Protect tipo="CLIENTE"><MeusContratos/></Protect>}/>
  <Route path="/cliente/chats" element={<Protect tipo="CLIENTE"><Chats/></Protect>}/>
  <Route path="/cliente/suporte" element={<Protect tipo="CLIENTE"><Suporte/></Protect>}/>
  <Route path="/transportadora" element={<Protect tipo="TRANSPORTADORA"><Transportadora/></Protect>}/>
  <Route path="/transportadora/configuracoes" element={<Protect tipo="TRANSPORTADORA"><ConfiguracoesPerfil tipo="transportadora"/></Protect>}/>
  <Route path="/transportadora/viagens" element={<Protect tipo="TRANSPORTADORA"><Viagens/></Protect>}/>
  <Route path="/transportadora/cargas" element={<Protect tipo="TRANSPORTADORA"><Disponiveis tipo="cargas"/></Protect>}/>
  <Route path="/transportadora/pagamentos" element={<Navigate to="/transportadora/chats" replace/>}/>
  <Route path="/transportadora/contratos" element={<Protect tipo="TRANSPORTADORA"><MeusContratos/></Protect>}/>
  <Route path="/transportadora/chats" element={<Protect tipo="TRANSPORTADORA"><Chats/></Protect>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></AuthProvider></BrowserRouter>}
