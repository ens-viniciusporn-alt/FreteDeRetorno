# telas.md — Documentação das telas

**Projeto:** Frete de Retorno
**Descrição:** plataforma acadêmica que aproxima quem precisa transportar cargas de transportadoras e motoristas com espaço livre em viagens de retorno.
**Stack:** React 19 + Vite + React Router (Front) · Node.js + Express 5 + Sequelize (Back) · PostgreSQL no Neon.
**Estado geral:** versão de desenvolvimento, ainda não pronta para lançamento público (conforme o próprio README do projeto).

## Legenda de situação

| Situação | Significado |

| ✅ Concluída | Tela pronta, ligada à API e funcionando no fluxo principal |
| 🟡 Em andamento | Tela existe, mas está parcial, depende de configuração externa ou usa dados fictícios |
| ⬜ A fazer | Tela ainda não existe (ou é só um aviso "em construção") |

## Resumo

| Situação | Quantidade |
|---|---|
| ✅ Concluída | 7 |
| 🟡 Em andamento | 10 |
| ⬜ A fazer | 7 |
| **Total** | **24** |


## 1. Telas públicas

| Página inicial | Landing page com cabeçalho e menu (responsivo), "Como funciona" (4 etapas), "Benefícios" (6 cards), "Para quem é" (cliente × transportador), chamada final e rodapé. Os botões levam ao cadastro já com o perfil escolhido | ✅ Concluída |


| Login | E-mail e senha com validação, mostrar/ocultar senha e estado "Entrando…". recebe o cookie de sessão e redireciona para a pagina conforme o perfil. | ✅ Concluída |


| Cadastro | Escolha de perfil (Cliente ou Transportador, pré-selecionado pela URL), nome, e-mail, telefone opcional, senha (mín. 8 caracteres) com confirmação e aceite dos termos. e oferece "Ir para o login" ao concluir. | ✅ Concluída |


| Recuperar senha | Pede o e-mail e gera um token de uso único (guardado só como hash, validade de 30 min) e envia o link por e-mail. **Falta:** configurar o serviço Resend sem isso a API responde 503 e nenhum e-mail sai. | 🟡 Em andamento |


| Redefinir senha | Lê o token da URL e permite definir a nova senha. Mostra "link inválido" quando não há token. Depende da tela anterior para o usuário receber o link. | 🟡 Em andamento |


| Termos de uso | Exibe os termos, com aviso de que não substitui o texto jurídico definitivo. Texto final ainda precisa ser revisado e aprovado. | 🟡 Em andamento |


| Política de privacidade | Exibe a política (dados coletados, ambiente de testes). Falta definir responsáveis, contatos, prazos de retenção e direitos dos titulares. | 🟡 Em andamento |


## 2. Área do cliente (perfil cliente)

| Dashboard do cliente | Saudação com o nome do usuário, 4 cards calculados a partir das cargas reais (abertas, em negociação, entregues, total), 5 cargas mais recentes e atalhos rápidos. Os cards "Em negociação" e "Entregues" ficarão zerados até existir negociação (ver pendências). | ✅ Concluída |


| Minhas cargas / Nova carga | Formulário para cadastrar carga (origem, destino, descrição, volume em m³), lista das próprias cargas e botão **Cancelar** para cargas abertas. O backend impede origem igual ao destino. "Nova carga" no menu é a mesma tela, rolando até o formulário. | ✅ Concluída |


| Encontrar transporte | Lista as viagens agendadas publicadas pelas transportadoras (rota, data, veículo, capacidade) com busca por origem/destino. **Falta:** escolher uma viagem, enviar proposta/contratar e filtrar por compatibilidade com a carga. A própria tela avisa que a negociação ainda será desenvolvida. | 🟡 Em andamento |


| Configurações do perfil | Permite editar apenas o **nome**. E-mail e telefone aparecem somente para leitura. **Falta:** alterar telefone, e-mail e senha logado. | 🟡 Em andamento |


| Suporte | Central de ajuda com 6 perguntas frequentes e busca. Não há abertura de chamados: a tela informa que o atendimento com protocolo ficará para uma próxima etapa. | 🟡 Em andamento |


## 3. Área da transportadora (perfil transportadora)


| Visão geral | Painel com 4 cards calculados das viagens reais (agendadas, capacidade anunciada em m³, concluídas, total), próximas 5 viagens e atalhos. | ✅ Concluída |


| Minhas viagens / Cadastrar viagem | Formulário de viagem (origem, destino, data de saída, veículo, capacidade em m³) e lista das próprias viagens com ações **Iniciar**, **Concluir** e **Cancelar**, seguindo as transições válidas (Agendada → Em andamento/Cancelada; Em andamento → Concluída/Cancelada). A API exige data de hoje ou futura. | ✅ Concluída |


| Cargas disponíveis | Lista as cargas abertas dos clientes (rota, descrição, volume) com busca por origem/destino. **Falta:** aceitar/propor frete, ver detalhes e cruzar com as viagens da transportadora. | 🟡 Em andamento |


| Configurações do perfil | Mesma tela do cliente: edita só o nome; e-mail e telefone somente leitura. | 🟡 Em andamento |


| Pagamentos | Hoje mostra apenas o aviso "Esta tela será convertida do HTML existente na próxima etapa". Depende de escolher um provedor de pagamentos e definir as regras do frete. | ⬜ A fazer |


## 4. Compartilhada

| Notificações | painel no topo dos dois dashboards | Sino com contador e painel com lista, "marcar como lida" e "marcar todas". **Falta:** todo o conteúdo é fixo no código (5 avisos inventados, como "Pagamento concluído"); nada vem do banco e nada é salvo. | 🟡 Em andamento |


## 5. Telas previstas que ainda não existem

Não têm rota nem arquivo. Estão registradas nos documentos do projeto como pendentes (`README.md` e `docs/MUDANCAS_E_PENDENCIAS.md`):


| Negociação e contratação | Propostas entre cliente e transportadora, vínculo entre uma carga e uma viagem, aceite/recusa. É o que faria as cargas passarem para "Em negociação", "Em transporte" e "Entregue". | ⬜ A fazer |


| Pagamentos do cliente | Pagar o frete pela plataforma. Exige provedor de pagamentos, confirmação por webhook e tratamento fiscal; nunca guardar cartão no sistema. | ⬜ A fazer |


| Rastreamento | Acompanhar a carga durante o transporte. Exige eventos de rastreamento reais e regras de acesso. | ⬜ A fazer |


| Nota fiscal | Documentos fiscais do transporte. O projeto registra que não se deve emitir documento fictício como nota real. | ⬜ A fazer |


| Abertura de chamados (suporte) | Formulário que gere atendimento com protocolo. Hoje o suporte é apenas FAQ. | ⬜ A fazer |


| Mensagens (chat) | Conversa entre cliente e transportadora.| ⬜ A fazer |
