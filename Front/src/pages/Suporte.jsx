import {useState} from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
const duvidas=[
  ['Como cadastrar uma carga?','Entre em Minhas cargas e preencha origem, destino, descrição e volume. Somente clientes podem cadastrar cargas.'],
  ['Como encontrar viagens disponíveis?','Abra Encontrar transporte no menu do cliente. A página mostra viagens agendadas cadastradas no Neon. A negociação ainda está em desenvolvimento.'],
  ['Como recuperar minha senha?','Na tela de login, clique em Esqueci minha senha. O envio do link depende do serviço de e-mail estar configurado pelos administradores.'],
  ['Já posso pagar fretes pela plataforma?','Ainda não. A integração de pagamentos e os mecanismos de confirmação não estão disponíveis nesta versão de desenvolvimento.'],
  ['O rastreamento funciona em tempo real?','Ainda não. A plataforma exibe os registros cadastrados, mas não possui integração de localização em tempo real.'],
  ['Onde ficam meus dados?','Os dados de testes são armazenados no PostgreSQL da organização, hospedado no Neon. Evite dados pessoais de terceiros durante os testes.'],
];
export default function Suporte(){
  const {usuario}=useAuth();const [busca,setBusca]=useState('');
  const lista=duvidas.filter(([q,a])=>`${q} ${a}`.toLowerCase().includes(busca.toLowerCase()));
  return <DashboardLayout tipo="cliente" nome={usuario.nome}>
    <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">CENTRAL DE AJUDA</span><h1>Como podemos ajudar?</h1><p>Respostas sobre as funcionalidades desta versão do projeto.</p></div></section>
    <section className="dashboard-panel"><label className="operation-search" htmlFor="busca-ajuda">Buscar uma dúvida<input id="busca-ajuda" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Digite uma palavra-chave"/></label>
      <div className="operation-list">{lista.length?lista.map(([pergunta,resposta])=><details key={pergunta} className="operation-row" style={{display:'block'}}><summary style={{cursor:'pointer',fontWeight:700}}>{pergunta}</summary><p style={{marginTop:12}}>{resposta}</p></details>):<p>Nenhuma resposta encontrada.</p>}</div></section>
    <section className="dashboard-panel"><h2>Atendimento</h2><p>O formulário de chamados do projeto antigo ainda não enviava solicitações reais. O módulo de suporte com protocolo de atendimento será desenvolvido numa próxima etapa.</p></section>
  </DashboardLayout>;
}
