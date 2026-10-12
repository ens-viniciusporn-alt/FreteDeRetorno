# Frete de Retorno — versão integrada (React + API + Neon)

Projeto acadêmico para aproximar pessoas que precisam transportar cargas de transportadoras e motoristas com espaço disponível em viagens de retorno. Esta versão usa o site React como base e incorpora ideias do projeto HTML antigo (recuperação de senha, cargas, cadastro e gerenciamento de viagens).

> **Versão de desenvolvimento, não pronta para lançamento público.** Pagamentos, negociações, rastreamento GPS, notas fiscais, suporte automatizado e documentos legais definitivos ainda não foram implementados. A recuperação de senha exige integração de e-mail. Não trate telas em construção como serviços ativos.

## 1. Antes de começar

- Node.js recente compatível com Vite 8 (recomendado Node 22.12+ ou 24+).
- Um PostgreSQL acessível (Neon). **Você não precisa instalar outro PostgreSQL** no computador se já usa Neon.
- Faça um **backup do Neon** antes de qualquer alteração estrutural.
- Este projeto **não contém o arquivo `.env` nem credenciais reais**. Não coloque credenciais em `.js` ou no React.

## 2. Configurar o backend (Windows / terminal do VS Code)

```powershell
cd Back
npm ci
copy .env.example .env
```

Abra `Back/.env` e preencha o host, banco, usuário e senha próprios do ambiente; altere `SESSION_SECRET` para uma chave aleatória **única** com no mínimo 32 caracteres. Para gerar no terminal:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Não utilize o valor de exemplo nem publique o `.env` em GitHub, ZIP público ou chat. A conexão Neon usa SSL com verificação de certificado. Em desenvolvimento local **sem SSL**, ajuste `DB_SSL=false` somente se seu PostgreSQL local exigir.

> **Importante:** sessões antigas do frontend (`sessionStorage`) deixarão de funcionar; faça login novamente. Usuários já cadastrados no banco Neon continuam lá.

## 3. Criar as novas tabelas no Neon (manual, uma vez)

O banco original já tem `usuarios`. Para adicionar viagens, cargas e tokens de recuperação:

1. Faça um backup do Neon e certifique-se de estar no banco `SiteTransportadora`.
2. Entre no **SQL Editor** do Neon com uma role autorizada a criar tabelas.
3. Abra `database/001_funcionalidades.sql` neste projeto, confira o SQL e **execute manualmente**.
4. Confira as novas tabelas: `viagens`, `cargas`, `tokens_recuperacao`.

O script **não apaga nem altera usuários**, não usa `DROP`, não usa `TRUNCATE`, nem `sequelize.sync({force:true})`. Não foi executado pelo ChatGPT. **Não execute duas instâncias do app com migrações improvisadas; controle mudanças futuras por arquivos SQL versionados.**

## 4. Rodar no computador

No terminal 1:

```powershell
cd Back
npm start
```

Espere: `Conexão com o PostgreSQL realizada com sucesso.` O backend estará em `http://localhost:3000/api/health`.

No terminal 2:

```powershell
cd Front
npm ci
npm run dev
```

Abra `http://localhost:5173`. O Vite encaminha as chamadas `/api` para `localhost:3000` durante o desenvolvimento. O navegador recebe um cookie HttpOnly da API; **não usa senha ou token no `sessionStorage`**.

> Se testar em computadores diferentes, **cada desenvolvedor executa seu próprio backend/React**, mas todos podem apontar para o mesmo banco Neon com suas credenciais autorizadas. Não envie `.env` do dono do banco aos colegas. Para produção, coloque frontend e `/api` sob HTTPS e mesmo domínio (proxy reverso).

## 5. Recuperação de senha

A página **Esqueci minha senha** não é mais uma simulação. Ela cria um token aleatório, armazena somente seu hash no banco, valida expiração de 30 minutos e impede reutilização. O link redefine a senha com bcrypt.

**Para realmente enviar e-mails:** cadastre um serviço de e-mail Resend, valide o domínio remetente, e configure `RESEND_API_KEY`, `MAIL_FROM` e `PUBLIC_FRONTEND_URL` em `Back/.env`. Sem isso, a API responde `503`, informando que a recuperação não está configurada. Não é enviado e-mail falso nem anunciado sucesso enganoso. Configure as credenciais exclusivamente no backend.

## 6. Módulos incluídos

| Módulo | Situação desta versão |
|---|---|
| Cadastro / login | API real, hash bcrypt, sessão assinada em cookie HttpOnly |
| Perfil | Leitura validada no backend, edição do próprio nome, sem função SQL oculta |
| Cargas | Criar, listar próprias e cancelar quando abertas; PostgreSQL |
| Viagens | Criar, listar próprias, iniciar, concluir e cancelar; PostgreSQL |
| Buscar oportunidades | Consultar cargas abertas / viagens agendadas, somente logado |
| Dashboard | Contadores calculados a partir dos registros reais (não fictícios) |
| Recuperação de senha | API, hash de token, uso único; precisa Resend |
| Suporte (FAQ) | Busca de perguntas e respostas, sem envio de chamados ainda |
| Pagamentos, rastreamento, notas fiscais | **Ainda não implementados**; não processam dinheiro nem emitem documentos |

Não há sistema de propostas, contratação ou matching geográfico automático. Viagens disponíveis e cargas abertas são listagens básicas, não uma negociação de frete.

## 7. Segurança e publicação no GitHub

- `.gitignore` na raiz ignora `.env`, `node_modules`, arquivos `.backup`, logs e builds.
- Nunca publique `DB_PASSWORD`, `SESSION_SECRET`, `RESEND_API_KEY`, cookies de sessão, backup com usuários, etc.
- `SiteTransportadora_owner` funciona nos testes, mas para **produção crie uma role `app_frete` com privilégios mínimos** sobre tabelas e sequências utilizadas. O app não precisa ser dono do banco.
- A API antiga de listar, alterar e excluir qualquer usuário por ID foi removida. Não reintroduza rotas administrativas sem autorização.
- As permissões de administrador do projeto Neon e as roles PostgreSQL são coisas diferentes.
- Antes do lançamento: revisão LGPD/termos, auditoria de dependências (`npm audit`), limites compartilhados de tentativas, backups, HTTPS, monitoramento e testes de autorização. O rate limiter incluído é **em memória** e não é robusto para várias instâncias.
- Se a senha do Neon já apareceu em código público, **troque-a no Neon**. Ignorar `.env` não elimina segredos do histórico Git.

## 8. Rodar testes

```powershell
cd Back
npm test
```

```powershell
cd Front
npm run lint
npm run build
```

Estes são testes locais básicos, não substituem os testes integrados com um banco de desenvolvimento. Veja `docs/TESTES_MANUAIS.md`.

## 9. Organização da equipe

- `main`: versão estável; evitem alterações diretas.
- `feature/...`: cada colega trabalha em uma branch; integrar com Pull Request.
- Cada desenvolvedor deve ter `.env` próprio no backend, sem publicar credenciais no GitHub.
- Fazer backup antes de migrações. Usar scripts em `database/` para manter o schema reproduzível.

## Estrutura

```text
Frete-de-Retorno_Atualizado/
├── .gitignore
├── README.md
├── Back/           # Node + Express + Sequelize (API)
│   ├── .env.example
│   ├── middlewares/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── test/
│   └── server.js
├── Front/          # React + Vite
│   └── src/
│       ├── context/
│       ├── components/
│       └── pages/
├── database/       # Migração SQL opcional/manual
└── docs/           # Comparação, mudanças e plano de testes
```

**O projeto HTML anterior foi usado como referência, não copiado como segunda aplicação ativa.** Seus arquivos originais continuam no ZIP antigo que você enviou.
