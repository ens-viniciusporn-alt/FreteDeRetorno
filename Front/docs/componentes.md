# componentes.md — Catálogo de componentes

**Projeto:** Frete de Retorno (ProjetoFretesOficial)

O projeto tem duas aplicações: o **Front** (React + Vite) e o **Back** (API Express + Sequelize). Este catálogo registra o que existe em cada parte e a responsabilidade de cada item.


# PARTE 1 — Front-end

## 1. Núcleo da aplicação


| Ponto de entrada | `src/main.jsx` | Monta o React no `#root` dentro do `StrictMode` e carrega `index.css`. |


| App (roteador) | `src/App.jsx` | Declara todas as rotas com `BrowserRouter`, envolve tudo no `AuthProvider`, importa os CSS globais e define o helper `Protect` (atalho para `ProtectedRoute`). Rota desconhecida redireciona para `/`. |


| Cliente da API | `src/utils/api.js` | Função `api(path, {method, body, signal})`: chama `/api…` com `fetch`, envia o cookie (`credentials: same-origin`), serializa JSON e lança `Error` com a mensagem `erro` devolvida pela API quando a resposta não é 2xx. |


## 2. Autenticação (estado global)


| AuthProvider | `context/AuthContext.jsx` | Guarda o usuário logado e o estado `carregando`. Ao abrir o app consulta `GET /auth/me`. Expõe `usuario`, `carregando`, `entrar(email, senha)`, `sair()` e `recarregar()`. A identidade vem sempre do servidor; nada de senha ou token no navegador. |


| Contexto | `context/auth-context.js` | Cria o `Context` do React usado pelo provider e pelo hook (arquivo separado por causa da regra de *fast refresh* do ESLint). |


| Hook `useAuth` | `context/useAuth.js` | Dá acesso ao contexto nos componentes e lança erro se usado fora do `AuthProvider`. |


| ProtectedRoute | `components/ProtectedRoute.jsx` | Guarda de rota com a prop `tipo`. Enquanto valida, mostra "Validando sua sessão…"; sem usuário, manda para `/login`; com perfil errado, manda para o painel do perfil correto. |


## 3. Componentes do site público


| Header | `components/Header.jsx` | Cabeçalho da landing page: marca, menu âncora (Início, Como funciona, Benefícios, Para quem é, Contato) e botões Entrar / Criar conta. Controla o menu "hambúrguer" no celular (estado `menuOpen`, `aria-expanded`) e fecha ao clicar num link. |


| Footer | `components/Footer.jsx` | Rodapé com marca, colunas de links (Plataforma, Acesso, Contato) e direitos autorais. |


| Button | `components/Button.jsx` | Botão/link genérico com `variant` (`primary`, `outline`, `white`) e `size`; vira `<a>` quando recebe `href`. **Hoje não é importado por nenhuma página** (as telas usam as classes `btn` direto). |


## 4. Componentes dos painéis (`components/dashboard/`)


| DashboardLayout | `DashboardLayout.jsx` | `tipo`, `nome`, `children` | Moldura de todas as telas logadas: sidebar, barra superior (botão ☰, trilha "Painel / Área do cliente ou da transportadora", notificações, avatar e nome), área de conteúdo e rodapé com link "Voltar ao início". Controla a abertura da sidebar no celular. |


| Sidebar | `Sidebar.jsx` | `tipo`, `nome`, `aberta`, `aoFechar` | Menu lateral. Define os menus dos dois perfis (cliente: Dashboard, Minhas cargas, Nova carga, Encontrar transporte, Configurações, Suporte; transportadora: Visão geral, Minhas viagens, Cadastrar viagem, Cargas disponíveis, Configurações, Pagamentos). Mostra avatar/nome, destaca o item ativo, tem overlay para o celular e o botão **Sair** (chama `sair()` e vai para `/login`). |


| NotificationPanel | `NotificationPanel.jsx` | — | Sino com contador de não lidas e painel suspenso: lista, "marcar como lida", "marcar todas", estado vazio e fundo clicável para fechar. **Usa 5 notificações fixas no código**, ainda sem API. |


| StatCard | `StatCard.jsx` | `icon`, `titulo`, `valor`, `detalhe`, `tom` | Cartão de indicador numérico; `tom` define a cor do ícone (`azul`, `laranja`, `verde`, `roxo`). |


## 5. Páginas (um componente por tela)


| Inicio | `pages/Inicio.jsx` | Landing page completa (hero, como funciona, benefícios, público-alvo, CTA) usando Header e Footer. |


| Login | `pages/Login.jsx` + `Login.css` | Formulário de login: valida, chama `entrar()` do contexto e redireciona conforme o perfil. |


| Cadastro | `pages/Cadastro.jsx` + `Cadastro.css` | Formulário de cadastro com seletor de perfil (lê `?perfil=` da URL), validação e `POST /usuarios`. |


| RecuperarSenha | `pages/RecuperarSenha.jsx` | Solicita o link de redefinição por e-mail (`POST /auth/recuperar-senha`) e mostra a resposta neutra da API. |


| RedefinirSenha | `pages/RedefinirSenha.jsx` | Lê o `token` da URL e envia a nova senha (`POST /auth/redefinir-senha`). |


| InformacoesLegais | `pages/InformacoesLegais.jsx` | Uma só página para `/termos` e `/privacidade` (prop `tipo`), com texto de minuta. |


| EmConstrucao | `pages/EmConstrucao.jsx` | Aviso genérico de tela futura (prop `titulo`). Usada em `/transportadora/pagamentos`. |


| Cliente | `pages/Cliente.jsx` | Dashboard do cliente: busca `/cargas/minhas`, calcula os 4 StatCards, lista as 5 cargas recentes e os atalhos. |


| Transportadora | `pages/Transportadora.jsx` | Dashboard da transportadora: busca `/viagens/minhas`, calcula capacidade (m³) e totais, lista as próximas viagens e os atalhos. |


| Cargas | `pages/Cargas.jsx` | Cadastro, listagem e cancelamento de cargas do cliente (`/cargas`, `/cargas/minhas`, `/cargas/:id/cancelar`). Rola até `#nova` quando a URL pede. |


| Viagens | `pages/Viagens.jsx` | Cadastro, listagem e mudança de status das viagens da transportadora (`/viagens`, `/viagens/minhas`, `/viagens/:id/status`). |


| Disponiveis | `pages/Disponiveis.jsx` | Listagem com busca reutilizada pelos dois perfis: `tipo="viagens"` (cliente vê viagens, `/viagens/disponiveis`) e `tipo="cargas"` (transportadora vê cargas, `/cargas/disponiveis`). |


| ConfiguracoesPerfil | `pages/ConfiguracoesPerfil.jsx` + `.css` | Edição do nome (`PATCH /usuarios/me`), reutilizada pelos dois perfis (prop `tipo`). |


| Suporte | `pages/Suporte.jsx` | FAQ pesquisável (`<details>`) e aviso de que chamados ainda não existem. |


## 6. Estilos


| `styles/base.css` | Variáveis de design (cores azul `#0d2d63` e laranja, fonte, sombras, raios), reset, `.container`, `.section*`, `.section-header`, `.section-label`. |


| `styles/components.css` | Site público: `.site-header`, `.brand*`, `.main-nav`, `.nav-link`, botões `.btn`, `.btn-primary`, `.btn-outline`, `.btn-white`, `.btn-large`, `.menu-toggle`, hero, passos, benefícios, público-alvo, CTA e rodapé. |


| `styles/responsive.css` | Media queries (1100, 850 e 600 px) do site público. |


| `styles/auth.css` | Login, cadastro e recuperação: `.auth-page`, `.auth-card`, `.auth-form`, `.form-group`, `.form-error`, `.form-message`, `.password-wrapper`, `.profile-option*`, `.form-checkbox`, etc. |


| `styles/dashboard.css` | Painéis: `.dashboard-app`, `.dashboard-sidebar`, `.dashboard-topbar`, `.dashboard-nav*`, `.dashboard-panel`, `.dashboard-page-heading`, botões `.dashboard-primary-button` / `.dashboard-outline-button`, `.stat-grid`, `.stat-card*`, `.status-pill`, `.quick-action-card`, e todo o painel de notificações (`.notification-*`). |


| `styles/operacoes.css` | Telas de operação (cargas, viagens, disponíveis): `.operation-form`, `.operation-list`, `.operation-row`, `.operation-search`, `.operation-feedback`. |


| `styles/react-adjustments.css` | Ajuste da página "em construção". |


| `pages/Login.css`, `Cadastro.css`, `ConfiguracoesPerfil.css` | Ajustes específicos de cada tela (campo de senha, link "esqueci minha senha", formulário de perfil). |


| `index.css` | Base global do React: fonte, cor de texto e de fundo, rolagem suave, largura mínima do `body` e herança de fonte nos campos de formulário. |


# PARTE 2 — Back-end (API)

## 7. Infraestrutura


| Servidor | `server.js` | Cria o app Express (porta `PORT`, padrão 3000). Configura CORS só para as origens de `FRONTEND_ORIGINS`, limita o JSON a 32 kB, bloqueia requisições de escrita vindas de outros sites (origem não permitida, `sec-fetch-site: cross-site`, conteúdo que não seja JSON), registra as rotas, responde 404 em rotas desconhecidas e trata erros sem vazar detalhes. Só sobe depois de autenticar no banco. Exporta o `app` para os testes. |


| Banco de dados | `config/database.js` | Instância do Sequelize (PostgreSQL) lida do `.env`. Falha ao iniciar se faltar `DB_HOST`, `DB_NAME`, `DB_USER` ou `DB_PASSWORD`. Usa SSL com verificação de certificado, a menos que `DB_SSL=false`. Pool de até 5 conexões. |


| Sessão e permissões | `middlewares/auth.js` | `issue` cria o cookie `frete_session` (HttpOnly, SameSite=Lax, 24 h, assinado com HMAC-SHA256 e ligado a uma impressão digital da senha, por isso trocar a senha invalida a sessão); `clear` apaga o cookie; `required` valida o cookie e carrega o usuário; `role(perfil)` devolve 403 se o perfil não for o esperado; `publicUser` remove a senha dos dados devolvidos. Exige `SESSION_SECRET` com 32+ caracteres. |


| Limite de tentativas | `middlewares/limit.js` | Limitador por IP, em memória, com janela de 15 min (devolve 429 com `Retry-After`). Serve para desenvolvimento; não vale para várias instâncias. |


| Validação | `utils/validate.js` | Funções `text` (aparar e limitar tamanho), `email` (normaliza e valida), `strongPassword` (8+ caracteres, até 72 bytes por limite do bcrypt), `positiveNumber` e `positiveId`. |


## 8. Modelos (`models/`)


| Usuario | `usuarios` | `id_usuario`, `nome`, `email` (único), `telefone` (opcional), `senha` (hash), `tipo_usuario` (`CLIENTE` ou `TRANSPORTADORA`), `data_cadastro`. Tabela já existente no banco. |


| Carga | `cargas` | `id_carga`, `id_cliente`, `origem`, `destino`, `descricao`, `volume_m3`, `status` (padrão `ABERTA`), `criada_em`. |


| Viagem | `viagens` | `id_viagem`, `id_transportador`, `origem`, `destino`, `data_saida`, `veiculo`, `capacidade_m3`, `status` (padrão `AGENDADA`), `criada_em`. |


| PasswordReset | `tokens_recuperacao` | `usuario_id`, `token_hash`, `expira_em`, `usado_em`. Guarda só o hash do token de recuperação. |


## 9. Controllers, rotas e endpoints


| `authController.js` | `login`, `me`, `logout`, `requestReset`, `reset` | Login com bcrypt e emissão do cookie; devolve o usuário da sessão; encerra a sessão; gera e envia (via Resend) o link de recuperação, com resposta neutra para não revelar se o e-mail existe; redefine a senha em transação, usando o token uma única vez e invalidando os demais. |


| `usuarioController.js` | `inserir`, `atualizarMe` | Cadastro com validação, e-mail único (409 se repetido) e bcrypt custo 12; atualização do próprio nome. |


| `cargaController.js` | `create`, `mine`, `available`, `cancel` | Cria carga (origem ≠ destino, volume válido), lista as do cliente, lista as abertas para transportadoras (sem expor o dono) e cancela só cargas abertas do próprio cliente. |


| `viagemController.js` | `create`, `mine`, `available`, `update` | Cria viagem (data de hoje em diante), lista as do transportador, lista as agendadas para clientes e controla as transições de status. |


| GET | `/api/health` | público | Verificação de funcionamento. |

| POST | `/api/auth/login` | público (12 por 15 min) | Entrar. |

| GET | `/api/auth/me` | logado | Usuário da sessão. |

| POST | `/api/auth/logout` | público | Sair. |

| POST | `/api/auth/recuperar-senha` | público (5 por 15 min) | Pedir link de redefinição. |

| POST | `/api/auth/redefinir-senha` | público (10 por 15 min) | Definir nova senha com o token. |

| POST | `/api/usuarios` | público (8 por 15 min) | Cadastro. |

| PATCH | `/api/usuarios/me` | logado | Editar o próprio nome. |

| GET | `/api/cargas/minhas` | CLIENTE | Cargas do cliente. |

| POST | `/api/cargas` | CLIENTE | Criar carga. |

| PATCH | `/api/cargas/:id/cancelar` | CLIENTE | Cancelar carga aberta. |

| GET | `/api/cargas/disponiveis` | TRANSPORTADORA | Cargas abertas. |

| GET | `/api/viagens/minhas` | TRANSPORTADORA | Viagens do transportador. |

| POST | `/api/viagens` | TRANSPORTADORA | Criar viagem. |

| PATCH | `/api/viagens/:id/status` | TRANSPORTADORA | Iniciar, concluir ou cancelar. |

| GET | `/api/viagens/disponiveis` | CLIENTE | Viagens agendadas. |

Os arquivos em `routes/` (`authRoutes`, `usuarioRoutes`, `cargaRoutes`, `viagemRoutes`) só ligam cada endpoint ao controller e aos middlewares acima.


# PARTE 3 — Banco, testes e documentação

## 10. Banco de dados (`database/`)


| `001_funcionalidades.sql` | Cria `viagens`, `cargas` e `tokens_recuperacao` (com chaves estrangeiras, índices e `CHECK` de status e de origem ≠ destino) dentro de uma transação. Não apaga nem altera `usuarios`. **Deve ser executado manualmente** no Neon, após backup. |


| `002_permissoes_desenvolvedores_OPCIONAL.sql` | Concede aos usuários de banco `dev_vinicius` e `dev_natan` acesso aos dados e a criação de objetos no schema `public`. Opcional. |


Status previstos no banco para cargas: `ABERTA`, `NEGOCIACAO`, `EM_TRANSPORTE`, `ENTREGUE`, `CANCELADA`. Para viagens: `AGENDADA`, `EM_ANDAMENTO`, `CONCLUIDA`, `CANCELADA`.


## 11. Testes (`Back/test/`, rodam com `npm test`)


| `api.test.js` | 1 teste de ponta a ponta com o banco simulado: `/auth/me` sem cookie retorna 401; login válido devolve cookie HttpOnly; `/auth/me` não expõe a senha; cliente em rota de transportadora recebe 403; a antiga rota `/usuarios/:id` não existe mais (404); escrita vinda de origem externa é bloqueada (403). |


| `seguranca.test.js` | 3 testes: normalização de e-mail e rejeição de senha curta; cookie HttpOnly, assinado e que rejeita adulteração; bloqueio de rota para o perfil errado. |


Não há testes de interface no front (só `npm run lint` e `npm run build`) nem testes integrados com banco.


## 12. Documentação e configuração


| `README.md` | Guia completo: configurar, criar tabelas, rodar, recuperação de senha, módulos, segurança e organização da equipe. |

| `docs/COMECE_POR_AQUI.md` | Passo a passo de 10 etapas para colocar a versão para rodar. |


| `docs/MUDANCAS_E_PENDENCIAS.md` | O que mudou, o que veio do projeto HTML antigo e o que falta antes de lançar. |

| `docs/TESTES_MANUAIS.md` | Roteiro de 12 testes manuais. |

| `Back/.env.example` | Modelo das variáveis de ambiente. |

| `.gitignore` (raiz e Front) | Ignora `.env`, `node_modules`, logs, backups e builds. |

| `Front/vite.config.js` | Plugin React e proxy de `/api` para `http://localhost:3000` em desenvolvimento. |
