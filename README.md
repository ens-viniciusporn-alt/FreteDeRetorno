Frete de Retorno
O Frete de Retorno é um projeto acadêmico que estamos desenvolvendo no curso de Engenharia de Software. A ideia é ajudar a aproveitar melhor o espaço dos veículos que fazem viagens de retorno, aproximando clientes que precisam enviar cargas de transportadoras com capacidade disponível.

Começamos com um site mais simples, feito em HTML, CSS e JavaScript. Com o andamento do projeto, reorganizamos a aplicação usando React no frontend, Node.js no backend e PostgreSQL para armazenar os dados.

O sistema ainda está em desenvolvimento, mas já conseguimos implementar e testar boa parte do fluxo de uma contratação.
O que já funciona
- Cadastro e login: acesso separado para clientes e transportadoras.
- Cargas e viagens: cadastro, consulta e gerenciamento das informações de transporte.
- Busca de oportunidades: clientes podem procurar viagens e transportadoras podem consultar cargas disponíveis.
- Conversas: comunicação entre cliente e transportadora para negociar um frete.
- Contratos: envio da proposta pela transportadora, aceite pelo cliente e acompanhamento das etapas.
- Pagamentos de teste: simulação de pagamento por PIX, cartão ou boleto, com cálculo de 10% de comissão da plataforma e 90% de repasse à transportadora.
- Notificações: avisos sobre mensagens, propostas, mudanças no contrato e disputas.
- Disputas: registro de reclamações e análise pelo perfil administrador, com histórico das decisões.
- Perfil e painel: consulta de informações e indicadores de cargas e viagens.
Importante: os pagamentos são apenas simulações. O projeto não cobra, retém, transfere ou libera dinheiro real.
Tecnologias utilizadas
Parte do projeto	Tecnologias
Frontend	React, Vite, JavaScript, HTML e CSS
Backend	Node.js e Express
Banco de dados	PostgreSQL, hospedado no Neon
Desenvolvimento em equipe	Git e GitHub


Como executar o projeto
Para rodar localmente, é necessário ter o Node.js instalado e acesso a um banco PostgreSQL configurado para o projeto. Usamos o Neon, então não é necessário instalar o PostgreSQL no computador para acessar esse banco.
1. Configurar o backend
Na pasta Back, instale as dependências:
cd Back
npm ci
Crie o arquivo .env a partir de .env.example e preencha as configurações de conexão com o seu ambiente, além das demais variáveis necessárias para a aplicação.

No Windows, pelo terminal CMD:
copy .env.example .env
O SESSION_SECRET deve ser uma chave própria e segura. Você pode gerar uma com:
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
Não envie o .env para o GitHub nem compartilhe senhas ou dados de acesso ao banco.

Depois, inicie a API:
npm start
Quando a conexão estiver funcionando, o backend ficará disponível em http://localhost:3000 e poderá ser verificado em http://localhost:3000/api/health.
2. Iniciar o frontend
Em outro terminal, a partir da pasta principal do projeto:
cd Front
npm ci
npm run dev
Abra http://localhost:5173 no navegador.
3. Banco de dados
Os scripts SQL estão na pasta database/ e registram as mudanças feitas na estrutura do banco ao longo do desenvolvimento.

O banco compartilhado do projeto já recebeu as migrações usadas nesta versão. Não execute novamente todos os scripts em um banco que já está configurado. Para montar um ambiente novo, é preciso conferir a estrutura inicial, as dependências e a ordem das migrações antes de executá-las.

Sempre fazemos backup e testamos alterações de estrutura em uma branch separada do Neon antes de levá-las ao banco principal.
Organização das pastas
FreteDeRetorno/
├── Back/          # API, regras de negócio, rotas e testes
├── Front/         # Telas e componentes React
├── database/      # Scripts SQL do projeto
├── docs/          # Documentação complementar
└── README.md
Testes
O projeto possui testes automatizados no backend. Para executá-los:
cd Back
npm test
Também é possível verificar a compilação do frontend:
cd Front
npm run build
Além desses comandos, testamos manualmente os principais fluxos do sistema, como envio de mensagens, notificações, aceite de contratos, pagamento simulado e conclusão de fretes.
O que ainda queremos melhorar
Ainda temos funcionalidades e ajustes planejados, principalmente a integração com um serviço de pagamentos real, validações e documentos de transporte, melhorias na experiência de uso e testes de segurança mais completos. A recuperação de senha também depende da configuração de um serviço de envio de e-mails para funcionar integralmente.

Por enquanto, o Frete de Retorno é um protótipo acadêmico, não uma plataforma pronta para operação comercial.
Desenvolvimento em equipe
O projeto é desenvolvido em grupo, com organização do código pelo GitHub. Usamos a branch master como base principal e branches separadas para trabalhar em mudanças maiores antes de integrá-las por pull request.

Ao longo do desenvolvimento, trabalhamos com levantamento de requisitos, modelagem do banco de dados, construção das telas, implementação da API e testes. O projeto continua evoluindo conforme aprendemos e colocamos em prática os conteúdos do curso.
