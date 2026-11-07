
# Frete de Retorno 🚚

O **Frete de Retorno** é um projeto acadêmico que estamos desenvolvendo no curso de Engenharia de Software.

A ideia é ajudar a aproveitar melhor o espaço de veículos que fazem viagens de retorno, aproximando clientes que precisam enviar cargas de transportadoras com capacidade disponível.

O projeto começou com um site mais simples, feito em HTML, CSS e JavaScript. Com o andamento do desenvolvimento, reorganizamos a aplicação usando React no frontend, Node.js no backend e PostgreSQL para armazenar os dados.

O sistema ainda está em desenvolvimento, mas já conseguimos implementar e testar boa parte do fluxo de uma contratação.

## Funcionalidades

Atualmente, o sistema conta com:

- **Cadastro e login:** acesso separado para clientes e transportadoras.
- **Cargas:** cadastro, consulta e gerenciamento das cargas.
- **Viagens:** cadastro e gerenciamento das viagens das transportadoras.
- **Busca de oportunidades:** clientes podem procurar viagens disponíveis e transportadoras podem consultar cargas cadastradas.
- **Conversas:** comunicação entre cliente e transportadora para negociar um frete.
- **Contratos:** envio de propostas pela transportadora, aceite pelo cliente e acompanhamento das etapas.
- **Pagamentos de teste:** simulação de pagamentos por PIX, cartão ou boleto, com cálculo de 10% de comissão da plataforma e 90% de repasse à transportadora.
- **Notificações:** avisos sobre mensagens, propostas, mudanças nos contratos e disputas.
- **Disputas:** registro de problemas e acompanhamento administrativo.
- **Perfil e painel:** consulta de informações e indicadores de cargas e viagens.

> **Observação:** os pagamentos são apenas simulações. O sistema não realiza cobranças, retenções ou transferências de dinheiro real.

## Tecnologias utilizadas

Utilizamos as seguintes tecnologias durante o desenvolvimento:

| Área | Tecnologias |
|---|---|
| Frontend | React, Vite, JavaScript, HTML e CSS |
| Backend | Node.js e Express |
| Banco de dados | PostgreSQL e Neon |
| Versionamento | Git e GitHub |
| Desenvolvimento | Visual Studio Code |

## Como executar o projeto

Para executar o sistema localmente, é necessário ter o Node.js instalado e acesso a um banco PostgreSQL configurado.

### 1. Baixar o projeto

Clone o repositório:

```bash
git clone https://github.com/ens-viniciusporn-alt/FreteDeRetorno.git
```

Entre na pasta:

```bash
cd FreteDeRetorno
```

### 2. Configurar o backend

Acesse a pasta do backend:

```bash
cd Back
npm install
```

Crie um arquivo `.env` com base no `.env.example` e configure as variáveis necessárias para a conexão com o banco, incluindo uma chave de sessão segura.

As credenciais do banco não são disponibilizadas no repositório.

Para iniciar o backend:

```bash
npm start
```

A API estará disponível em:

`http://localhost:3000/api/health`

### 3. Iniciar o frontend

Abra outro terminal na pasta principal do projeto e execute:

```bash
cd Front
npm install
npm run dev
```

Depois, acesse:

`http://localhost:5173`

### 4. Banco de dados

O projeto utiliza PostgreSQL, hospedado no Neon.

Os scripts SQL utilizados durante o desenvolvimento estão na pasta `database/`.

Antes de executar qualquer script, é importante verificar as dependências e as alterações que ele realiza. As migrações já aplicadas em um banco não precisam ser executadas novamente.

Para testes, utilizamos branches separadas no Neon, evitando alterações diretamente no banco principal.

## Estrutura do projeto

As pastas principais estão organizadas da seguinte forma:

```text
FreteDeRetorno/
├── Back/          # API e regras do sistema
├── Front/         # Telas e componentes React
└── README.md
```

## Testes

Durante o desenvolvimento, realizamos testes das funcionalidades do sistema, principalmente do cadastro, login, conversas, contratos e notificações.

Também utilizamos testes automatizados no backend.

Para executar os testes:

```bash
cd Back
npm test
```

Para verificar a compilação do frontend:

```bash
cd Front
npm run build
```

Além dos testes automatizados, testamos o fluxo de contratação com contas de cliente e transportadora em um ambiente separado.

## O que ainda queremos melhorar

Apesar dos avanços, o projeto continua em desenvolvimento.

Algumas melhorias que pretendemos trabalhar são:

- Integração com um serviço de pagamentos reais.
- Verificação de documentos dos motoristas e transportadoras.
- Melhorias na busca de cargas e viagens.
- Rastreamento de fretes.
- Aperfeiçoamento das regras de segurança e das disputas.
- Testes mais completos e melhorias na experiência de uso.

A recuperação de senha também depende da configuração de um serviço de envio de e-mails para funcionar completamente.

## Desenvolvimento em equipe

O Frete de Retorno é desenvolvido em equipe como parte das atividades do curso de Engenharia de Software.

Utilizamos o GitHub para organizar as alterações, trabalhar em branches separadas e integrar mudanças por meio de pull requests.

Ao longo do projeto, trabalhamos com levantamento de requisitos, modelagem do banco de dados, construção das telas, desenvolvimento da API e realização de testes.

O desenvolvimento continua conforme aprendemos novos conteúdos e colocamos em prática os conhecimentos adquiridos durante o curso.

---

**Projeto acadêmico em desenvolvimento — Engenharia de Software.**
