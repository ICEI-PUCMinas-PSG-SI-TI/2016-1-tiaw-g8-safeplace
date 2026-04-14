# Especificações Do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Contexto.md"> Documentação de Contexto</a></span>

## Personas

Ana tem 23 anos, ela é uma estudante universitária no curso de Sistemas de informação. Ela tem um quadro intenso de ansiedade e insônia e gostaria de buscar ajuda profissional para tratar destes problemas. A estudante buscou por um psicólogo e se deparou com uma situação que parecia fora da sua relidade: uma consulta custava R$ 150,00. Buscou então um psicólogo pelo SUS, porém encontrou à sua frente uma fila enorme de pessoas também buscando uma vaga. Ela gostaria que fosse mais fácil buscar ajuda para tratar seus transtornos, e acha que fazer isso virtualmente seria prático, principalmente se aliado a custos reduzidos e/ou gratuitos.

Dr. Roberto tem 45 anos e é formado em psicologia e especializado em terapia cognitivo-comportamental. Ele possui um consultório próprio mas gostaria também de fazer parte de um projeto mais humanitário e que democratize a psicologia para mais pessoas, porém possui dificuldade com tecnologias e gostaria de um site/aplicativo que lhe servisse de forma intuitiva, além de desejar ter uma forma de acompanhar a vida do paciente para poder acolhe-lo melhor. 

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO...          | QUERO/PRECISO ...                         |PARA ...                                              |
|--------------------|-------------------------------------------|------------------------------------------------------|
|Pessoa com ansiedade| Atendimento por chat/videochamada         | Me auxiliar com crises de ansiedade e manter a calma |
|Pessoa com depressão| Diário e agenda online                    | Me manter em contato com a realidade a minha volta   |
|Pessoa com burnout  | Ler artigos sobre saúde mental e trabalho | Entender como a exaustão atrapalha minha vida        |
|Pessoa com depressão| Localizar psicólogos próximos a mim       | Me incentivar a sair mais de casa e ser mais social  |
|Psicóloga           | Cadastrar um perfil e horários de trabalho| Auxiliar quem precisar de tratamento                 |
|Pessoa com bulimia  | Conteúdos educativos em redes sociais     | Entender como posso me amar mais e me aceitar        |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Diário de alta ajuda | ALTA | 
|RF-002| Chat e videochamada    | MÉDIA |
|RF-003| Serviços de Atendimento baseado na localização | MÉDIA |
|RF-004|	Botões de Interação Intuitivo	|ALTA|
|RF-005|	Menu de interação	|ALTA|
|RF-006|	Pop-up interativo e objetivo	|ALTA|
|RF-007|	Sistema de Login 	|BAIXA|
|RF-008|Painel do Usuário	|BAIXA|
|RF-009|	Sistema de agendamento para atendimento	|MÉDIA|


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001|	O sistema deve ser responsivo para rodar em dispositivos móveis|	MÉDIA|
|RNF-002|	Deve processar requisições do usuário em no máximo 3s|	BAIXA|
|RNF-003|	O sistema deve conter textos complementares informativos	|BAIXA|
|RNF-004	|O site deve disponibilizar links para redes sociais	|BAIXA|
|RNF-005|	O site deve possuir um rodapé informativo	|BAIXA|
|RNF-006	|A interface deve ser intuitiva para usuários com pouca afinidade tecnológica	|ALTA|

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |
|03| Todas as alterações devem ser documentadas no GitHub  |
