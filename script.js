const sumScores = (scores) => {
  // Apenas retorna os scores para manter a estrutura
  return scores;
};

// Questões e opções permanecem as mesmas
const questions = [
  {
    question: "Qual a sua faixa etária?",
    options: [
      { 
        text: "De 18 a 27 anos", 
        scores: sumScores({ 
          brahma: 20, spaten: 15, corona: 25, bud: 25, stella: 15,
          budzero: 20, coronacero: 25, becks: 20, michelob: 25, brahmazero: 20
        }) 
      },
      { 
        text: "De 28 a 37 anos", 
        scores: sumScores({ 
          brahma: 25, spaten: 25, corona: 20, bud: 20, stella: 25,
          budzero: 15, coronacero: 15, becks: 25, michelob: 20, brahmazero: 15
        }) 
      },
      { 
        text: "De 38 a 45 anos", 
        scores: sumScores({ 
          brahma: 20, spaten: 25, corona: 15, bud: 15, stella: 25,
          budzero: 25, coronacero: 20, becks: 20, michelob: 15, brahmazero: 25
        }) 
      },
      { 
        text: "Mais de 45 anos", 
        scores: sumScores({ 
          brahma: 15, spaten: 20, corona: 15, bud: 10, stella: 20,
          budzero: 25, coronacero: 25, becks: 15, michelob: 15, brahmazero: 25
        }) 
      }
    ],
    multipleChoice: false, // Adicionado para clareza
  },
  {
    question: "Quanto você costuma gastar em uma cerveja? (unidade)",
    options: [
      { 
        text: "Até R$ 5", 
        scores: sumScores({ 
          brahma: 25, spaten: 10, corona: 10, bud: 20, stella: 10, 
          budzero: 15, coronacero: 5, becks: 5, antarctica: 25, michelob: 5, brahmazero: 25, 
          skol: 25, bohemia: 25, original: 15, patagonia: 5, colorado: 5,
        }) 
      },
      { 
        text: "Entre R$ 6 e R$ 7", 
        scores: sumScores({ 
          brahma: 20, spaten: 20, corona: 20, bud: 25, stella: 20, 
          budzero: 25, coronacero: 15, becks: 10, antarctica: 10, michelob: 15, brahmazero: 15,
          skol: 20, bohemia: 20, original: 25, patagonia: 10, colorado: 10,
        }) 
      },
      { 
        text: "Entre R$ 8 e R$ 9", 
        scores: sumScores({ 
          brahma: 10, spaten: 25, corona: 25, bud: 20, stella: 15, 
          budzero: 10, coronacero: 20, becks: 20, antarctica: 5, michelob: 20, brahmazero: 5,
          skol: 5, bohemia: 5, original: 20, patagonia: 15, colorado: 15,
        }) 
      },
      { 
        text: "Mais de R$ 10", 
        scores: sumScores({ 
          brahma: 5, spaten: 20, corona: 25, bud: 5, stella: 15, 
          budzero: 5, coronacero: 25, becks: 45, antarctica: 5, michelob: 45, brahmazero: 5,
          skol: 5, bohemia: 5, original: 5, patagonia: 45, colorado: 45,
        }) 
      },
    ],
    multipleChoice: false, // Adicionado para clareza
  },  
  {
    question: "Selecione 3 tipos de ocasiões em que você mais consome cerveja?",
    options: [
      { 
        text: "Churrasco com família ou amigos", 
        scores: sumScores({ 
          brahma: 25, spaten: 15, corona: 15, bud: 20, stella: 20, 
          budzero: 10, coronacero: 10, becks: 10, antarctica: 20, michelob: 5, brahmazero: 10,
          skol: 20, bohemia: 15, original: 20, patagonia: 5, colorado: 5,
        }) 
      },
      { 
        text: "Eventos de trabalho", 
        scores: sumScores({ 
          brahma: 5, spaten: 10, corona: 15, bud: 10, stella: 10, 
          budzero: 20, coronacero: 20, becks: 10, antarctica: 5, michelob: 20, brahmazero: 15,
          skol: 5, bohemia: 5, original: 5, patagonia: 25, colorado: 25,
          
        }) 
      },
      { 
        text: "Eventos noturnos ou festas", 
        scores: sumScores({ 
          brahma: 15, spaten: 20, corona: 5, bud: 20, stella: 5, 
          budzero: 5, coronacero: 5, becks: 25, antarctica: 5, michelob: 5, brahmazero: 10,
          skol: 5, bohemia: 5, original: 5, patagonia: 10, colorado: 5,
        }) 
      },
      { 
        text: "Momentos ao ar livre, como trilhas ou piqueniques", 
        scores: sumScores({ 
          brahma: 5, spaten: 5, corona: 25, bud: 5, stella: 15, 
          budzero: 5, coronacero: 25, becks: 5, antarctica: 5, michelob: 15, brahmazero: 5,
          skol: 5, bohemia: 5, original: 5, patagonia: 20, colorado: 5, 
        }) 
      },
      { 
        text: "Festivais e eventos musicais", 
        scores: sumScores({ 
          brahma: 5, spaten: 5, corona: 20, bud: 25, stella: 5, 
          budzero: 15, coronacero: 15, becks: 25, antarctica: 5, michelob: 5, brahmazero: 5,
          skol: 5, bohemia: 5, original: 5, patagonia: 5, colorado: 5,  
        }) 
      },
      { 
        text: "Jantares ou experiências gastronômicas", 
        scores: sumScores({ 
          brahma: 5, spaten: 5, corona: 15, bud: 5, stella: 25, 
          budzero: 5, coronacero: 15, becks: 10, antarctica: 5, michelob: 20, brahmazero: 5,
          skol: 5, bohemia: 5, original: 5, patagonia: 20, colorado: 25,   
        }) 
      },
      { 
        text: "Acompanhando jogos de futebol", 
        scores: sumScores({ 
          brahma: 25, spaten: 5, corona: 5, bud: 20, stella: 5, 
          budzero: 5, coronacero: 5, becks: 5, antarctica: 20, michelob: 5, brahmazero: 20,
          skol: 20, bohemia: 15, original: 15, patagonia: 5, colorado: 5,
        }) 
      },
      { 
        text: "Acompanhando lutas", 
        scores: sumScores({ 
          brahma: 5, spaten: 25, corona: 5, bud: 5, stella: 5, 
          budzero: 5, coronacero: 5, becks: 5, antarctica: 5, michelob: 5, brahmazero: 5,
          skol: 5, bohemia: 5, original: 5, patagonia: 5, colorado: 5, 
        }) 
      },
      { 
        text: "Acompanhando atividades físicas diversas", 
        scores: sumScores({ 
          brahma: 15, spaten: 15, corona: 25, bud: 5, stella: 5, 
          budzero: 15, coronacero: 15, becks: 5, antarctica: 5, michelob: 20, brahmazero: 15,
          skol: 5, bohemia: 5, original: 5, patagonia: 5, colorado: 5,  
        }) 
      },
      { 
        text: "Após (ou até durante) aquela corrida", 
        scores: sumScores({ 
          brahma: 5, spaten: 5, corona: 20, bud: 5, stella: 15, 
          budzero: 20, coronacero: 20, becks: 5, antarctica: 5, michelob: 25, brahmazero: 15,
          skol: 5, bohemia: 5, original: 5, patagonia: 5, colorado: 5,  
        }) 
      },
      { 
        text: "Assistindo eventos esportivos", 
        scores: sumScores({ 
          brahma: 25, spaten: 20, corona: 5, bud: 10, stella: 5, 
          budzero: 5, coronacero: 5, becks: 5, antarctica: 20, michelob: 5, brahmazero: 20,
          skol: 5, bohemia: 5, original: 5, patagonia: 5, colorado: 5,  
        }) 
      },
    ],
    multipleChoice: true,
    requiredChoices: 3 // Adicionado para validar o número exato de opções
  },
  {
    question: "Qual o perfil de sabor que você prefere?",
    options: [
      { 
        text: "Leve e refrescante", 
        scores: sumScores({ 
          brahma: 25, spaten: 15, corona: 25, bud: 25, stella: 20, 
          budzero: 25, coronacero: 20, becks: 15, antarctica: 25, michelob: 20, brahmazero: 20,
          skol: 25, bohemia: 20, original: 25, patagonia: 15, colorado: 5,
        }) 
      },
      { 
        text: "Moderado e equilibrado", 
        scores: sumScores({ 
          brahma: 20, spaten: 25, corona: 25, bud: 20, stella: 15, 
          budzero: 20, coronacero: 15, becks: 25, antarctica: 20, michelob: 20, brahmazero: 15,
          skol: 15, bohemia: 20, original: 20, patagonia: 20, colorado: 25,
        }) 
      },
      { 
        text: "Marcante e encorpado", 
        scores: sumScores({ 
          brahma: 15, spaten: 25, corona: 5, bud: 10, stella: 5, 
          budzero: 10, coronacero: 10, becks: 25, antarctica: 10, michelob: 15, brahmazero: 10,
          skol: 10, bohemia: 10, original: 25, patagonia: 25, colorado: 25,
        }) 
      },
      { 
        text: "Flexível, depende da ocasião", 
        scores: sumScores({ 
          brahma: 25, spaten: 5, corona: 15, bud: 20, stella: 25, 
          budzero: 15, coronacero: 20, becks: 25, antarctica: 10, michelob: 25, brahmazero: 15,
          skol: 25, bohemia: 25, original: 15, patagonia: 25, colorado: 25,  
        }) 
      },
    ],
    multipleChoice: false
  },
  {
    question: "Você quer uma cerveja zero álcool?",
    options: [
      { 
        text: "Sim", 
        scores: sumScores({ 
          budzero: 25, coronacero: 25, michelob: 20, brahmazero: 25,
        }) 
      },
      { 
        text: "Não", 
        scores: sumScores({ 
          brahma: 25, spaten: 25, corona: 25, bud: 25, stella: 25, becks: 25, antarctica: 25, michelob: 25,
          skol: 25, bohemia: 25, original: 25, patagonia: 25, colorado: 25,
        }) 
      },
      { 
        text: "Nunca provei", 
        scores: sumScores({ 
          budzero: 5, coronacero: 10, michelob: 10, brahmazero: 5,
        }) 
      },
    ],
    multipleChoice: false
  },
  {
    question: "Qual sua embalagem preferida para a cerveja?",
    options: [
      { text: "Lata 350 ml", scores: sumScores({ lt350: 1 }) },
      { text: "Long Neck", scores: sumScores({ ln: 100 }) },
      { text: "Lata 473 ml (Latão)", scores: sumScores({ lt473: 1 }) },
      { text: "Lata 279 ml (Latinha)", scores: sumScores({ lt279: 1 }) },
      { 
        text: "Outro", 
        scores: sumScores({ lt350: 0 }), 
        isOther: true
      }
    ],
    multipleChoice: false,
  }
];

const pages = {
  brahma: "brahma.html",
  spaten: "spaten.html",
  corona: "corona.html",
  bud: "budweiser.html",
  stella: "stella.html",
  budzero: "budzero.html",
  coronacero: "coronacero.html",
  becks: "becks.html",
  antarctica: "antarctica.html",
  michelob: "michelob.html",
  brahmazero: "brahmazero.html",
  skol: "skol.html",
  bohemia: "bohemia.html",
  original: "original.html",
  patagonia: "patagonia.html",
  colorado: "colorado.html"
};

const friendlyNames = {
  skol: "Skol", 
  bohemia: "Bohemia", 
  original: "Original", 
  patagonia: "Patagonia", 
  colorado: "Colorado",
  brahma: "Brahma", 
  spaten: "Spaten", 
  corona: "Corona", 
  bud: "Budweiser", 
  stella: "Stella Artois", 
  budzero: "Bud Zero",
  coronacero: "Corona Cero", 
  becks: "Beck's", 
  antarctica: "Antarctica", 
  lt350: "Lata 350ml",
  ln: "Long Neck", 
  lt473: "Lata 473ml (Latão)", 
  lt279: "Lata 279ml (Latinha)", 
  michelob: "Michelob Ultra", 
  brahmazero: "Brahma Zero",
};

// Estado inicial
let currentQuestion = 0;
let preferredPackaging = '';
const scores = {
  skol: 0, bohemia: 0, original: 0, patagonia: 0, colorado: 0,
  brahma: 0, spaten: 0, corona: 0, bud: 0, stella: 0, budzero: 0, coronacero: 0,
  becks: 0, antarctica: 0, lt350: 0, ln: 0, lt473: 0, lt279: 0, michelob: 0, brahmazero: 0,
};

let questionHistory = [];
let questionScores = []; // Para acompanhar os scores por questão

function loadQuestion() {
  const questionContainer = document.getElementById("question-container");
  if (!questionContainer) return; // Cláusula de proteção para container ausente
  
  questionContainer.innerHTML = "";
  const question = questions[currentQuestion];
  const questionTitle = document.createElement("h2");
  questionTitle.innerText = question.question;
  questionContainer.appendChild(questionTitle);

  if (question.multipleChoice) {
    renderMultipleChoice(question, questionContainer);
  } else {
    renderSingleChoice(question, questionContainer);
  }

  if (currentQuestion > 0) {
    const backButton = document.createElement("button");
    backButton.innerText = "Voltar";
    backButton.addEventListener("click", goBack);
    backButton.classList.add("voltar");
    questionContainer.appendChild(backButton);
  }
}

function renderMultipleChoice(question, container) {
  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options-container");
  
  // Configuração específica para a questão 2 (índice atual é 2)
  if (currentQuestion === 2) {
    optionsContainer.dataset.question = "2";
    
    // Ajuste responsivo para dispositivos móveis
    if (window.innerWidth <= 768) {
      optionsContainer.style.gridTemplateColumns = "1fr";
    } else {
      optionsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
    
    optionsContainer.style.gap = "10px";
    optionsContainer.style.display = "grid";
  }

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.optionIndex = index;

    // Adicionando estilo para as opções de checkbox
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.marginBottom = "10px";
    label.style.cursor = "pointer";
    
    checkbox.style.marginRight = "8px";

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(option.text));
    optionsContainer.appendChild(label);
  });

  container.appendChild(optionsContainer);

  const nextButton = document.createElement("button");
  nextButton.innerText = "Próxima";
  nextButton.addEventListener("click", () => {
    const checkedBoxes = optionsContainer.querySelectorAll('input[type="checkbox"]:checked');
    
    // Verificação específica para a pergunta que requer exatamente 3 escolhas
    if (question.requiredChoices && checkedBoxes.length !== question.requiredChoices) {
      alert(`Por favor, selecione exatamente ${question.requiredChoices} opções.`);
      return;
    } else if (checkedBoxes.length === 0) {
      alert("Por favor, selecione pelo menos uma opção.");
      return;
    }
    
    handleMultipleChoiceAnswers();
  });
  container.appendChild(nextButton);
}

function renderSingleChoice(question, container) {
  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options-container");

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.addEventListener("click", () => {
      // Remove a classe selecionada de todos os botões
      optionsContainer.querySelectorAll("button").forEach(btn => 
        btn.classList.remove("selected")
      );
      // Adiciona a classe selecionada ao botão clicado
      button.classList.add("selected");
      handleAnswer(option.scores);
    });
    optionsContainer.appendChild(button);
  });

  container.appendChild(optionsContainer);
}

function handleMultipleChoiceAnswers() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const question = questions[currentQuestion];
  const totalScores = {};
  
  checkboxes.forEach((checkbox) => {
    const index = parseInt(checkbox.dataset.optionIndex);
    const optionScores = question.options[index].scores;
    
    Object.entries(optionScores).forEach(([key, value]) => {
      totalScores[key] = (totalScores[key] || 0) + value;
    });
  });
  
  // Guarda os scores desta questão específica para possível reversão
  questionScores[currentQuestion] = {...totalScores};
  
  updateScores(totalScores);
  questionHistory.push(currentQuestion);
  nextQuestion();
}

function handleAnswer(scoresToAdd) {
  // Guarda os scores desta questão específica para possível reversão
  questionScores[currentQuestion] = {...scoresToAdd};
  
  updateScores(scoresToAdd);
  questionHistory.push(currentQuestion);
  nextQuestion();
}

function updateScores(scoresToAdd) {
  Object.entries(scoresToAdd).forEach(([key, value]) => {
    if (scores.hasOwnProperty(key)) {
      scores[key] += value;
    }
  });
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    calculateResult();
  }
}

function goBack() {
  if (questionHistory.length > 0) {
    const previousQuestion = questionHistory.pop();
    
    // Remove os scores da questão anterior
    if (questionScores[previousQuestion]) {
      Object.entries(questionScores[previousQuestion]).forEach(([key, value]) => {
        if (scores.hasOwnProperty(key)) {
          scores[key] -= value;
        }
      });
    }
    
    currentQuestion = previousQuestion;
    loadQuestion();
  }
}

function calculateResult() {
  const sortedScores = Object.entries(scores)
    .filter(([key]) => pages.hasOwnProperty(key))
    .sort(([, a], [, b]) => b - a);
  
  const topThreeBeers = sortedScores.slice(0, 3);
  const topBeer = topThreeBeers[0][0];
  
  // Obtém a preferência de embalagem
  const packagingScores = { lt350: scores.lt350, ln: scores.ln, lt473: scores.lt473, lt279: scores.lt279 };
  const topPackaging = Object.entries(packagingScores).sort(([, a], [, b]) => b - a)[0][0];

  // Exibição aprimorada do resultado com os 3 melhores matches
  const resultContainer = document.getElementById("question-container");
  if (!resultContainer) return;

  const resultHtml = `
    <div class="result-wrapper animate-fade-in">
      <div class="result-content">
        <div class="congratulations">
          <span class="emoji">🎊</span>
          <h2>Parabéns!</h2>
          <span class="emoji">🎊</span>
        </div>
        
        <div class="match-result">
          <h3>Suas Top 3 Cervejas:</h3>
          <div class="top-beers">
            ${topThreeBeers.map(([beer, score], index) => `
              <div class="beer-match ${index === 0 ? 'primary-match' : 'secondary-match'}">
                <span class="position">${index + 1}º</span>
                <a href="${pages[beer]}" class="beer-link">
                  ${friendlyNames[beer]}
                </a>
                <div class="match-score">
                  <div class="score-bar" style="width: ${(score / topThreeBeers[0][1] * 100)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="packaging-result">
          <p>Embalagem Recomendada: ${friendlyNames[topPackaging]}</p>
        </div>
          
        <div class="promo-section">
          <p>Aproveite agora! Clique abaixo para descobrir promoções especiais:</p>
          <a href="mercados.html" class="promo-button">
            VER PROMOÇÕES EXCLUSIVAS
          </a>
          <a href="Inicial.html" class="promo-button">
            CONHECER O PROJETO
          </a>
        </div>
      </div>
    </div>
  `;

  resultContainer.innerHTML = resultHtml;

  // Adiciona estilos aprimorados para a página de resultados
  if (!document.getElementById('result-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'result-styles';
    styleSheet.textContent = `
      .result-wrapper {
        width: 100%;
        min-height: 100vh;
        padding: 2rem;
        background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
      }

      .result-content {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }

      .congratulations {
        text-align: center;
        margin-bottom: 2rem;
      }

      .top-beers {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .beer-match {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
        transition: transform 0.2s;
      }

      .beer-match:hover {
        transform: translateX(5px);
      }

      .primary-match {
        background: #fff3cd;
      }

      .position {
        font-weight: bold;
        color: #0077c8;
      }

      .match-score {
        flex-grow: 1;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
      }

      .score-bar {
        height: 100%;
        background: #0077c8;
        border-radius: 4px;
        transition: width 1s ease-out;
      }

      .beer-link {
        color: #0077c8;
        text-decoration: none;
        font-weight: 600;
      }

      .beer-link:hover {
        text-decoration: underline;
      }

      .promo-button {
        display: inline-block;
        margin-top: 1.5rem;
        margin-right: 0.5rem;
        background: #0077c8;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        text-align: center;
      }

      .promo-button:hover {
        background: #005fa3;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .result-content {
          padding: 1.5rem;
        }

        .beer-match {
          flex-direction: column;
          text-align: center;
          gap: 0.5rem;
        }
        
        .promo-button {
          display: block;
          width: 100%;
          margin-right: 0;
        }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.8s ease-in-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

// Inicializa o quiz
window.onload = loadQuestion;