// Limite simples em memória para desenvolvimento. Em produção com múltiplas instâncias use Redis/WAF.
function limiter({windowMs = 15*60*1000, max = 12} = {}) {
  const hits = new Map();
  return (req,res,next) => {
    const now = Date.now();
    if (hits.size > 10000) for (const [key, value] of hits) if (value.until < now) hits.delete(key);
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const state = hits.get(key);
    const value = !state || now >= state.until ? {count:1, until:now+windowMs} : {count:state.count+1, until:state.until};
    hits.set(key,value);
    if (value.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((value.until-now)/1000)));
      return res.status(429).json({erro:'Muitas tentativas. Aguarde alguns minutos.'});
    }
    next();
  };
}
module.exports = limiter;
