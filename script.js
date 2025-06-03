//script.js
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
let selectedMunicipio = ""; // Nova variável para armazenar o município selecionado
let lastDataToSave = null; // Variável global para armazenar os dados do último resultado

// Lista completa das cervejas no sistema
const allBeers = [
  'brahma', 'spaten', 'corona', 'bud', 'stella', 'budzero', 'coronacero',
  'becks', 'antarctica', 'michelob', 'brahmazero', 'skol', 'bohemia',
  'original', 'patagonia', 'colorado', 'stellapg'
];

// Adicionando o objeto beerDescriptions que estava faltando
const beerDescriptions = {
  'brahma': 'Cerveja leve e refrescante, com sabor equilibrado e notas de malte.',
  'spaten': 'Cerveja premium com tradição alemã, sabor encorpado e notas de lúpulo.',
  'corona': 'Cerveja mexicana refrescante, leve e cítrica, ideal para dias quentes.',
  'bud': 'Cerveja americana equilibrada, com sabor suave e refrescante.',
  'stella': 'Cerveja premium belga, com sabor rico e encorpado.',
  'budzero': 'Versão sem álcool da Budweiser, mantendo o sabor refrescante.',
  'coronacero': 'Corona sem álcool, mantendo o frescor e notas cítricas.',
  'becks': 'Cerveja alemã premium, sabor marcante com amargor característico.',
  'antarctica': 'Cerveja brasileira tradicional, leve e refrescante.',
  'michelob': 'Cerveja ultra premium, equilibrada com notas maltadas.',
  'brahmazero': 'Versão zero álcool da Brahma, mantendo o sabor original.',
  'skol': 'Cerveja leve e refrescante, ideal para momentos descontraídos.',
  'bohemia': 'Primeira cerveja do Brasil, com sabor premium e notas de malte.',
  'original': 'Cerveja com receita original, sabor autêntico e encorpado.',
  'patagonia': 'Cerveja artesanal premium, com ingredientes selecionados.',
  'colorado': 'Cerveja artesanal com ingredientes brasileiros e sabor único.',
  'stellapg': 'Versão premium da Stella Artois, com sabor refinado.'
};

// Adicionando o objeto friendlyNames que estava faltando
const friendlyNames = {
  'brahma': 'Brahma',
  'spaten': 'Spaten',
  'corona': 'Corona',
  'bud': 'Budweiser',
  'stella': 'Stella Artois',
  'budzero': 'Budweiser Zero',
  'coronacero': 'Corona Cero',
  'becks': 'Beck\'s',
  'antarctica': 'Antarctica',
  'michelob': 'Michelob Ultra',
  'brahmazero': 'Brahma Zero',
  'skol': 'Skol',
  'bohemia': 'Bohemia',
  'original': 'Original',
  'patagonia': 'Patagonia',
  'colorado': 'Colorado',
  'stellapg': 'Stella Artois Premium'
};

// Adicionando o objeto municipioPromoPages que estava faltando
const municipioPromoPages = {
  "Belford Roxo": "promocoes-belford-roxo.html",
  "Campos dos Goytacazes": "promocoes-campos.html",
  "Duque de Caxias": "promocoes-caxias.html",
  "Nova Iguaçu": "promocoes-nova-iguacu.html",
  "Niterói": "promocoes-niteroi.html",
  "Outro(s)": "promocoes.html",
  "Petrópolis": "promocoes-petropolis.html",
  "Rio de Janeiro": "promocoes-rio.html",
  "São Gonçalo": "promocoes-sao-goncalo.html",
  "São João de Meriti": "promocoes-meriti.html",
  "Serra": "promocoes-serra.html",
  "Vila Velha": "promocoes-vila-velha.html",
  "Vitória": "promocoes-vitoria.html",
  "Volta Redonda": "promocoes-volta-redonda.html"
};

// Função global para gerar PDF - movida para fora de outras funções
function gerarPDF(data) {
  try {
    console.log("Iniciando geração do PDF...", data);
    
    // Preenche os dados no conteúdo oculto
    document.getElementById('pdf-municipio').textContent = `Município: ${data.municipio || 'Não informado'}`;
    document.getElementById('pdf-data').textContent = `Data: ${new Date().toLocaleDateString('pt-BR')}`;

    // Preencher o ranking
    const ulRanking = document.getElementById('pdf-ranking');
    ulRanking.innerHTML = '';
    if (data.resultados && data.resultados.porcentagens) {
      data.resultados.porcentagens.forEach((linha, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${linha}`;
        li.style.marginBottom = '6px';
        li.style.fontSize = '14px';
        ulRanking.appendChild(li);
      });
    }

    // Preencher as respostas
    const ulRespostas = document.getElementById('pdf-respostas');
    ulRespostas.innerHTML = '';
    if (data.respostas) {
      Object.entries(data.respostas).forEach(([key, value]) => {
        const li = document.createElement('li');
        li.textContent = `${key.replace("pergunta", "Pergunta ")}: ${value}`;
        li.style.marginBottom = '6px';
        li.style.fontSize = '12px';
        ulRespostas.appendChild(li);
      });
    }

    const pdfContent = document.getElementById('pdf-captura');
    pdfContent.style.display = 'block'; // Torna visível para capturar

 setTimeout(() => {
  // Substitui temporariamente as imagens por texto
  const images = pdfContent.querySelectorAll('img');
  const originalSrcs = [];
  
  images.forEach((img, index) => {
    originalSrcs[index] = img.src;
    const textDiv = document.createElement('div');
    textDiv.textContent = img.alt || 'Cerveja';
    textDiv.style.cssText = 'width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;';
    img.parentNode.replaceChild(textDiv, img);
  });

  html2canvas(pdfContent, { 
    scale: 2,
    backgroundColor: '#004c99'
  }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Se a imagem for muito alta, ajustar para caber na página
        if (pdfHeight > pdf.internal.pageSize.getHeight()) {
          const ratio = pdf.internal.pageSize.getHeight() / pdfHeight;
          const adjustedWidth = pdfWidth * ratio;
          const adjustedHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', (pdfWidth - adjustedWidth) / 2, 0, adjustedWidth, adjustedHeight);
        } else {
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save('perfil-cervejeiro.pdf');
        console.log("PDF gerado com sucesso!");

        pdfContent.style.display = 'none'; // Esconde novamente
      }).catch(error => {
        console.error("Erro ao gerar canvas:", error);
        alert("Erro ao gerar PDF. Tente novamente.");
        pdfContent.style.display = 'none';
      });
    }, 500);

  } catch (error) {
    console.error("Erro na função gerarPDF:", error);
    alert("Erro ao gerar PDF. Verifique se todas as bibliotecas estão carregadas.");
  }
}

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

const questions = [
  {
    question: "Em qual desses municípios você costuma fazer suas compras de supermercado?",
    dropdown: true,
    options: [
      { text: "Belford Roxo", scores: {} },
      { text: "Campos dos Goytacazes", scores: {} },
      { text: "Duque de Caxias", scores: {} },
      { text: "Nova Iguaçu", scores: {} },
      { text: "Niterói", scores: {} },
      { text: "Outro(s)", scores: {} },
      { text: "Petrópolis", scores: {} },
      { text: "Rio de Janeiro", scores: {} },
      { text: "São Gonçalo", scores: {} },
      { text: "São João de Meriti", scores: {} },
      { text: "Serra", scores: {} },
      { text: "Vila Velha", scores: {} },
      { text: "Vitória", scores: {} },
      { text: "Volta Redonda", scores: {} }
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
    description: "Selecione o valor médio que você costuma pagar por unidade.",
    options: [
      {
        text: "Até R$ 4,00 por unidade",
        scores: {
          brahma: 40, antarctica: 40, skol: 35, bohemia: 35, original: 30
        }
      },
      {
        text: "Até R$ 6,00 por unidade",
        scores: {
          spaten: 50, bud: 40, brahmazero: 35, budzero: 30,
          stella: 30, corona: 30, becks: 30, michelob: 20, coronacero: 25
        }
      },
      {
        text: "Até R$ 8,00 por unidade",
        scores: {
          stella: 40, becks: 40, corona: 50, patagonia: 35, colorado: 35,
          michelob: 30, brahmazero: 20, budzero: 20
        }
      },
      {
        text: "Até R$ 11,99 por unidade",
        scores: {
          patagonia: 50, colorado: 40, stellapg: 40, michelob: 30,
          stella: 30, becks: 30, corona: 30
        }
      },
      {
        text: "R$ 12,00 ou mais por unidade",
        scores: {
          colorado: 50, patagonia: 45, michelob: 40, stellapg: 40, corona: 35
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
        text: "Happy hours",
        scores: { stella: 30, bud: 30, spaten: 35, michelob: 20 }
      },
      {
        text: "Festas e celebrações",
        scores: { bud: 30, skol: 30, corona: 30, brahma: 25 }
      },
      {
        text: "Momentos ao ar livre",
        scores: { corona: 40, skol: 30, michelob: 25, brahma: 25, coronacero: 25 }
      },
      {
        text: "Jantares e Harmonizações",
        scores: { stella: 30, stellapg: 30, colorado: 30, patagonia: 30 }
      },
      {
        text: "Assistindo a jogos de futebol",
        scores: { brahma: 30, antarctica: 30, skol: 30, bud: 25, spaten: 50 }
      },
      {
        text: "Encontros românticos",
        scores: { stella: 40, colorado: 40, patagonia: 40, michelob: 25 }
      },
      {
        text: "Relaxando após o trabalho",
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
          brahmazero: 150, budzero: 150, coronacero: 150, michelob: 55, stellapg: 55
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
          brahmazero: 35, budzero: 35, coronacero: 35, michelob: 25, stellapg: 25,
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
          brahma: 30, skol: 30, antarctica: 30, bud: 25, stella: 25
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

function calculateCompatibilityPercentage(beerScores) {
  const percentages = {};
  const maxBeerScore = Math.max(...Object.values(beerScores));

  for (const [beer, score] of Object.entries(beerScores)) {
    if (beerDescriptions[beer]) {
      // Define o maior score como 100% e os demais proporcionalmente
      const percentage = Math.round((score / maxBeerScore) * 100);
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
      
      // Verificar se o elemento existe antes de tentar acessá-lo
      const perguntaElement = document.getElementById(`pergunta${currentQuestion + 1}`);
      if (perguntaElement) {
        perguntaElement.value = opt.text;
      }
      
      // Salvar o município selecionado
      if (currentQuestion === 0) {
        selectedMunicipio = opt.text;
      }

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

    // Adicionar JS para seleção visual diretamente
    optionsDiv.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', function() {
        if (this.checked) {
          this.parentElement.classList.add('selected');
        } else {
          this.parentElement.classList.remove('selected');
        }
      });
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
      
      // Verificar se o elemento existe antes de tentar acessá-lo
      const perguntaElement = document.getElementById(`pergunta${currentQuestion + 1}`);
      if (perguntaElement) {
        perguntaElement.value = selectedAnswers.join(', ');
      }

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
        
        // Verificar se o elemento existe antes de tentar acessá-lo
        const perguntaElement = document.getElementById(`pergunta${currentQuestion + 1}`);
        if (perguntaElement) {
          perguntaElement.value = opt.text;
        }

        nextQuestion();
      };
      optionsDiv.appendChild(btn);
    });
    container.appendChild(optionsDiv);
  }

  // Estilos de seleção
  const styleElement = document.createElement('style');
  styleElement.textContent = `

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

// Modificação na função showResults para mostrar TODAS as cervejas com suas compatibilidades
function showResults() {
  const container = document.getElementById('question-container');
  
  // Ocultar a barra de progresso
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.display = 'none';
  }
  const progressContainer = document.querySelector('.progress-container');
  if (progressContainer) {
    progressContainer.style.display = 'none';
  }
  
  // Ocultar o título principal
  const mainTitle = document.querySelector('h1');
  if (mainTitle) {
    mainTitle.style.display = 'none';
  }
  
  // Calcular as porcentagens de compatibilidade
  const beerPercentages = calculateCompatibilityPercentage(scores);
  
  // Ordenar TODAS as cervejas por porcentagem de compatibilidade (não limitar a 3)
  const allBeersRanked = Object.entries(beerPercentages)
    .filter(([key]) => beerDescriptions[key])
    .sort((a, b) => b[1] - a[1]); // Ordenar do maior para o menor
  
  const dataToSave = {
    respostas: respostas,
    resultados: {
      cervejas: allBeersRanked.map(([beer]) => friendlyNames[beer]),
      porcentagens: allBeersRanked.map(([beer, percentage]) => `${friendlyNames[beer]}: ${percentage}%`)
    },
    scores: scores,
    porcentagensCompatibilidade: beerPercentages,
    municipio: selectedMunicipio
  };

  // Salvar dados globalmente para uso no PDF
  lastDataToSave = dataToSave;

  saveDataToFirebase(dataToSave).then(success => {
    if (success) getData();
  });

  // Determinar a página de promoções apropriada baseada no município selecionado
  const promoPageURL = municipioPromoPages[selectedMunicipio] || "promocoes.html";

container.innerHTML = `
<div class="results-container">
  <div class="results-header">
    <h2>Seu Perfil Cervejeiro Completo</h2>
    <p>Aqui estão as cervejas rankeadas por compatibilidade com o seu perfil!</p>
  </div>

  <div class="export-section">
    <h3>Exportar Resultado</h3>
    <button class="btn-outline" id="btn-exportar-pdf">Exportar para PDF</button>
  </div>
  <div class="action-buttons">
    <a href="index.html" class="btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Conheça o Projeto
    </a>
    <a href="promocoes.html" class="btn-promo">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
      Conheça as Promoções <span class="btn-indicator">→</span>
    </a>
  </div>
      <div class="results-section">
        <h3>Ranking Completo de Compatibilidade</h3>
        <div class="beer-list">
          ${allBeersRanked.map(([beer, percentage], index) => `
            <div class="beer-card ${index === 0 ? 'top-match' : ''} ${index < 3 ? 'top-three' : ''}">
              <div class="ranking-position">#${index + 1}</div>
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

document.getElementById('btn-exportar-pdf').addEventListener('click', () => {
  if (lastDataToSave) {
    gerarPDF(lastDataToSave);
  } else {
    alert('Dados não disponíveis para exportação.');
  }
});

}
