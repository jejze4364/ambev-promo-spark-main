const firebaseConfig = {
  apiKey: "AIzaSyDvMFh5CNWeCXqBo98GJvj-YGACSlmB81c",
  authDomain: "pesquisa-8a0f9.firebaseapp.com",
  projectId: "pesquisa-8a0f9",
  storageBucket: "pesquisa-8a0f9.firebasestorage.app",
  messagingSenderId: "453188166697",
  appId: "1:453188166697:web:c1144b2abeb1edc3b16838",
  measurementId: "G-H34QHPSPS1",
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
  // Primeiro, precisamos definir a pontuação máxima que cada cerveja pode alcançar
  // Vamos considerar todas as perguntas e definir um valor máximo consistente
  
  // Lista completa das cervejas no sistema
  const allBeers = [
    'brahma', 'spaten', 'corona', 'bud', 'stella', 'budzero', 'coronacero',
    'becks', 'antarctica', 'michelob', 'brahmazero', 'skol', 'bohemia',
    'original', 'patagonia', 'colorado', 'stellapg'
  ];
  document.addEventListener("DOMContentLoaded", function() {
    // Torna o container visível
    document.querySelector('.container').style.display = 'flex';
  
    const container = document.getElementById('question-container');
    container.innerHTML = "<p>Teste de carregamento</p>";
  
    console.log("Inicializando aplicação...");
    
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      
      allBeers.forEach(beer => {
        scores[beer] = 0;
      });
      
      console.log("Carregando primeira pergunta...");
      loadQuestion();
      updateProgressBar();
    } catch (error) {
      console.error("Erro na inicialização:", error);
      alert("Ocorreu um erro ao carregar o formulário. Por favor, recarregue a página.");
    }
  });
  
  // Pontuações máximas por pergunta
const MAX_POINTS_PER_QUESTION = [
  0,  // Localização (não pontua)
  0,  // Faixa etária (não pontua)
  40, // Preço
  30, // Ocasiões
  30, // Interesse em zero álcool
  30  // Frequência de consumo
];

// Pontuação total máxima
const MAX_TOTAL_POINTS = MAX_POINTS_PER_QUESTION.reduce((sum, val) => sum + val, 0);

// Objeto friendlyNames e beerDescriptions mantidos como estavam (não alterei)

const questions = [
  {
    question: "Em qual desses municípios você costuma fazer suas compras de supermercado?",
    dropdown: true,
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
  {
    question: "Qual a sua faixa etária?",
    description: "Esta informação nos ajuda a personalizar ainda melhor suas recomendações.",
    options: [
      { text: "18 a 27 anos", scores: {} },
      { text: "28 a 37 anos", scores: {} },
      { text: "38 a 45 anos", scores: {} },
      { text: "Acima de 45 anos", scores: {} }
    ],
    multipleChoice: false
  },
  {
    question: "Quanto você normalmente gasta em uma cerveja no mercado?",
    description: "Valor médio por unidade que você costuma pagar.",
    options: [
      {
        text: "Até R$ 4,00 por unidade",
        scores: {
          brahma: 40, antarctica: 40, skol: 35, bohemia: 35, original: 30
        }
      },
      {
        text: "Entre R$ 4,00 e R$ 5,99 por unidade",
        scores: {
          spaten: 40, bud: 40, brahmazero: 35, budzero: 30,
          stella: 30, corona: 30, becks: 30, michelob: 25, coronacero: 25
        }
      },
      {
        text: "Entre R$ 6,00 e R$ 7,99 por unidade",
        scores: {
          stella: 40, becks: 40, corona: 40, patagonia: 35, colorado: 35,
          michelob: 30, brahmazero: 20, budzero: 20
        }
      },
      {
        text: "R$ 8,00 ou mais por unidade",
        scores: {
          patagonia: 40, colorado: 40, stellapg: 40, michelob: 35,
          stella: 30, becks: 30, corona: 30
        }
      }
    ],
    multipleChoice: false
  },
  {
  question: "Em quais ocasiões você mais gosta de apreciar uma cerveja? (Escolha quantas quiser)",
  description: "Selecione todas as ocasiões que combinam com o seu estilo.",
  multipleChoice: true,
  requiredChoices: null, // <<< NÃO DEFINE UM LIMITE
  gridLayout: true,
  options: [
    {
      text: "Churrasco com amigos e família",
      scores: { brahma: 30, antarctica: 30, skol: 30, bohemia: 25, original: 25 }
    },
    {
      text: "Happy hours e eventos corporativos",
      scores: { stella: 30, bud: 30, spaten: 25, michelob: 25 }
    },
    {
      text: "Festas e celebrações",
      scores: { bud: 30, skol: 30, corona: 30, brahma: 25 }
    },
    {
      text: "Momentos ao ar livre (praia, piscina)",
      scores: { corona: 30, skol: 30, michelob: 25, brahma: 25, coronacero: 25 }
    },
    {
      text: "Jantares e Harmonizações",
      scores: { stella: 30, stellapg: 30, colorado: 30, patagonia: 30 }
    },
    {
      text: "Assistindo a jogos de futebol",
      scores: { brahma: 30, antarctica: 30, skol: 30, bud: 25 }
    },
    {
      text: "Encontros românticos",
      scores: { stella: 30, colorado: 30, patagonia: 30, michelob: 25 }
    },
    {
      text: "Relaxando em casa após o trabalho",
      scores: { brahma: 30, original: 30, bohemia: 25, michelob: 25 }
    }
  ]
},

  {
    question: "Você tem interesse em opções zero álcool?",
    description: "Cervejas zero álcool mantêm o sabor e são ideais para quem dirige ou busca alternativas mais leves.",
    options: [
      {
        text: "Sim, prefiro cervejas zero álcool",
        scores: {
          brahmazero: 30, budzero: 30, coronacero: 30, michelob: 20, stellapg: 20
        }
      },
      {
        text: "Não, prefiro cervejas tradicionais",
        scores: {
          brahma: 30, skol: 30, bud: 30, stella: 30, spaten: 30, original: 30
        }
      },
      {
        text: "Estou aberto a experimentar opções zero",
        scores: {
          brahmazero: 25, budzero: 25, coronacero: 25, michelob: 25, stellapg: 25,
          bud: 20, corona: 20, brahma: 20, stella: 20
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
        text: "Mais de 2x por semana",
        scores: {
          brahma: 30, skol: 30, antarctica: 30, bud: 25, stella: 25, michelob: 20
        }
      },
      {
        text: "Semanalmente",
        scores: {
          spaten: 30, stella: 30, michelob: 30, corona: 25, bud: 25
        }
      },
      {
        text: "Apenas em eventos e ocasiões especiais",
        scores: {
          patagonia: 30, colorado: 30, corona: 30, stella: 25, becks: 25
        }
      },
      {
        text: "Raramente ou nunca",
        scores: {
          budzero: 30, coronacero: 30, brahmazero: 30, michelob: 25, stellapg: 25
        }
      }
    ],
    multipleChoice: false
  }
];

  
  // Função para calcular a porcentagem de compatibilidade de forma padronizada
  function calculateCompatibilityPercentage(beerScores, maxPossiblePoints = MAX_TOTAL_POINTS) {
    // Para cada cerveja, calcular a porcentagem com base na pontuação máxima
    const percentages = {};
    
    for (const [beer, score] of Object.entries(beerScores)) {
      if (beerDescriptions[beer]) { // Verifica se é uma cerveja válida
        const percentage = Math.round((score / maxPossiblePoints) * 100);
        percentages[beer] = percentage;
      }
    }
    
    return percentages;
  }
  
  function updateProgressBar() {
    const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
    document.getElementById('progress-text').textContent = `Questão ${currentQuestion + 1} de ${questions.length}`;
    document.getElementById('progress-percent').textContent = `${percent}%`;
    document.querySelector('.progress-fill').style.width = `${percent}%`;
  }
  
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

  if (currentQuestion === 0 || q.gridLayout) {
    optionsDiv.classList.add('grid-layout');
  }

  // Verifica se é dropdown
  if (q.dropdown) {
    const select = document.createElement('select');
    select.classList.add('dropdown-select');

    const placeholder = document.createElement('option');
    placeholder.textContent = 'Selecione uma opção';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

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
      if (selectedIdx === '') return alert('Por favor, selecione uma opção.');

      const opt = q.options[selectedIdx];
      respostas[`pergunta${currentQuestion + 1}`] = opt.text;
      document.getElementById(`pergunta${currentQuestion + 1}`).value = opt.text;

      Object.entries(opt.scores).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + value;
      });

      nextQuestion();
    };

    optionsDiv.appendChild(select);
    optionsDiv.appendChild(continueBtn);
    container.appendChild(optionsDiv);
    return;
  }

  // Verifica se é múltipla escolha
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
    });

    const btn = document.createElement('button');
    btn.innerText = "Continuar";
    btn.classList.add('btn-continue');

    btn.onclick = () => {
      const selected = optionsDiv.querySelectorAll('input:checked');

      // Só exige quantidade exata se for configurado no questionário
      if (q.requiredChoices != null && selected.length !== q.requiredChoices) {
        alert(`Por favor, selecione exatamente ${q.requiredChoices} opções.`);
        return;
      }

      if (selected.length === 0) {
        alert('Por favor, selecione pelo menos uma opção.');
        return;
      }

      let selectedAnswers = [];
      selected.forEach(sel => {
        const opt = q.options[+sel.dataset.idx];
        selectedAnswers.push(opt.text);

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
    // Caso contrário: única escolha (botões normais)
    q.options.forEach((opt, i) => {
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

  // Estilos de seleção
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
  
  // Modificação na função showResults para usar porcentagens reais de compatibilidade
  function showResults() {
    const container = document.getElementById('question-container');
    
    // Calcular as porcentagens de compatibilidade
    const beerPercentages = calculateCompatibilityPercentage(scores);
    
    // Ordenar cervejas por porcentagem de compatibilidade
    const topBeers = Object.entries(beerPercentages)
      .filter(([key]) => beerDescriptions[key])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const dataToSave = {
      respostas: respostas,
      resultados: {
        cervejas: topBeers.map(([beer]) => friendlyNames[beer]),
        porcentagens: topBeers.map(([beer, percentage]) => `${friendlyNames[beer]}: ${percentage}%`)
      },
      scores: scores,
      porcentagensCompatibilidade: beerPercentages
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
        <a href="index.html" class="btn-primary">
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
          ${topBeers.map(([beer, percentage], index) => `
            <div class="beer-card ${index === 0 ? 'top-match' : ''}">
              <div class="beer-image">
                <img src="${beer}.jpg" alt="${friendlyNames[beer]}" />
                ${index === 0 ? '<span class="match-badge">Melhor Combinação</span>' : ''}
              </div>
              <div class="beer-info">
                <h4>${friendlyNames[beer]}</h4>
                <p>${beerDescriptions[beer]}</p>
                <div class="match-percent">${percentage}% de compatibilidade</div>
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
  
