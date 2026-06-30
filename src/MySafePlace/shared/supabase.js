// MySafePlace — Banco de dados local (localStorage)
// Cada navegador guarda os próprios dados. Não há backend nem dados compartilhados:
// cada usuário interage apenas com a própria cópia.
//
// Os dados iniciais (SEED) são gravados no localStorage na primeira visita e
// ficam salvos no navegador. O objeto "db" mantém a mesma interface de antes
// (get / getById / post / put / patch / delete), então as páginas não mudam.

const SEED = {
  profissionais: [
    { id: "1", nome: "Ana Souza",     crp: "04/12345", sexo: "F", latitude: -19.9167, longitude: -43.9345, atendimento: ["presencial", "online"], disponibilidade: ["09:00", "10:00", "14:00", "16:00"] },
    { id: "2", nome: "Carlos Lima",   crp: "04/67890", sexo: "M", latitude: -19.93,   longitude: -43.95,   atendimento: ["presencial", "online"], disponibilidade: ["08:00", "11:00", "15:00"] },
    { id: "3", nome: "Fernanda Reis", crp: "04/11223", sexo: "F", latitude: -19.89,   longitude: -43.91,   atendimento: ["online"],               disponibilidade: ["09:00", "13:00", "17:00"] },
    { id: "4", nome: "Marcos Alves",  crp: "04/33445", sexo: "M", latitude: -19.95,   longitude: -44,      atendimento: ["presencial"],           disponibilidade: ["10:00", "14:00", "16:00"] }
  ],
  agendamentos: [],
  mensagens: [
    { id: 1, usuario: "Paciente",  mensagem: "Boa noite, estou me sentindo muito cansado emocionalmente.", horario: "20/05/2026 19:20", tipo: "paciente",  status: "enviada" },
    { id: 2, usuario: "Psicólogo", mensagem: "Boa noite. Pode me contar um pouco sobre o que está acontecendo?", horario: "20/05/2026 19:22", tipo: "psicologo", status: "respondida" },
    { id: 3, usuario: "Paciente",  mensagem: "Tenho sentido muita pressão na escola e dificuldade para dormir.", horario: "20/05/2026 19:24", tipo: "paciente",  status: "enviada" }
  ],
  avaliacoes: [
    { id: "1", paciente: "Maria Silva",  psicologo: "Dr. João Pereira", nota: 5, comentario: "Muito atencioso e demonstrou empatia durante toda a conversa.", data: "01/06/2026" },
    { id: "2", paciente: "Lucas Santos", psicologo: "Dra. Ana Costa",   nota: 4, comentario: "Atendimento muito bom, mas o tempo de resposta poderia ser menor.", data: "02/06/2026" }
  ],
  usuarios: [
    { id: 1, nome: "Paulo Júlio Gonçalves Santos", email: "paulojgs10@gmail.com", telefone: "(31) 99502-2492", cidade: "Belo Horizonte", favoritos: [1, 2] }
  ],
  artigos: [
    { id: "1", titulo: "Ansiedade: como reconhecer os sinais e buscar ajuda", resumo: "A ansiedade é uma das condições de saúde mental mais comuns. Entenda os principais sintomas e saiba quando procurar um profissional.", data: "10/01/2026 - 09:00", autor: "Dra. Camila Fonseca, Psicóloga Clínica", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 144, visualizacoes: 1946, categoria: "Ansiedade", tags: ["ansiedade", "saúde mental", "sintomas", "pânico"], imagemCapa: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=600", imagemAlt: "Pessoa com expressão preocupada olhando pela janela", destaque: true, publicado: true },
    { id: "2", titulo: "Depressão: muito além da tristeza", resumo: "Depressão não é fraqueza. É uma doença séria que afeta milhões de pessoas e tem tratamento eficaz.", data: "15/01/2026 - 14:00", autor: "Dr. Marcos Vinicius Almeida, Psiquiatra", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 227, visualizacoes: 3120, categoria: "Depressão", tags: ["depressão", "transtorno do humor", "tristeza", "tratamento"], imagemCapa: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=600", imagemAlt: "Pessoa sentada sozinha em um quarto escuro", destaque: true, publicado: true },
    { id: "3", titulo: "Mindfulness: presença plena no dia a dia", resumo: "A prática de mindfulness tem se mostrado eficaz na redução do estresse e da ansiedade. Veja como incorporá-la na sua rotina.", data: "20/01/2026 - 08:30", autor: "Dra. Letícia Drummond, Psicóloga", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 98, visualizacoes: 1400, categoria: "Mindfulness", tags: ["mindfulness", "meditação", "atenção plena", "estresse"], imagemCapa: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600", imagemAlt: "Pessoa meditando ao ar livre com olhos fechados", destaque: true, publicado: true },
    { id: "4", titulo: "Síndrome de Burnout: quando o trabalho adoece", resumo: "O esgotamento profissional afeta cada vez mais trabalhadores. Entenda o que é burnout, seus estágios e como se recuperar.", data: "25/01/2026 - 11:00", autor: "Dra. Camila Fonseca, Psicóloga Clínica", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 189, visualizacoes: 2650, categoria: "Estresse", tags: ["burnout", "esgotamento", "trabalho", "estresse ocupacional"], imagemCapa: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600", imagemAlt: "Pessoa com a cabeça apoiada sobre a mesa de trabalho, exausta", destaque: false, publicado: true },
    { id: "5", titulo: "Como a terapia online pode te ajudar", resumo: "A psicoterapia online cresceu muito nos últimos anos. Descubra como ela funciona, suas vantagens e se é indicada para você.", data: "01/02/2026 - 10:00", autor: "Dr. Marcos Vinicius Almeida, Psiquiatra", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 77, visualizacoes: 980, categoria: "Terapia", tags: ["terapia online", "psicologia", "videochamada", "acesso à saúde"], imagemCapa: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600", imagemAlt: "Pessoa em videochamada com psicólogo no notebook", destaque: false, publicado: true },
    { id: "6", titulo: "Autocuidado em saúde mental: pequenos hábitos, grandes resultados", resumo: "Cuidar da saúde mental não exige grandes mudanças. Hábitos simples no dia a dia fazem enorme diferença no bem-estar emocional.", data: "05/02/2026 - 07:00", autor: "Dra. Letícia Drummond, Psicóloga", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 139, visualizacoes: 1720, categoria: "Autocuidado", tags: ["autocuidado", "bem-estar", "hábitos saudáveis", "sono"], imagemCapa: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600", imagemAlt: "Pessoa escrevendo em um diário em ambiente aconchegante", destaque: true, publicado: true },
    { id: "7", titulo: "TDAH em adultos: o que você precisa saber", resumo: "O Transtorno de Déficit de Atenção e Hiperatividade não desaparece na infância. Veja como ele se manifesta na vida adulta.", data: "10/02/2026 - 13:00", autor: "Dr. Marcos Vinicius Almeida, Psiquiatra", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 203, visualizacoes: 3055, categoria: "TDAH", tags: ["TDAH", "déficit de atenção", "hiperatividade", "diagnóstico"], imagemCapa: "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=600", imagemAlt: "Pessoa distraída olhando pela janela com caderno aberto", destaque: false, publicado: true },
    { id: "8", titulo: "Como ajudar alguém em crise emocional", resumo: "Saber como agir diante de uma crise emocional pode fazer toda a diferença. Veja orientações práticas para apoiar quem você ama.", data: "14/02/2026 - 09:30", autor: "Dra. Camila Fonseca, Psicóloga Clínica", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", likes: 170, visualizacoes: 2100, categoria: "Crise Emocional", tags: ["crise emocional", "como ajudar", "suporte emocional", "CVV"], imagemCapa: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=600", imagemAlt: "Duas pessoas se abraçando em momento de conforto emocional", destaque: true, publicado: true }
  ],
  favoritos: [
    { id: 1, usuario_id: 1, artigo_id: 1, dataFavoritado: "2026-06-05" },
    { id: 2, usuario_id: 1, artigo_id: 2, dataFavoritado: "2026-06-05" }
  ],
  compromissos: [
    { id: 1, titulo: "Consulta - Ana Souza",   data: "2026-07-07", hora_inicio: "09:00", hora_fim: "10:00", tipo: "video",      participante: "Dra. Ana Souza" },
    { id: 2, titulo: "Consulta - Carlos Lima",  data: "2026-07-10", hora_inicio: "11:00", hora_fim: "12:00", tipo: "presencial", participante: "Dr. Carlos Lima" }
  ],
  popup_emergencial: [
    {
      id: 1, ativo: true,
      titulo: "Ei, como você está se sentindo agora?",
      descricao: "Se as coisas parecerem pesadas demais ou se você estiver passando por um momento de crise, lembre-se que não precisa carregar isso sozinho. Nós temos uma rede pronta para te apoiar.",
      icone: "bi-exclamation-triangle-fill",
      botoes: [
        { id_botao: 1, texto: "Atendimento urgente",  icone: "bi-telephone-fill", tipo_acao: "abrir_chamada_chat", classe_css: "btn-urgente" },
        { id_botao: 2, texto: "Continuar navegando",  icone: "",                  tipo_acao: "fechar_modal",       classe_css: "btn-continuar" }
      ]
    }
  ],
  frases_motivacionais: [
    { id: 1, frase: "Pedir ajuda é um ato de coragem, não de fraqueza." },
    { id: 2, frase: "Você não precisa enfrentar isso sozinho." },
    { id: 3, frase: "Cada dia é uma nova oportunidade de cuidar de você." },
    { id: 4, frase: "Sua saúde mental importa. Estamos aqui por você." },
    { id: 5, frase: "Buscar apoio é o primeiro passo para se sentir melhor." },
    { id: 6, frase: "Você é mais forte do que imagina." },
    { id: 7, frase: "Não existe vergonha em precisar de ajuda." },
    { id: 8, frase: "Cuidar de si mesmo é o maior ato de amor que existe." }
  ],
  opcoes_atendimento: [
    { id: 1, titulo: "Chat",    icone: "bi-chat-dots-fill", tipo_acao: "chat",    classe_css: "opcao-chat",    descricao: "Converse por texto com um psicólogo agora.", link: null },
    { id: 2, titulo: "Chamada", icone: "bi-telephone-fill", tipo_acao: "chamada", classe_css: "opcao-chamada", descricao: "Fale por voz com um profissional de saúde mental.", link: null },
    { id: 3, titulo: "CVV",     icone: "bi-heart-fill",     tipo_acao: "cvv",     classe_css: "opcao-cvv",     descricao: "Centro de Valorização da Vida — ligue 188 (gratuito).", link: "https://www.cvv.org.br" }
  ]
};

const DB_KEY = 'msp_db';
const DB_VERSION_KEY = 'msp_db_version';
const DB_VERSION = '2'; // aumente este número sempre que os dados iniciais (SEED) mudarem

function _seed() {
  localStorage.setItem(DB_KEY, JSON.stringify(SEED));
  localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
  return JSON.parse(JSON.stringify(SEED));
}

function _load() {
  const raw = localStorage.getItem(DB_KEY);
  const ver = localStorage.getItem(DB_VERSION_KEY);
  // (Re)carrega os dados iniciais se nunca foram salvos ou se o SEED mudou de versão.
  if (!raw || ver !== DB_VERSION) {
    return _seed();
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return _seed();
  }
}

function _save(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function _nextId(rows) {
  let max = 0;
  rows.forEach(function (r) {
    const n = parseInt(r.id, 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return max + 1;
}

// Mesma interface do antigo cliente Supabase — agora rodando 100% no navegador.
const db = {
  async get(tabela, filtros = {}) {
    const data = _load();
    let rows = data[tabela] || [];
    for (const [key, val] of Object.entries(filtros)) {
      rows = rows.filter(function (r) { return String(r[key]) === String(val); });
    }
    return rows;
  },

  async getById(tabela, id) {
    const data = _load();
    return (data[tabela] || []).find(function (r) { return String(r.id) === String(id); });
  },

  async post(tabela, dados) {
    const data = _load();
    if (!data[tabela]) data[tabela] = [];
    const novo = Object.assign({}, dados);
    if (novo.id === undefined || novo.id === null || novo.id === '') {
      novo.id = _nextId(data[tabela]);
    }
    data[tabela].push(novo);
    _save(data);
    return novo;
  },

  async put(tabela, id, dados) {
    const data = _load();
    const rows = data[tabela] || [];
    const i = rows.findIndex(function (r) { return String(r.id) === String(id); });
    if (i === -1) return null;
    rows[i] = Object.assign({}, rows[i], dados, { id: rows[i].id });
    _save(data);
    return rows[i];
  },

  async patch(tabela, id, dados) {
    return this.put(tabela, id, dados);
  },

  async delete(tabela, id) {
    const data = _load();
    data[tabela] = (data[tabela] || []).filter(function (r) { return String(r.id) !== String(id); });
    _save(data);
  }
};
