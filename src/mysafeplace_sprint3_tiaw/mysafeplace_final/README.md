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

O MySafePlace é um site voltado para saúde mental, com o objetivo de conectar pessoas a psicólogos de forma acessível. O projeto foi desenvolvido em HTML, CSS e JavaScript (vanilla), com Bootstrap 5 na interface, e armazena os dados no **localStorage** do navegador — cada usuário interage apenas com a própria cópia dos dados, sem backend compartilhado.

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
- Armazenamento local no navegador (localStorage)
- Hospedagem: Vercel

## Como rodar

Não é preciso instalar nada nem rodar servidor de banco de dados. Os dados ficam no `localStorage` do navegador (a camada de dados está em `shared/supabase.js`), com um conjunto inicial carregado automaticamente na primeira visita.

1. Baixe ou clone o repositório.
2. Abra o `index.html` com o **Live Server** do VS Code (ou qualquer servidor estático).
3. Pronto — cada navegador guarda os próprios dados.

> Versão online: https://mysafeplace-tau.vercel.app
