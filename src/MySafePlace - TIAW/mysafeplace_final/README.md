# MySafePlace

Projeto desenvolvido para a disciplina de Trabalho Interdisciplinar — Aplicações Web.
PUC Minas São Gabriel, Sistemas de Informação, 1º semestre de 2026.

## Integrantes

- Rafael Arcângelo Bosco Castro Chagas
- Nicolly Gomes Dalamora
- Paulo Júlio Gonçalves Santos
- Kaio Fábio Nogueira Perpétuo
- Rafael Eustáquio Maia Reis

## Sobre o projeto

O MySafePlace é um site voltado para saúde mental, com o objetivo de conectar pessoas a psicólogos de forma acessível. O projeto foi desenvolvido em HTML, CSS e JavaScript, usando JSON Server como banco de dados local.

## Funcionalidades

- Agendamento de consultas com busca por localização (GPS)
- Chat com psicólogo
- Avaliação de psicólogos
- Perfil do usuário e lista de favoritos
- Agenda de compromissos
- Pop-up emergencial com opções de atendimento

## Como rodar

1. Instale o JSON Server caso não tenha:
```
npm install -g json-server
```

2. Na pasta `shared`, rode:
```
npx json-server db.json
```

3. Abra o arquivo `index.html` com o Live Server do VS Code.
