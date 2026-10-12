import {useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../utils/api';
import '../styles/auth.css';
export default function RecuperarSenha(){
  const [email,setEmail]=useState(''),[mensagem,setMensagem]=useState(''),[carregando,setCarregando]=useState(false);
  async function enviar(e){e.preventDefault();setCarregando(true);setMensagem('');try{const r=await api('/auth/recuperar-senha',{method:'POST',body:{email}});setMensagem(r.mensagem);}catch(error){setMensagem(error.message);}finally{setCarregando(false);}}
  return <main className="auth-page"><div className="auth-main"><div className="auth-container"><section className="auth-intro"><span className="section-label">SEGURANÇA</span><h1>Recuperar acesso</h1><p>Informe seu e-mail. Se estiver cadastrado, enviaremos um link para redefinir a senha, válido por 30 minutos.</p></section><section className="auth-card"><h2>Esqueceu sua senha?</h2><form className="auth-form" onSubmit={enviar}><div className="form-group"><label htmlFor="email-reset">E-mail cadastrado</label><input id="email-reset" type="email" required value={email} autoComplete="email" onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com"/></div><p role="status">{mensagem}</p><button className="btn btn-primary btn-large auth-submit" disabled={carregando}>{carregando?'Enviando...':'Solicitar recuperação'}</button></form><p className="auth-back"><Link to="/login">← Voltar ao login</Link></p></section></div></div></main>;
}
