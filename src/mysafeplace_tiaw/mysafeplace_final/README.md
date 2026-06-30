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

O MySafePlace é um site voltado para saúde mental, com o objetivo de conectar pessoas a psicólogos de forma acessível. O projeto foi desenvolvido em HTML, CSS e JavaScript (vanilla), com Bootstrap 5 na interface, e usa o **Supabase** (banco de dados PostgreSQL na nuvem) como backend, acessado via API REST.

## Funcionalidades

- Agendamento de consultas com busca por localização (GPS)
- Chat com psicólogo
- Avaliação de psicólogos
- Perfil do usuário e lista de favoritos
- Agenda de compromissos
- Pop-up emergencial com opções de atendimento

## Tecnologias

- HTML, CSS e JavaScript (vanilla)
- Bootstrap 5
- Supabase (PostgreSQL + API REST)
- Hospedagem: Vercel

## Como rodar

O banco de dados (Supabase) já está configurado em `shared/supabase.js` — não é preciso instalar nada localmente.

1. Baixe ou clone o repositório.
2. Abra o `index.html` com o **Live Server** do VS Code (ou qualquer servidor estático).
3. Pronto — as páginas já se conectam ao Supabase automaticamente.

> Versão online: https://mysafeplace-tau.vercel.app
