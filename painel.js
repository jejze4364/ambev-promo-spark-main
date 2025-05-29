// Variáveis globais e configurações iniciais
const municipios = [
  "Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Belford Roxo",
  "Niterói", "Campos dos Goytacazes", "São João de Meriti", "Volta Redonda", "Petrópolis", "Outro(s)"
];

const faixasEtarias = [
  "18 a 27 anos", "28 a 37 anos", "38 a 45 anos", "Acima de 45 anos"
];

const municipioPromoPages = {
  "Rio de Janeiro": "promoriojaneiro.html",
  "São Gonçalo": "promosaogoncalo.html",
  "Duque de Caxias": "promoduquecaxias.html",
  "Nova Iguaçu": "promonovaiguacu.html",
  "Belford Roxo": "promobelfordroxo.html",
  "Niterói": "promoniteroi.html",
  "Campos dos Goytacazes": "promocamposgoytacazes.html",
  "São João de Meriti": "promosaojoaomeriti.html",
  "Volta Redonda": "promovoltaredonda.html",
  "Petrópolis": "promopetropolis.html",
  "Outro(s)": "promocoes.html"
};

let allSurveys = [];
let pieChart = null;
let filteredSurveys = [];
let currentPage = 1;
const itemsPerPage = 10;

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
  stellapg: "Stella Artois Sem Glúten"
};

const questionLabels = {
  pergunta1: "Município",
  pergunta2: "Faixa Etária",
  pergunta3: "Preço",
  pergunta4: "Ocasiões",
  pergunta5: "Opções Zero Álcool",
  pergunta6: "Frequência"
};

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvMFh5CNWeCXqBo98GJvj-YGACSlmB81c",
  authDomain: "pesquisa-8a0f9.firebaseapp.com",
  projectId: "pesquisa-8a0f9",
  storageBucket: "pesquisa-8a0f9.appspot.com",
  messagingSenderId: "453188166697",
  appId: "1:453188166697:web:c1144b2abeb1edc3b16838",
  measurementId: "G-H34QHPSPS1"
};

let app, analytics, db;

// Variáveis globais para gráficos
let brandChart = null;
let correlationChart = null;

// Utilitários
function safeGet(obj, path, defaultValue = null) {
  try {
    return path.split('.').reduce((o, p) => o && o[p], obj) || defaultValue;
  } catch {
    return defaultValue;
  }
}

function formatDate(date) {
  if (!date) return 'N/D';
  try {
    if (typeof date.toDate === 'function') return date.toDate().toLocaleDateString('pt-BR');
    if (date instanceof Date) return date.toLocaleDateString('pt-BR');
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return 'N/D';
  }
}

function parseNumber(value, defaultValue = 0) {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
}

function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  console.error(message);
}

function hideError() {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// Inicialização Firebase
function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK não carregado.');
    }
    app = firebase.initializeApp(firebaseConfig);
    if (firebase.analytics) analytics = firebase.analytics();
    if (firebase.firestore) db = firebase.firestore();
    hideError();
  } catch (error) {
    showError('Erro ao inicializar Firebase: ' + error.message);
  }
}

// Obter cerveja com maior pontuação
function getTopBeer(scores) {
  if (!scores || typeof scores !== 'object') return null;
  
  let topBeer = null;
  let topScore = -Infinity;
  
  for (const [beer, score] of Object.entries(scores)) {
    if (!beer || beer === 'undefined' || beer === 'null') continue;
    
    const numScore = parseNumber(score, -Infinity);
    if (numScore > topScore) {
      topScore = numScore;
      topBeer = beer;
    }
  }
  
  return topBeer;
}

// Atualiza KPIs no painel
function atualizarKPIs(surveys) {
  if (!Array.isArray(surveys)) return;

  const totalElement = document.getElementById('total-respostas');
  const idadeElement = document.getElementById('idade-media');
  const ticketElement = document.getElementById('ticket-medio');
  const favoritaElement = document.getElementById('cerveja-favorita');

  const total = surveys.length;
  if (totalElement) totalElement.textContent = total;

  // Cálculo de idade média
  const faixaIdadeMedia = {
    "18 a 27 anos": 22.5,
    "28 a 37 anos": 32.5,
    "38 a 45 anos": 41.5,
    "Acima de 45 anos": 50
  };
  
  const idades = surveys
    .map(s => faixaIdadeMedia[safeGet(s, 'respostas.pergunta2')])
    .filter(idade => !isNaN(idade));
    
  const idadeMedia = idades.length > 0 ? 
    (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1) : '-';
  
  if (idadeElement) {
    idadeElement.textContent = idadeMedia !== '-' ? `${idadeMedia} anos` : '-';
  }

  // Cálculo de ticket médio
  const gastoMedio = {
    "Até R$ 4,00 por unidade": 4,
    "Entre R$ 4,00 e R$ 5,99 por unidade": 5,
    "Entre R$ 6,00 e R$ 7,99 por unidade": 7,
    "R$ 8,00 ou mais por unidade": 9
  };
  
  const gastos = surveys
    .map(s => gastoMedio[safeGet(s, 'respostas.pergunta3')])
    .filter(gasto => !isNaN(gasto));
    
  const ticket = gastos.length > 0 ? 
    'R$ ' + (gastos.reduce((a, b) => a + b, 0) / gastos.length).toFixed(2) : '-';
  
  if (ticketElement) ticketElement.textContent = ticket;

  // Cerveja mais votada
  const cervejasCount = {};
  surveys.forEach(s => {
    const favorita = getTopBeer(s.scores);
    if (favorita) {
      cervejasCount[favorita] = (cervejasCount[favorita] || 0) + 1;
    }
  });
  
  const maisVotada = Object.entries(cervejasCount)
    .sort((a, b) => b[1] - a[1])[0];
    
  if (favoritaElement) {
    favoritaElement.textContent = maisVotada ? 
      (friendlyNames[maisVotada[0]] || maisVotada[0]) : '-';
  }
}

// Carrega dados do Firebase Firestore
function loadDataFromFirebase() {
  showLoading(true);
  hideError();

  if (!db) {
    showError('Firestore não inicializado.');
    showLoading(false);
    return;
  }

  db.collection("pesquisas").get()
    .then(snapshot => {
      allSurveys = [];
      
      snapshot.forEach(doc => {
        try {
          const data = doc.data();
          let dataFormatada = null;
          
          if (data.timestamp) {
            if (typeof data.timestamp.toDate === 'function') {
              dataFormatada = data.timestamp.toDate();
            } else if (data.timestamp instanceof Date) {
              dataFormatada = data.timestamp;
            } else {
              dataFormatada = new Date(data.timestamp);
            }
          }
          
          allSurveys.push({
            id: doc.id,
            data: dataFormatada,
            respostas: data.respostas || {},
            scores: data.scores || {}
          });
        } catch (error) {
          console.warn('Erro ao processar documento:', doc.id, error);
        }
      });
      
      filteredSurveys = [...allSurveys];
      renderDashboard();
      showLoading(false);
      hideError();
    })
    .catch(error => {
      showError('Erro ao carregar dados: ' + error.message);
      showLoading(false);
    });
}

// Funções de filtro
function applyFilters() {
  try {
    let startDate = null, endDate = null;
    
    // Date range picker
    const dateRangeElement = document.getElementById('date-range');
    if (dateRangeElement && typeof $ !== 'undefined' && $(dateRangeElement).data('daterangepicker')) {
      const dr = $(dateRangeElement).data('daterangepicker');
      startDate = dr.startDate.toDate();
      endDate = dr.endDate.toDate();
    }

    const city = safeGet(document.getElementById('filter-city'), 'value', '');
    const age = safeGet(document.getElementById('filter-age'), 'value', '');
    const brand = safeGet(document.getElementById('filter-brand'), 'value', '');

    filteredSurveys = allSurveys.filter(survey => {
      // Filtro de data
      if (startDate && endDate && survey.data) {
        if (survey.data < startDate || survey.data > endDate) return false;
      }
      
      // Filtro de cidade
      if (city && safeGet(survey, 'respostas.pergunta1') !== city) return false;
      
      // Filtro de idade
      if (age && safeGet(survey, 'respostas.pergunta2') !== age) return false;
      
      // Filtro de marca
      if (brand) {
        const topBeer = getTopBeer(survey.scores);
        if (topBeer !== brand) return false;
      }
      
      return true;
    });

    currentPage = 1;
    renderDashboard();
  } catch (error) {
    showError('Erro ao aplicar filtros: ' + error.message);
  }
}

function clearFilters() {
  try {
    // Reset date range picker
    const dateRangeElement = document.getElementById('date-range');
    if (dateRangeElement && typeof $ !== 'undefined' && $(dateRangeElement).data('daterangepicker')) {
      const dr = $(dateRangeElement).data('daterangepicker');
      dr.setStartDate(moment().subtract(30, 'days'));
      dr.setEndDate(moment());
    }
    
    // Reset select elements
    const selects = ['filter-city', 'filter-age', 'filter-brand'];
    selects.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.value = '';
    });

    filteredSurveys = [...allSurveys];
    currentPage = 1;
    renderDashboard();
  } catch (error) {
    showError('Erro ao limpar filtros: ' + error.message);
  }
}
function exportToExcel() {
  try {
    if (filteredSurveys.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const data = [];

    // Cabeçalhos
    data.push([
      "Data", "Município", "Faixa Etária", "Preço", "Ocasiões",
      "Zero Álcool", "Frequência", "Cerveja Favorita", "Score"
    ]);

    // Linhas
    filteredSurveys.forEach(s => {
      const dataLinha = formatDate(s.data);
      const municipio = safeGet(s, 'respostas.pergunta1', '');
      const idade = safeGet(s, 'respostas.pergunta2', '');
      const preco = safeGet(s, 'respostas.pergunta3', '');
      const ocasioes = safeGet(s, 'respostas.pergunta4', '');
      const zeroAlcool = safeGet(s, 'respostas.pergunta5', '');
      const frequencia = safeGet(s, 'respostas.pergunta6', '');
      
      const topBeer = getTopBeer(s.scores);
      const cerveja = topBeer ? (friendlyNames[topBeer] || topBeer) : '';
      const score = topBeer && s.scores[topBeer] !== undefined ? 
        parseNumber(s.scores[topBeer]).toFixed(0) : '';

      data.push([
        dataLinha, municipio, idade, preco, ocasioes,
        zeroAlcool, frequencia, cerveja, score
      ]);
    });

    // Cria uma planilha
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pesquisa");

    // Gera o arquivo
    XLSX.writeFile(workbook, "pesquisa_cervejas.xlsx");

  } catch (error) {
    showError('Erro ao exportar Excel: ' + error.message);
  }
}
// Renderizar dashboard completo
function renderDashboard() {
  try {
    atualizarKPIs(filteredSurveys);
    renderStats();
    renderBeerRankings();
    renderResultsTable();
    renderBrandChart();
    renderBrandComparison();
    renderPieChartTop5();
  } catch (error) {
    showError('Erro ao renderizar dashboard: ' + error.message);
  }
}

// Função auxiliar para mostrar/ocultar loading
function showLoading(show) {
  document.body.style.cursor = show ? 'wait' : 'default';
  document.querySelectorAll('button').forEach(btn => {
    if (btn && !btn.classList.contains('toggle-button')) {
      btn.disabled = show;
    }
  });
  
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

// Estatísticas gerais
function renderStats() {
  const totalSurveys = filteredSurveys.length;
  const uniqueUsers = new Set();
  
  filteredSurveys.forEach(survey => {
    const key = `${safeGet(survey, 'respostas.pergunta1', '')}-${safeGet(survey, 'respostas.pergunta2', '')}`;
    uniqueUsers.add(key);
  });

  const totalElement = document.getElementById('total-surveys');
  const uniqueElement = document.getElementById('unique-users');
  
  if (totalElement) totalElement.textContent = totalSurveys;
  if (uniqueElement) uniqueElement.textContent = uniqueUsers.size;
}

// Ranking de cervejas
function renderBeerRankings() {
  const container = document.getElementById('beer-rankings');
  if (!container) return;

  const scores = {};
  filteredSurveys.forEach(s => {
    if (s.scores && typeof s.scores === 'object') {
      Object.entries(s.scores).forEach(([beer, score]) => {
        if (beer && beer !== 'undefined' && beer !== 'null') {
          const numScore = parseNumber(score);
          scores[beer] = (scores[beer] || 0) + numScore;
        }
      });
    }
  });

  const sorted = Object.entries(scores)
    .filter(([beer]) => beer && beer !== 'undefined' && beer !== 'null')
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="no-data">Nenhum dado de ranking disponível.</p>';
    return;
  }

  const maxScore = sorted[0][1];
  container.innerHTML = sorted.map(([beer, score], i) => `
    <div class="ranking-item">
      <div class="ranking-position">${i + 1}</div>
      <div class="ranking-details">
        <div class="ranking-name">${friendlyNames[beer] || beer}</div>
        <div class="ranking-bar-container">
          <div class="ranking-bar" style="width: ${maxScore > 0 ? (score / maxScore) * 100 : 0}%"></div>
          <span class="ranking-score">${Math.round(score)}</span>
        </div>
      </div>
    </div>
  `).join('');
}
function renderPieChartTop5() {
  const canvas = document.getElementById('pie-chart');
  if (!canvas) return;

  // Destruir gráfico anterior se existir
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }

  // Somar as pontuações por marca
  const scores = {};
  filteredSurveys.forEach(s => {
    if (s.scores && typeof s.scores === 'object') {
      Object.entries(s.scores).forEach(([beer, score]) => {
        if (beer && beer !== 'undefined' && beer !== 'null') {
          const numScore = parseNumber(score);
          scores[beer] = (scores[beer] || 0) + numScore;
        }
      });
    }
  });

  // Pegar as 5 maiores marcas
  const sorted = Object.entries(scores)
    .filter(([beer]) => beer && beer !== 'undefined' && beer !== 'null')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length === 0) return;

  const labels = sorted.map(([beer]) => friendlyNames[beer] || beer);
  const data = sorted.map(([_, score]) => score);

  if (typeof Chart !== 'undefined') {
    pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#f94144',
            '#f3722c',
            '#f8961e',
            '#f9844a',
            '#f9c74f'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Top 5 Marcas por Pontuação'
          }
        }
      }
    });
  }
}

// Renderizar tabela de resultados paginada
function renderResultsTable() {
  const tbody = document.getElementById('results-tbody');
  const pageInfo = document.getElementById('page-info');
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  if (!tbody) return;

  tbody.innerHTML = '';
  
  if (filteredSurveys.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="no-data">Nenhum dado disponível.</td></tr>';
    if (pageInfo) pageInfo.textContent = 'Página 0 de 0';
    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
    return;
  }

  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, filteredSurveys.length);

  if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  if (prevButton) prevButton.disabled = currentPage === 1;
  if (nextButton) nextButton.disabled = currentPage === totalPages;

  for (let i = start; i < end; i++) {
    const s = filteredSurveys[i];
    const row = document.createElement('tr');

    // Data
    const dateCell = document.createElement('td');
    dateCell.textContent = formatDate(s.data);
    row.appendChild(dateCell);

    // Perguntas 1-6
    for (let j = 1; j <= 6; j++) {
      const cell = document.createElement('td');
      const value = safeGet(s, `respostas.pergunta${j}`, '');
      cell.textContent = String(value).split(',').map(v => v.trim()).join(', ');
      row.appendChild(cell);
    }

    // Cerveja favorita
    const topBeer = getTopBeer(s.scores);
    const beerCell = document.createElement('td');
    beerCell.textContent = topBeer ? (friendlyNames[topBeer] || topBeer) : '-';
    row.appendChild(beerCell);

    // Score
    const scoreCell = document.createElement('td');
    const score = topBeer && s.scores && s.scores[topBeer] !== undefined ? 
      parseNumber(s.scores[topBeer]).toFixed(0) : '-';
    scoreCell.textContent = score;
    row.appendChild(scoreCell);

    tbody.appendChild(row);
  }
}

// Renderizar gráfico de marcas
function renderBrandChart() {
  const canvas = document.getElementById('brands-chart');
  if (!canvas) return;

  // Destruir gráfico anterior
  if (brandChart) {
    brandChart.destroy();
    brandChart = null;
  }

  const scores = {};
  filteredSurveys.forEach(s => {
    if (s.scores && typeof s.scores === 'object') {
      Object.entries(s.scores).forEach(([beer, score]) => {
        if (beer && beer !== 'undefined' && beer !== 'null') {
          const numScore = parseNumber(score);
          scores[beer] = (scores[beer] || 0) + numScore;
        }
      });
    }
  });

  const sorted = Object.entries(scores)
    .filter(([beer]) => beer && beer !== 'undefined' && beer !== 'null')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) return;

  const labels = sorted.map(([beer]) => friendlyNames[beer] || beer);
  const data = sorted.map(([_, score]) => score);

  if (typeof Chart !== 'undefined') {
    brandChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Pontuação',
          data,
          backgroundColor: '#f7a800'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Pontuação por Marca'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// Renderizar comparação entre duas marcas
function renderBrandComparison() {
  const brand1Element = document.getElementById('comparison-brand1');
  const brand2Element = document.getElementById('comparison-brand2');
  const resultsElement = document.getElementById('comparison-results');

  if (!brand1Element || !brand2Element || !resultsElement) return;

  const brand1 = brand1Element.value;
  const brand2 = brand2Element.value;

  if (!brand1 || !brand2 || brand1 === brand2) {
    resultsElement.innerHTML = '<p class="no-data">Selecione duas marcas diferentes.</p>';
    return;
  }

  const stats1 = calculateBrandStats(brand1);
  const stats2 = calculateBrandStats(brand2);

  resultsElement.innerHTML = `
    <table class="comparison-table table table-bordered">
      <thead>
        <tr>
          <th>Métrica</th>
          <th>${friendlyNames[brand1] || brand1}</th>
          <th>${friendlyNames[brand2] || brand2}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Pontuação Total</td>
          <td>${Math.round(stats1.totalScore)}</td>
          <td>${Math.round(stats2.totalScore)}</td>
        </tr>
        <tr>
          <td>1ª Opção</td>
          <td>${stats1.firstChoice}</td>
          <td>${stats2.firstChoice}</td>
        </tr>
        <tr>
          <td>Faixa Etária Popular</td>
          <td>${stats1.topAgeGroup}</td>
          <td>${stats2.topAgeGroup}</td>
        </tr>
        <tr>
          <td>Município Popular</td>
          <td>${stats1.topCity}</td>
          <td>${stats2.topCity}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function calculateBrandStats(brand) {
  let totalScore = 0;
  let firstChoice = 0;
  const ageGroups = {};
  const cities = {};

  filteredSurveys.forEach(survey => {
    if (survey.scores && survey.scores[brand] !== undefined) {
      const score = parseNumber(survey.scores[brand]);
      totalScore += score;

      const topBeer = getTopBeer(survey.scores);
      if (topBeer === brand) {
        firstChoice++;
        
        const ageGroup = safeGet(survey, 'respostas.pergunta2');
        if (ageGroup) ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
        
        const city = safeGet(survey, 'respostas.pergunta1');
        if (city) cities[city] = (cities[city] || 0) + 1;
      }
    }
  });

  const topAgeGroup = Object.entries(ageGroups)
    .sort((a, b) => b[1] - a[1])[0];
  const topCity = Object.entries(cities)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    totalScore,
    firstChoice,
    topAgeGroup: topAgeGroup ? topAgeGroup[0] : 'N/A',
    topCity: topCity ? topCity[0] : 'N/A'
  };
}

// Funções de navegação
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderResultsTable();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderResultsTable();
  }
}

// Função para popular selects de filtro
function populateFilterOptions() {
  const citySelect = document.getElementById('filter-city');
  const ageSelect = document.getElementById('filter-age');
  const brandSelect = document.getElementById('filter-brand');
  const comparisonBrand1 = document.getElementById('comparison-brand1');
  const comparisonBrand2 = document.getElementById('comparison-brand2');
  const correlationX = document.getElementById('correlation-x');
  const correlationY = document.getElementById('correlation-y');

  // Popular filtro de cidades
  if (citySelect) {
    citySelect.innerHTML = '<option value="">Todas as cidades</option>';
    municipios.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  // Popular filtro de idades
  if (ageSelect) {
    ageSelect.innerHTML = '<option value="">Todas as idades</option>';
    faixasEtarias.forEach(age => {
      const option = document.createElement('option');
      option.value = age;
      option.textContent = age;
      ageSelect.appendChild(option);
    });
  }

  // Popular filtro de marcas
  if (brandSelect) {
    brandSelect.innerHTML = '<option value="">Todas as marcas</option>';
    Object.entries(friendlyNames).forEach(([key, name]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = name;
      brandSelect.appendChild(option);
    });
  }

  // Popular selects de comparação
  [comparisonBrand1, comparisonBrand2].forEach(select => {
    if (select) {
      select.innerHTML = '<option value="">Selecione uma marca</option>';
      Object.entries(friendlyNames).forEach(([key, name]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = name;
        select.appendChild(option);
      });
    }
  });

  // Popular selects de correlação
  [correlationX, correlationY].forEach(select => {
    if (select) {
      select.innerHTML = '<option value="">Selecione uma pergunta</option>';
      Object.entries(questionLabels).forEach(([key, label]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = label;
        select.appendChild(option);
      });
    }
  });
}

// Função para inicializar date range picker
function initializeDateRangePicker() {
  const dateRangeElement = document.getElementById('date-range');
  if (dateRangeElement && typeof $ !== 'undefined' && typeof moment !== 'undefined') {
    try {
      $(dateRangeElement).daterangepicker({
        startDate: moment().subtract(30, 'days'),
        endDate: moment(),
        locale: {
          format: 'DD/MM/YYYY',
          separator: ' - ',
          applyLabel: 'Aplicar',
          cancelLabel: 'Cancelar',
          fromLabel: 'De',
          toLabel: 'Até',
          customRangeLabel: 'Personalizado',
          weekLabel: 'S',
          daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          firstDay: 0
        },
        ranges: {
          'Hoje': [moment(), moment()],
          'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Últimos 7 dias': [moment().subtract(6, 'days'), moment()],
          'Últimos 30 dias': [moment().subtract(29, 'days'), moment()],
          'Este mês': [moment().startOf('month'), moment().endOf('month')],
          'Mês passado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      });

      $(dateRangeElement).on('apply.daterangepicker', function() {
        applyFilters();
      });
    } catch (error) {
      console.warn('Erro ao inicializar date range picker:', error);
    }
  }
}

// Função para alternar seções do dashboard
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const button = document.querySelector(`[onclick="toggleSection('${sectionId}')"]`);
  
  if (section && button) {
    const isVisible = section.style.display !== 'none';
    section.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible ? 'Mostrar' : 'Ocultar';
  }
}

// Event listeners para comparação de marcas
function setupBrandComparisonListeners() {
  const brand1Select = document.getElementById('comparison-brand1');
  const brand2Select = document.getElementById('comparison-brand2');

  if (brand1Select) {
    brand1Select.addEventListener('change', renderBrandComparison);
  }
  if (brand2Select) {
    brand2Select.addEventListener('change', renderBrandComparison);
  }
}


// Função de inicialização principal
function initializeDashboard() {
  try {
    // Inicializar Firebase
    initializeFirebase();
    
    // Popular opções dos selects
    populateFilterOptions();
    
    // Inicializar date range picker
    initializeDateRangePicker();
    
    // Configurar event listeners
    setupBrandComparisonListeners();

    // Carregar dados
    loadDataFromFirebase();
    
    console.log('Dashboard inicializado com sucesso');
  } catch (error) {
    showError('Erro ao inicializar dashboard: ' + error.message);
  }
}

// Função para refresh manual dos dados
function refreshData() {
  showLoading(true);
  loadDataFromFirebase();
}

// Auto-refresh a cada 5 minutos
function setupAutoRefresh() {
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      refreshData();
    }
  }, 5 * 60 * 1000); // 5 minutos
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupAutoRefresh();
});

// Funções globais expostas para uso em HTML
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.exportToExcel = exportToExcel;
window.previousPage = previousPage;
window.nextPage = nextPage;
window.refreshData = refreshData;
window.toggleSection = toggleSection;
