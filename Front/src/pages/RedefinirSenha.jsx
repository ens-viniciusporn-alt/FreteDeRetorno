import {useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {api} from '../utils/api';
import '../styles/auth.css';
export default function RedefinirSenha(){
  const [params]=useSearchParams();const token=params.get('token')||'';
  const [senha,setSenha]=useState(''),[confirmacaoSenha,setConfirmacao]=useState(''),[mensagem,setMensagem]=useState(''),[ok,setOk]=useState(false);
  async function enviar(e){e.preventDefault();try{const d=await api('/auth/redefinir-senha',{method:'POST',body:{token,senha,confirmacaoSenha}});setMensagem(d.mensagem);setOk(true);}catch(error){setMensagem(error.message);}}
  return <main className="auth-page"><div className="auth-main"><div className="auth-container"><section className="auth-intro"><span className="section-label">SEGURANÇA</span><h1>Nova senha</h1><p>Use uma senha de no mínimo 8 caracteres. Este link só pode ser usado uma vez.</p></section><section className="auth-card"><h2>Redefinir senha</h2>{token&&!ok?<form className="auth-form" onSubmit={enviar}><div className="form-group"><label htmlFor="senha-nova">Nova senha</label><input id="senha-nova" type="password" required minLength={8} value={senha} autoComplete="new-password" onChange={e=>setSenha(e.target.value)}/></div><div className="form-group"><label htmlFor="confirmar-nova">Confirmar</label><input id="confirmar-nova" type="password" required minLength={8} value={confirmacaoSenha} autoComplete="new-password" onChange={e=>setConfirmacao(e.target.value)}/></div><button className="btn btn-primary btn-large auth-submit">Salvar nova senha</button></form>:<p>{token?mensagem:'Link de recuperação inválido.'}</p>}<p role="status">{!ok?mensagem:''}</p><p className="auth-back"><Link to="/login">Voltar ao login</Link></p></section></div></div></main>;
}
