# Roteiro de testes manuais (após criar as tabelas no Neon)

> Preferir banco de testes/branch de desenvolvimento do Neon. Antes de usar o banco compartilhado, faça backup. Não use senhas reais ou dados de terceiros nos testes.

1. Instale backend/frontend (`npm ci`); preencha `.env` sem publicar; execute `npm start` e `npm run dev` em terminais diferentes.
2. Abra `http://localhost:3000/api/health` → `{"status":"ok"}`. Confira conexão do backend ao Neon.
3. Crie contas fictícias CLIENTE e TRANSPORTADORA. Teste senha curta, confirmação divergente, e-mail duplicado.
4. Faça login como CLIENTE. Abra `/cliente`, `/cliente/cargas`, cadastre carga e confira o registro no pgAdmin Neon.
5. Faça login como TRANSPORTADORA. Abra `/transportadora`, cadastre uma viagem e consulte cargas disponíveis.
6. Volte ao CLIENTE e veja viagens disponíveis; confirme o mesmo registro criado pelo transportador.
7. Teste logout, atualize a página e confira se é redirecionado para o login.
8. Copie URL `/cliente` para uma aba anônima; não deve permitir acesso sem sessão.
9. Autorização: um CLIENTE não pode acessar `/api/viagens/minhas`; uma TRANSPORTADORA não deve acessar `/api/cargas/minhas` ou atualizar perfil de outra pessoa.
10. Teste alterações do nome pelo perfil; verifique que o perfil de outra pessoa não muda.
11. Configure Resend e tabela `tokens_recuperacao`: solicite recuperação, abra o link, troque a senha, verifique que o link não funciona novamente e que a senha antiga perde acesso.
12. Teste layout em largura de celular e desktop, navegação pelo teclado e mensagens de erro quando backend estiver desligado.

## Limites conhecidos

- Não há testes de pagamentos, notas fiscais, rastreamento real, contratação e chat porque esses recursos ainda não existem nesta versão.
- O backend usa uma sessão assinada por cookie, sem revogação centralizada; configure HTTPS e servidor seguro antes de qualquer publicação pública.
- Se as páginas de cargas/viagens retornarem erro sobre tabelas inexistentes, confira a execução manual da migração `database/001_funcionalidades.sql`.
