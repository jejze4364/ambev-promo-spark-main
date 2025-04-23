const firebaseConfig = {
apiKey: "AIzaSyDvMFh5CNWeCXqBo98GJvj-YGACSlmB81c",
authDomain: "pesquisa-8a0f9.firebaseapp.com",
projectId: "pesquisa-8a0f9",
storageBucket: "pesquisa-8a0f9.firebasestorage.app",
messagingSenderId: "453188166697",
appId: "1:453188166697:web:c1144b2abeb1edc3b16838",
measurementId: "G-H34QHPSPS1"
};
// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();

function saveDataToFirebase(data) {
// Gere um ID único para este registro
const surveyId = "survey_" + new Date().getTime();
const startTime = new Date();
// Salve startTime junto com os dados da pesquisa

// Adicione timestamp
data.timestamp = new Date();

// Salvar no Firestore
return db.collection("pesquisas").doc(surveyId).set(data)
.then(() => {
  console.log("Dados salvos com sucesso no Firebase!");
  return true;
})
.catch((error) => {
  console.error("Erro ao salvar dados:", error);
  return false;
});
}
function getData() {
const db = firebase.firestore();

// Acessar a coleção "pesquisas" no Firestore
db.collection("pesquisas").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Exibindo os dados de cada documento no console
      console.log("ID do Documento:", doc.id);
      console.log("Dados do Documento:", doc.data());
    });
  })
  .catch((error) => {
    console.error("Erro ao obter dados do Firestore:", error);
  });
}
// Declaração de variáveis globais
let currentQuestion = 0;
const scores = {};
const respostas = {};

// Objetos corrigidos e sincronizados
const friendlyNames = {
  brahma: "Brahma",
  spaten: "Spaten",
  corona: "Corona",
  bud: "Budweiser",
  stella: "Stella Artois",
  budzero: "Budweiser Zero",
  coronacero: "Corona Cero",
  becks: "Beck's",
  antarctica: "Antarctica",
  michelob: "Michelob Ultra",
  brahmazero: "Brahma Zero",
  skol: "Skol",
  bohemia: "Bohemia",
  original: "Original",
  patagonia: "Patagonia",
  colorado: "Colorado",
  lt350: "Lata 350ml",
  ln: "Long Neck",
  lt473: "Latão 473ml",
  lt279: "Latinha 269ml/275ml",
  stellapg: "Stella Artois Sem Glúten"
};

const beerDescriptions = {
  brahma: "Sabor marcante e refrescante",
  spaten: "Puro malte premium alemã",
  corona: "Refrescante com toque cítrico",
  bud: "Equilibrada e suave",
  stella: "Sofisticada e encorpada",
  budzero: "Zero álcool, 100% sabor",
  coronacero: "Refrescante sem álcool",
  becks: "Pureza e tradição alemã",
  antarctica: "Clássica brasileira",
  michelob: "Leve e baixa caloria",
  brahmazero: "Refrescante sem álcool",
  skol: "Leve e refrescante",
  bohemia: "Primeira cerveja do Brasil",
  original: "Autêntica e marcante",
  patagonia: "Premium argentina",
  colorado: "Artesanal com toques especiais",
  stellapg: "Sem Glúten, sem estresse"
};


const questions = [
  {
    question: "Em qual desses municípios você costuma fazer suas compras de supermercado?",
    dropdown: true, // <- chave nova para renderizar como <select>
    options: [
      { text: "Rio de Janeiro", scores: {} },
      { text: "São Gonçalo", scores: {} },
      { text: "Duque de Caxias", scores: {} },
      { text: "Nova Iguaçu", scores: {} },
      { text: "Belford Roxo", scores: {} },
      { text: "Niterói", scores: {} },
      { text: "Campos dos Goytacazes", scores: {} },
      { text: "São João de Meriti", scores: {} },
      { text: "Volta Redonda", scores: {} },
      { text: "Petrópolis", scores: {} },
      { text: "Outro(s)", scores: {} }
    ],
    multipleChoice: false
  },  
  
  // Pergunta 2 - Faixa etária (sem pontuação)
  {
    question: "Qual a sua faixa etária?",
    description: "Esta informação nos ajuda a personalizar ainda melhor suas recomendações.",
    options: [
      {
        text: "18 a 27 anos",
        scores: {}
      },
      {
        text: "28 a 37 anos",
        scores: {}
      },
      {
        text: "38 a 45 anos",
        scores: {}
      },
      {
        text: "Acima de 45 anos",
        scores: {}
      }
    ],
    multipleChoice: false
  },

  // Pergunta 3 - Faixa de preço (30% dos pontos totais - máximo ~30 pontos)
{
  question: "Quanto você normalmente gasta em uma cerveja no mercado?",
  description: "Valor médio por unidade que você costuma pagar.",
  options: [
    {
      text: "Até R$ 4,00 por unidade",
      scores: {
        antarctica: 18, brahma: 18, skol: 18, bohemia: 18, original: 18,
        spaten: 14, stella: 9, brahmazero: 18, 
        bud: 18, budzero: 18, becks: 5,
        corona: 9, coronacero: 9, stellapg: 5, patagonia: 5, michelob: 5, colorado: 5
      }
    },
    {
      text: "Entre R$ 4,00 e R$ 5,99 por unidade",
      scores: {
        antarctica: 14, brahma: 14, skol: 14, bohemia: 14, original: 14,
        spaten: 18, stella: 14, brahmazero: 14, 
        bud: 14, budzero: 14, becks: 9,
        corona: 14, coronacero: 14, stellapg: 9, patagonia: 9, michelob: 9, colorado: 9
      }
    },
    {
      text: "Entre R$ 6,00 e R$ 7,99 por unidade",
      scores: {
        antarctica: 9, brahma: 9, skol: 9, bohemia: 9, original: 9,
        spaten: 9, stella: 18, brahmazero: 9, 
        bud: 9, budzero: 9, becks: 18,
        corona: 18, coronacero: 18, stellapg: 18, patagonia: 18, michelob: 18, colorado: 18
      }
    },
    {
      text: "R$ 8,00 ou mais por unidade",
      scores: {
        antarctica: 5, brahma: 5, skol: 5, bohemia: 5, original: 5,
        spaten: 5, stella: 18, brahmazero: 5, 
        bud: 9, budzero: 9, becks: 18,
        corona: 14, coronacero: 14, stellapg: 18, patagonia: 23, michelob: 14, colorado: 23
      }
    }
  ],
  multipleChoice: false
},

// Pergunta 4 - Ocasiões (40% dos pontos totais - máximo de 40 pontos)
{
  question: "Em quais ocasiões você mais gosta de apreciar uma cerveja?(Escolha 3)",
  description: "Selecione as 3 principais ocasiões que combinam com o seu estilo.",
  multipleChoice: true,
  requiredChoices: 3,
  gridLayout: true,
  options: [
    {
      text: "Churrasco com amigos e família",
      scores: { 
        antarctica: 13, brahma: 13, skol: 13, bohemia: 10, original: 13,
        spaten: 10, bud: 8, michelob: 8, budzero: 8, brahmazero: 8
      }
    },
    {
      text: "Happy hours e eventos corporativos",
      scores: { 
        spaten: 13, stella: 13, stellapg: 13, becks: 13, 
        corona: 10, bud: 10,
        budzero: 10, coronacero: 10, brahmazero: 10, michelob: 13
      }
    },
    {
      text: "Festas e celebrações",
      scores: { 
        bud: 13, stella: 10, skol: 13, corona: 13, brahma: 10,
        budzero: 8, coronacero: 8, becks: 10, brahmazero: 8
      }
    },
    {
      text: "Momentos ao ar livre (praia, piscina)",
      scores: { 
        corona: 13, coronacero: 13, skol: 10, brahma: 8, 
        budzero: 10, brahmazero: 10, michelob: 13, antarctica: 8, bud: 10
      }
    },
    {
      text: "Jantares e Harmonizações",
      scores: { 
        stella: 13, stellapg: 13, colorado: 13, patagonia: 13,
        becks: 10, bohemia: 10, spaten: 10, original: 10
      }
    },
    {
      text: "Assistindo a jogos de futebol",
      scores: { 
        antarctica: 13, brahma: 13, skol: 13, bud: 10, spaten: 8,
        budzero: 10, coronacero: 8, brahmazero: 10
      }
    },
    {
      text: "Encontros românticos",
      scores: { 
        stella: 13, stellapg: 13, colorado: 13, patagonia: 13,
        becks: 10, bohemia: 8, spaten: 8, corona: 10
      }
    },
    {
      text: "Relaxando em casa após o trabalho",
      scores: { 
        antarctica: 10, brahma: 10, spaten: 10, bud: 10,
        bohemia: 13, original: 13, coronacero: 8, brahmazero: 8,
        budzero: 8, michelob: 10
      }
    }
  ]
},

// Pergunta 5 - Zero álcool (30% dos pontos totais - máximo 30 pontos)
{
  question: "Você tem interesse em opções zero álcool?",
  description: "Cervejas zero álcool mantêm o sabor e são ideais para quem dirige ou busca alternativas mais leves.",
  options: [
    { 
      text: "Sim, prefiro cervejas zero álcool", 
      scores: { 
        // Garante que cervejas zero álcool sejam recomendadas
        budzero: 18, coronacero: 18, brahmazero: 18, 
        
        // Penaliza cervejas com álcool para não serem recomendadas
        bud: -100, corona: -100, brahma: -100,
        stella: -100, spaten: -100, becks: -100, 
        antarctica: -100, skol: -100, bohemia: -100,
        patagonia: -100, colorado: -100, original: -100,
        
        // Penaliza menos as opções de baixo teor
        michelob: -50, stellapg: -30
      } 
    },
    { 
      text: "Não, prefiro cervejas tradicionais", 
      scores: { 
        // Penaliza fortemente cervejas zero
        budzero: -200, coronacero: -200, brahmazero: -200, 
        
        // Penaliza menos as opções de baixo teor
        michelob: -100, stellapg: -30,
        
        // Aumenta levemente as cervejas tradicionais (14 pontos)
        bud: 14, corona: 14, brahma: 14, stella: 14, spaten: 14,
        becks: 14, antarctica: 14, skol: 14, bohemia: 14, 
        patagonia: 14, colorado: 14, original: 14
      } 
      
    },
    { 
      text: "Estou aberto a experimentar opções zero", 
      scores: { 
        // Cervejas zero álcool pontuação positiva
        budzero: 6, coronacero: 8, brahmazero: 4,
        
        
        
        // Opções intermediárias
        michelob: 4, stellapg: 4
      } 
    }
  ],
  multipleChoice: false
},
{
  question: "Com que frequência você consome cerveja?",
  description: "Essa informação nos ajuda a entender melhor seu perfil de consumo.",
  options: [
    {
      text: "Todos os dias",
      scores: {
        brahma: 12, skol: 12, antarctica: 12,
        michelob: 10, brahmazero: 8, budzero: 8
      }
    },
    {
      text: "De 2 a 3 vezes por semana",
      scores: {
        bud: 12, stella: 12, spaten: 12,
        michelob: 12, corona: 10, brahmazero: 6
      }
    },
    {
      text: "Apenas em eventos e ocasiões especiais",
      scores: {
        corona: 12, patagonia: 12, colorado: 12,
        stella: 10, becks: 10, bohemia: 8
      }
    },
    {
      text: "Raramente ou nunca",
      scores: {
        budzero: 18, coronacero: 18, brahmazero: 18,
        michelob: 18, stellapg: 18
      }
    }
  ],
  multipleChoice: false
}

];
function verifyAge(ok) {
  const ageModal = document.getElementById('age-modal');
  const container = document.querySelector('.container');
  
  ageModal.style.display = 'none';
  container.style.display = 'flex';

  if (ok) {
    loadQuestion();
    updateProgressBar();
  } else {
    document.querySelector('.container').innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem;">
        <h2>Conteúdo restrito para maiores de 18 anos</h2>
        <p>De acordo com a legislação brasileira, o consumo de bebidas alcoólicas só é permitido para maiores de 18 anos.</p>
        <a href="#" onclick="location.reload()" class="btn-primary">Voltar</a>
      </div>
    `;
  }
}

function updateProgressBar() {
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
  document.getElementById('progress-text').textContent = `Questão ${currentQuestion + 1} de ${questions.length}`;
  document.getElementById('progress-percent').textContent = `${percent}%`;
  document.querySelector('.progress-fill').style.width = `${percent}%`;
}

// Modifique a função loadQuestion para incluir responsividade para mobile
function loadQuestion() {
const container = document.getElementById('question-container');
const q = questions[currentQuestion];

container.innerHTML = ''; // Limpa o conteúdo atual

let questionContent = `
<h2>${q.question}</h2>
${q.description ? `<p style="color: var(--text-light); margin-bottom: 1.5rem;">${q.description}</p>` : ''}
`;

container.innerHTML = questionContent;  // Adiciona o conteúdo da pergunta ao container

const optionsDiv = document.createElement('div');
optionsDiv.classList.add('options-container');

// Aplica layout em duas colunas na primeira pergunta ou se gridLayout é true
// (usado para a questão 4 ou outras onde isso faça sentido)
if (currentQuestion === 0 || q.gridLayout) {
optionsDiv.classList.add('grid-layout');
}
// Verifica se é dropdown
if (q.dropdown) {
  const select = document.createElement('select');
  select.classList.add('dropdown-select');

  // Placeholder
  const placeholder = document.createElement('option');
  placeholder.textContent = 'Selecione um município';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  // Adiciona opções do dropdown
  q.options.forEach((opt, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = opt.text;
    select.appendChild(option);
  });

  const continueBtn = document.createElement('button');
  continueBtn.textContent = 'Continuar';
  continueBtn.classList.add('btn-continue');

  continueBtn.onclick = () => {
    const selectedIdx = select.value;
    if (selectedIdx === '') return alert('Por favor, selecione um município.');

    const opt = q.options[selectedIdx];
    respostas[`pergunta${currentQuestion + 1}`] = opt.text;
    document.getElementById(`pergunta${currentQuestion + 1}`).value = opt.text;

    // Nenhuma pontuação atribuída nesse caso, mas se quiser somar, pode ativar abaixo:
    Object.entries(opt.scores).forEach(([key, value]) => {
      scores[key] = (scores[key] || 0) + value;
    });

    nextQuestion();
  };

  optionsDiv.appendChild(select);
  optionsDiv.appendChild(continueBtn);
  container.appendChild(optionsDiv);
  return; // Interrompe o resto do render padrão
}

// Verifica se a pergunta é de múltiplas escolhas
if (q.multipleChoice) {
  
q.options.forEach((opt, i) => {
  const label = document.createElement('label');
  label.classList.add('checkbox-option');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.dataset.idx = i;
  input.name = `checkbox-question-${currentQuestion}`;
  const box = document.createElement('div');
  box.classList.add('checkbox');
  label.appendChild(input);
  label.appendChild(box);
  label.append(opt.text);
  optionsDiv.appendChild(label);

  input.addEventListener('change', () => {
    label.classList.toggle('selected', input.checked);
    
    // Verificar contagem de seleções para perguntas com limite
    if (q.requiredChoices) {
      const selected = optionsDiv.querySelectorAll('input:checked').length;
      // Desativa opções adicionais se o limite for atingido
      if (selected >= q.requiredChoices) {
        optionsDiv.querySelectorAll('input:not(:checked)').forEach(inp => {
          inp.disabled = true;
          inp.parentElement.classList.add('disabled');
        });
      } else {
        optionsDiv.querySelectorAll('input').forEach(inp => {
          inp.disabled = false;
          inp.parentElement.classList.remove('disabled');
        });
      }
    }
  });
});

const btn = document.createElement('button');
btn.innerText = "Continuar";
btn.classList.add('btn-continue');
btn.onclick = () => {
  const selected = optionsDiv.querySelectorAll('input:checked');

  if (q.requiredChoices && selected.length !== q.requiredChoices) {
    alert(`Selecione exatamente ${q.requiredChoices} opções.`);
    return;
  }

  let selectedAnswers = [];
  selected.forEach(sel => {
    const opt = q.options[+sel.dataset.idx];
    selectedAnswers.push(opt.text);

    // Somar pontuações
    Object.entries(opt.scores).forEach(([key, value]) => {
      scores[key] = (scores[key] || 0) + value;
    });
  });

  respostas[`pergunta${currentQuestion + 1}`] = selectedAnswers.join(', ');
  document.getElementById(`pergunta${currentQuestion + 1}`).value = selectedAnswers.join(', ');
  nextQuestion();
};

container.appendChild(optionsDiv);
container.appendChild(btn);
} else {
q.options.forEach(opt => {
  const btn = document.createElement('button');
  btn.classList.add('option-button');
  btn.innerHTML = `<div class="circle"></div>${opt.text}`;
  btn.onclick = () => {
    Object.entries(opt.scores).forEach(([key, value]) => {
      scores[key] = (scores[key] || 0) + value;
    });

    respostas[`pergunta${currentQuestion + 1}`] = opt.text;
    document.getElementById(`pergunta${currentQuestion + 1}`).value = opt.text;
    nextQuestion();
  };
  optionsDiv.appendChild(btn);
});
container.appendChild(optionsDiv);
}

// Adicione estilos extras para as opções de checkbox
const styleElement = document.createElement('style');
styleElement.textContent = `
.checkbox-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.options-container {
  margin-bottom: 2rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

.checkbox-option {
  padding: 0.9rem;
  border-radius: 8px;
  background-color: #f8f8f8;
  transition: all 0.2s ease;
  margin-bottom: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.checkbox-option:hover {
  background-color: #f0f0f0;
}

.checkbox-option.selected {
  background-color: rgba(247, 168, 0, 0.1);
  border: 1px solid var(--primary-color, #f7a800);
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-option.selected .checkbox {
  border-color: var(--primary-color, #f7a800);
  background-color: var(--primary-color, #f7a800);
}

.checkbox-option.selected .checkbox:after {
  content: '';
  position: absolute;
  top: 3px;
  left: 7px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.btn-continue {
  background-color: var(--primary-color, #f7a800);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin: 1.5rem auto 0;
  transition: all 0.3s ease;
}

.btn-continue:hover {
  background-color: #e69a00;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(247, 168, 0, 0.3);
}
`;
document.head.appendChild(styleElement);
}
function updateSelectionCounter(questionIndex, selectedCount, required) {
const counterElement = document.getElementById(`selection-counter-${questionIndex}`);
if (!counterElement) return;

counterElement.textContent = `${selectedCount}/${required} selecionadas`;

if (selectedCount === required) {
counterElement.classList.add('complete');
} else {
counterElement.classList.remove('complete');
}
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
    updateProgressBar();
  } else {
    showResults();
  }
}

function showResults() {
const container = document.getElementById('question-container');
const topBeers = Object.entries(scores)
.filter(([key]) => beerDescriptions[key])
.sort((a, b) => b[1] - a[1])
.slice(0, 3);

const dataToSave = {
respostas: respostas,
resultados: {
  cervejas: topBeers.map(([beer]) => friendlyNames[beer]),
},
scores: scores
};

saveDataToFirebase(dataToSave).then(success => {
if (success) getData();
});

container.innerHTML = `
<div class="results-container">
  <div class="results-header">
    <h2>Seu Perfil Cervejeiro</h2>
    <p>Com base nas suas respostas, selecionamos as cervejas que mais combinam com você!</p>
  </div>

  <div class="action-buttons">
    <a href="Inicial.html" class="btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Conheça o Projeto
    </a>
    <a href="promocoes.html" class="btn-promo">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      Conheça as Promoções <span class="btn-indicator">→</span>
    </a>
  </div>

  <div class="results-section">
    <h3>Cervejas Ideais Para Você</h3>
    <div class="beer-list">
      ${topBeers.map(([beer], index) => `
        <div class="beer-card ${index === 0 ? 'top-match' : ''}">
          <div class="beer-image">
            <img src="${beer}.jpg" alt="${friendlyNames[beer]}" />
            ${index === 0 ? '<span class="match-badge">Melhor Combinação</span>' : ''}
          </div>
          <div class="beer-info">
            <h4>${friendlyNames[beer]}</h4>
            <p>${beerDescriptions[beer]}</p>
            <div class="match-percent">${Math.round(90 - index * 8)}% de compatibilidade</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="share-section">
    <h3>Compartilhe Seu Resultado</h3>
    <div class="share-buttons">
      <a class="share-btn facebook" href="https://www.facebook.com" target="_blank">
      <i class="fab fa-facebook-f"></i> Facebook
      </a>
      <a class="share-btn whatsapp" href="https://wa.me/?text=Confira%20minha%20cerveja%20ideal!" target="_blank">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </a>
      <a class="share-btn instagram" href="https://www.instagram.com" target="_blank">
      <i class="fab fa-instagram"></i> Instagram
    </a>
    </div>
  </div>

  <div class="try-again-section">
  <button class="btn-outline" onclick="location.reload()">
    <i class="fas fa-redo-alt"></i> Fazer o Teste Novamente
  </button>
  </div>
</div>
`;

setTimeout(() => {
document.querySelector('.facebook')?.addEventListener('click', () => window.open('https://www.facebook.com', '_blank'));
document.querySelector('.whatsapp')?.addEventListener('click', () => window.open('https://wa.me/?text=Confira%20minha%20cerveja%20ideal!', '_blank'));
document.querySelector('.instagram')?.addEventListener('click', () => window.open('https://www.instagram.com', '_blank'));
}, 100);
}
