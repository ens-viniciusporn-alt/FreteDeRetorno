import {Link} from 'react-router-dom';
export default function InformacoesLegais({tipo}) {
  const termos=tipo==='termos';
  return <main className="container" style={{padding:'48px 20px',maxWidth:'860px'}}>
    <p className="section-label">Frete de Retorno — versão de desenvolvimento</p>
    <h1>{termos?'Termos de uso (minuta)':'Privacidade (minuta)'}</h1>
    <p><strong>Aviso:</strong> esta é uma minuta informativa para testes e revisão da equipe. Não substitui termos jurídicos ou política de privacidade completos, que deverão ser aprovados antes do lançamento público.</p>
    {termos?<><h2>Finalidade do serviço</h2><p>O projeto acadêmico busca conectar clientes que precisam transportar cargas a motoristas e transportadoras com capacidade disponível em suas rotas de retorno.</p><h2>Uso responsável</h2><p>Não devem ser anunciadas cargas ilícitas, perigosas sem autorização ou serviços que descumpram a legislação. Negociações e pagamentos ainda não são realizados nesta versão.</p></>:<><h2>Dados usados no protótipo</h2><p>Para criar uma conta são solicitados nome, e-mail, senha e tipo de perfil; telefone é opcional. As senhas são armazenadas como hashes no PostgreSQL, não em texto puro.</p><h2>Ambiente de testes</h2><p>Os dados ficam no banco Neon configurado pelos desenvolvedores. Antes do lançamento público, a equipe deverá definir e publicar os responsáveis, os contatos, os prazos de retenção e o procedimento de direitos dos titulares.</p></>}
    <p>Evite cadastrar documentos e dados pessoais reais enquanto o sistema estiver em testes.</p>
    <Link to="/cadastro" className="btn btn-primary">Voltar ao cadastro</Link>
  </main>;
}
