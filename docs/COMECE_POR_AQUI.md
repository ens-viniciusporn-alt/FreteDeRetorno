# Comece por aqui (passo a passo, sem mexer no original)

1. **Descompacte** o ZIP atualizado em uma pasta NOVA. Não substitua `Site Transportadora` ainda.
2. Faça **backup do banco SiteTransportadora no Neon**, pois todos os seus colegas utilizam os mesmos dados.
3. Dentro de `Back`, duplique `.env.example` e renomeie a cópia como `.env`. Preencha com as credenciais do Neon e crie uma nova `SESSION_SECRET` conforme `README.md`. **Não coloque a senha no GitHub.**
4. No Neon, revise e execute manualmente `database/001_funcionalidades.sql` para criar `cargas`, `viagens` e `tokens_recuperacao`. Esse é o único passo que altera o schema e você escolhe quando fazer.
5. Terminal 1: `cd Back`, `npm ci`, `npm start`.
6. Terminal 2: `cd Front`, `npm ci`, `npm run dev`.
7. Abra `http://localhost:5173`, entre na conta de teste já existente e verifique a página de perfil.
8. Com uma conta **CLIENTE**, cadastre uma carga e confira pelo pgAdmin no Neon.
9. Com uma conta **TRANSPORTADORA**, cadastre uma viagem e confira que ela aparece para o cliente.
10. Rode `npm test` em Back e `npm run lint` / `npm run build` em Front. Só depois de conferir os resultados preparem o repositório privado no GitHub.

> Se algo falhar, pare no passo e envie a captura do erro **sem mostrar senha**, que podemos corrigir antes do próximo passo.

## O que não está pronto

Não coloque o projeto em produção pública ainda: o serviço de e-mail depende de configuração; suporte, negociação, rastreamento e pagamentos ainda precisam ser desenvolvidos e os textos jurídicos são minutas.
