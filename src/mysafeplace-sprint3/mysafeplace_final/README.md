# 🧠 MySafePlace — Saúde Mental Acessível
**Trabalho Interdisciplinar — Aplicações Web**
PUC Minas São Gabriel · Sistemas de Informação · 2026

---

## 👥 Equipe
| Integrante | Funcionalidade |
|---|---|
| Rafael Arcângelo | Agendamento de Consultas |
| Nicolly | Chat com Psicólogo + Avaliação de Psicólogos |
| Paulo Júlio | Perfil do Usuário + Favoritos |
| Kaio Fábio | Agenda / Diário de Compromissos |
| Rafael Reis | Pop-up Emergencial |

---

## 📁 Estrutura do Projeto
```
mysafeplace/
├── shared/
│   ├── db.json         ← Banco de dados unificado (JSON Server)
│   └── global.css      ← Paleta de cores e estilos comuns
│
├── agendamento/
│   └── index.html      ← Busca de psicólogos + agendamento (GPS, filtros, CRUD)
│
├── chat/
│   └── index.html      ← Chat com psicólogo (CRUD de mensagens)
│
├── avaliacoes/
│   └── index.html      ← Avaliação de psicólogos (CRUD)
│
├── perfil/
│   ├── index.html      ← Perfil do usuário (visualizar + editar)
│   └── favoritos.html  ← Lista de artigos favoritos
│
├── agenda/
│   ├── index.html      ← Calendário de compromissos (CRUD)
│   ├── app.js          ← Lógica da agenda
│   └── style.css       ← Estilos da agenda
│
└── popup/
    ├── index.html      ← Página inicial com pop-up emergencial
    └── popup.js        ← Lógica do pop-up
```

---

## ▶️ Como executar

### 1. Instalar o JSON Server (apenas na primeira vez)
```bash
npm install -g json-server
```

### 2. Iniciar o servidor
```bash
cd shared
npx json-server db.json
```
O servidor sobe em: **http://localhost:3000**

### 3. Abrir as páginas
Abra qualquer `index.html` com o **Live Server** do VS Code.

---

## 🔗 Funcionalidades
- **Agendamento**: busca psicólogos por GPS + filtros, agenda consultas, lista e cancela agendamentos
- **Chat**: troca mensagens com psicólogo, edita e exclui
- **Avaliações**: avalia psicólogos com nota e comentário, edita e exclui
- **Perfil**: visualiza e edita dados, gerencia artigos favoritos
- **Agenda**: calendário mensal com compromissos, criar/editar/excluir/buscar
- **Pop-up**: alerta emergencial com frases motivacionais e opções de atendimento (CVV 188)
