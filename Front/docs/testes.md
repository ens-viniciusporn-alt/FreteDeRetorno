# Documentação de Testes — Frete de Retorno

Este documento registra os testes realizados no frontend do sistema Frete de Retorno, com o objetivo de verificar o funcionamento das telas, funcionalidades, navegação e interação do usuário com a plataforma.

Os testes são realizados manualmente, por meio da utilização das funcionalidades disponíveis no sistema.


## 1. Testes de Autenticação


| Login | Informar e-mail e senha válidos e tentar acessar o sistema. | O usuário deve ser autenticado e direcionado à sua área correspondente. |✅ Validado |


| Cadastro | Preencher os campos necessários e realizar um novo cadastro. | O sistema deve registrar o usuário e apresentar o resultado da operação. | ✅ Validado |


| Recuperação de senha | Acessar a opção de recuperação de senha e seguir as instruções apresentadas. | O usuário deve conseguir iniciar o processo de recuperação. | ❌Não Validado |


| Redefinição de senha | Acessar a tela de redefinição e informar uma nova senha. | O sistema deve permitir a definição de uma nova senha conforme as regras estabelecidas. | ❌Não Validado |


## 2. Testes de Navegação


| Navegação do cliente | Acessar as opções disponíveis no painel do cliente. | As opções devem direcionar às páginas correspondentes. | ✅ Validado |


| Navegação da transportadora | Acessar as opções disponíveis no painel da transportadora. | As opções devem direcionar às páginas correspondentes. | ✅ Validado |


| Acesso às áreas restritas | Tentar acessar páginas protegidas sem a autenticação ou com um tipo de usuário diferente do permitido. | O sistema deve impedir o acesso não autorizado. | 🟡Pendente de validação |


| Retorno à página inicial | Utilizar os links disponíveis para retornar à página inicial. | O usuário deve ser direcionado corretamente à página inicial. | 🟡Pendente de validação |


## 3. Testes das Funcionalidades


| Consulta de cargas | Acessar a área de cargas e verificar as informações apresentadas. | As informações disponíveis devem ser exibidas corretamente. | ✅ Validado |


| Consulta de viagens | Acessar a área de viagens e verificar os registros apresentados. | As informações das viagens devem ser exibidas corretamente. | ✅ Validado |


| Configurações do perfil | Acessar as configurações e verificar os dados apresentados. | As informações do perfil devem ser exibidas corretamente. | ✅ Validado |


| Painel de notificações | Abrir o painel pelo ícone de notificações. | O painel deve ser exibido com as notificações disponíveis. | ✅ Validado |


| Marcar notificações como lidas | Utilizar as opções de leitura individual e de todas as notificações. | O contador de notificações não lidas deve ser atualizado corretamente. | ✅ Validado |


## 4. Testes de Interface


| Responsividade | Acessar as páginas em diferentes tamanhos de tela. | Os elementos devem se adaptar às dimensões do dispositivo. |🟡 Pendente de validação |


| Exibição dos formulários | Acessar os formulários disponíveis e verificar seus campos e botões. | Os elementos devem ser apresentados de forma organizada e utilizável. | ✅ Validado |


| Exibição das mensagens | Verificar mensagens de sucesso, erro e validação nos formulários. | As mensagens devem ser claras e apresentadas conforme o resultado da operação. | ✅ Validado |


## 5. Observações

- Os testes são registrados conforme sua execução e validação.
- A situação "Validado" indica que o funcionamento foi verificado.
- A situação "Pendente de validação" indica que o teste ainda precisa ser realizado ou conferido.
- A situação "Não validado" indica que foi testado porem não ocorreu o resultado esperado
- Novos testes poderão ser adicionados conforme funcionalidades forem implementadas no projeto.

