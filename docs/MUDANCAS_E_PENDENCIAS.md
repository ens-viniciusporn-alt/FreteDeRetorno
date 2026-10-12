# Alterações realizadas e limitações

## Alterações efetivas

1. A base oficial continua **React + Vite** (`Front`) e **Express + Sequelize** (`Back`). A interface HTML duplicada que havia dentro de `Back` não está na cópia limpa. Preserve o ZIP anterior como referência.
2. `.gitignore` raiz, `Back/.env.example`, documentação e comandos npm de inicialização e testes.
3. Conexão PostgreSQL usa variáveis de ambiente, valida SSL e falha ao iniciar se o banco não conectar.
4. Login com cookie HttpOnly assinado (validade 24h), verificação no servidor e bloqueio de rotas por perfil. O token de sessão é invalidado pela troca de senha. `sessionStorage` deixou de definir identidade.
5. Removidas as rotas de listar/alterar/excluir usuários por ID sem autenticação. O perfil usa `PATCH /api/usuarios/me` e não exige `atualizar_nome_usuario()`.
6. Validação de cadastro no backend, bcrypt com custo 12, e normalização básica de e-mail. Limites de tentativas simples em memória para rotas sensíveis.
7. Páginas React de recuperação e redefinição de senha com token de uso único (envio real via Resend, se configurado).
8. Páginas React para cadastro/listagem/cancelamento de cargas, criação/listagem/atualização de viagens, busca simples de oportunidades.
9. Dashboards mostram dados reais dos próprios usuários em vez de estatísticas demonstrativas.
10. `database/001_funcionalidades.sql` cria as tabelas adicionais, mediante execução MANUAL.

## Funcionalidades do projeto antigo

| Referência antiga | Resultado novo |
|---|---|
| `pages/auth/recuperação-senha.html` | Convertida em fluxo React + API, e-mail externo ainda precisa ser configurado |
| `pages/transportador/cadastrar-viagem.html` e `js/cadastrar-viagem.js` | Formulário React + persistência PostgreSQL real |
| `pages/transportador/minhas-viagens.html` | Lista React do próprio usuário + mudança de status no banco |
| `pages/cliente/meus-envios.html` | Primeira versão das cargas do cliente, com cadastro/listagem/cancelamento |
| `pages/cliente/rastreamento.html` | Pendente: exige eventos de rastreamento reais e regras de acesso |
| `pages/cliente/pagamentos.html` | Pendente: exige provedor, conciliação, segurança e tratamento fiscal |
| `pages/cliente/suporte.html` | FAQ React com busca, sem envio de chamados (pendente) |
| `pages/cliente/nota-fiscal.html` | Pendente: não é correto emitir documentos fictícios como notas fiscais reais |

## Antes de lançar publicamente — ainda obrigatório

- Especificar regras de negócio de frete de retorno, negociação, pagamento e responsabilidade por carga.
- Provedor de pagamentos com webhooks e confirmação; nunca armazenar cartões no sistema.
- Melhor proteção de sessões: considerar armazenamento revogável no servidor, detecção de sessão, renovação e logout global. O logout atual apaga o cookie, mas não revoga cópias roubadas antes do vencimento (24h).
- Implementar política de privacidade, termos reais e contato de suporte (as páginas incluídas são MINUTAS para desenvolvimento).
- Reforçar o controle de tentativas em ambiente distribuído, monitoramento, testes com usuários e auditoria de dependências.
- Implementar negociação/associação entre cargas e viagens e autorização desses fluxos.
- Testes integrados automatizados com PostgreSQL de desenvolvimento e testes de interface (não foram executados no Neon do usuário).
- Revisar constraints e migrações futuras com a equipe, antes de executar no banco compartilhado.

**Nenhum dado do Neon foi alterado durante a preparação desta cópia.**
