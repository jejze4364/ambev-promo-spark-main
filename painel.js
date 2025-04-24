console.log("Firebase:", firebase);
console.log("Firestore:", firebase.firestore);

// Inicialização do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvMFh5CNWeCXqBo98GJvj-YGACSlmB81c",
  authDomain: "pesquisa-8a0f9.firebaseapp.com",
  projectId: "pesquisa-8a0f9",
  storageBucket: "pesquisa-8a0f9.appspot.com",
  messagingSenderId: "453188166697",
  appId: "1:453188166697:web:c1144b2abeb1edc3b16838",
  measurementId: "G-H34QHPSPS1"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();

firebase.firestore().collection("pesquisas").limit(1).get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.warn("⚠️ A coleção 'pesquisas' está vazia.");
    } else {
      console.log("✅ Firestore conectado com sucesso!");
      snapshot.forEach(doc => console.log("Documento exemplo:", doc.data()));
    }
  })
  .catch(error => {
    console.error("❌ Erro ao conectar com Firestore:", error);
  });



// Variáveis globais do painel
let allSurveys = [];
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

function getTopBeer(scores) {
  if (!scores) return null;
  let topBeer = null;
  let topScore = -1;
  Object.entries(scores).forEach(([beer, score]) => {
    const numScore = parseFloat(score);
    if (beer && typeof beer === 'string' && !isNaN(numScore) && numScore > topScore) {
      topBeer = beer;
      topScore = numScore;
    }
  });
  return topBeer;
}

function atualizarKPIs(surveys) {
  const total = surveys.length;
  if (document.getElementById('total-respostas')) {
    document.getElementById('total-respostas').textContent = total;
  }

  const faixaIdadeMedia = {
    "18 a 27 anos": 22.5,
    "28 a 37 anos": 32.5,
    "38 a 45 anos": 41.5,
    "Acima de 45 anos": 50
  };
  const idades = surveys.map(s => faixaIdadeMedia[s.respostas?.pergunta2]).filter(n => !isNaN(n));
  
  const idadeMedia = idades.length ? (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1) : '-';
  if (document.getElementById('idade-media')) {
    document.getElementById('idade-media').textContent = idadeMedia + ' anos';
  }

  const gastoMedio = {
    "Até R$ 4,00 por unidade": 4,
    "Entre R$ 4,00 e R$ 5,99 por unidade": 5,
    "Entre R$ 6,00 e R$ 7,99 por unidade": 7,
    "R$ 8,00 ou mais por unidade": 9
  };
  const gastos = surveys.map(s => gastoMedio[s.respostas?.pergunta3]).filter(n => !isNaN(n));
  
  const ticket = gastos.length ? 'R$ ' + (gastos.reduce((a, b) => a + b, 0) / gastos.length).toFixed(2) : '-';
  if (document.getElementById('ticket-medio')) {
    document.getElementById('ticket-medio').textContent = ticket;
  }

  const cervejas = {};
  surveys.forEach(s => {
    const favorita = getTopBeer(s.scores);
    if (favorita) cervejas[favorita] = (cervejas[favorita] || 0) + 1;
  });
  const maisVotada = Object.entries(cervejas).sort((a, b) => b[1] - a[1])[0];
  if (document.getElementById('cerveja-favorita')) {
    document.getElementById('cerveja-favorita').textContent = maisVotada ? (friendlyNames[maisVotada[0]] || maisVotada[0]) : '-';
  }
}

function loadDataFromFirebase() {
  showLoading(true);
  if (document.getElementById('error-message')) {
    document.getElementById('error-message').textContent = '';
  }

  db.collection("pesquisas")
    .get()
    .then((querySnapshot) => {
      allSurveys = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let dataFormatada = data.timestamp ? data.timestamp.toDate() : null;

        const survey = {
          id: doc.id,
          data: dataFormatada,
          respostas: data.respostas || {},
          scores: data.scores || {}
        };

        allSurveys.push(survey);
      });

      filteredSurveys = [...allSurveys];
      renderDashboard();
      showLoading(false);
    })
    .catch((error) => {
      console.error("Erro ao carregar dados:", error);
      if (document.getElementById('error-message')) {
        document.getElementById('error-message').textContent = 'Erro ao carregar dados: ' + error.message;
      }
      showLoading(false);
    });
}


function populateFilterOptions() {
  // Preencher seletores de filtro
  const citySelect = document.getElementById('filter-city');
  const ageSelect = document.getElementById('filter-age');
  const brandSelect = document.getElementById('filter-brand');
  const comparisonBrand1 = document.getElementById('comparison-brand1');
  const comparisonBrand2 = document.getElementById('comparison-brand2');
  const correlationX = document.getElementById('correlation-x');
  const correlationY = document.getElementById('correlation-y');
  
  // Limpar opções existentes
  [citySelect, ageSelect, brandSelect, comparisonBrand1, comparisonBrand2].forEach(select => {
    if (select) {
      select.innerHTML = '<option value="">Todos</option>';
    }
  });
  
  // Adicionar perguntas aos seletores de correlação
  if (correlationX && correlationY) {
    correlationX.innerHTML = '<option value="">Selecione a pergunta (X)</option>';
    correlationY.innerHTML = '<option value="">Selecione a pergunta (Y)</option>';
    
    for (let i = 1; i <= 6; i++) {
      const key = `pergunta${i}`;
      const option = document.createElement('option');
      option.value = key;
      option.textContent = questionLabels[key] || key;
      correlationX.appendChild(option.cloneNode(true));
      correlationY.appendChild(option);
    }
  }
  
  // Adicionar cidades ao filtro de cidades
  const cities = getUniqueValues('pergunta1');
  if (citySelect) {
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
  
  // Adicionar faixas etárias ao filtro de idade
  const ages = getUniqueValues('pergunta2');
  if (ageSelect) {
    ages.forEach(age => {
      const option = document.createElement('option');
      option.value = age;
      option.textContent = age;
      ageSelect.appendChild(option);
    });
  }
  
  // Adicionar marcas aos seletores
  Object.entries(friendlyNames).forEach(([key, name]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = name;
    
    if (brandSelect) brandSelect.appendChild(option.cloneNode(true));
    if (comparisonBrand1) comparisonBrand1.appendChild(option.cloneNode(true));
    if (comparisonBrand2) comparisonBrand2.appendChild(option);
  });
}

function applyFilters() {
  const dateRange = $('#date-range').data('daterangepicker');
  const startDate = dateRange ? dateRange.startDate.toDate() : null;
  const endDate = dateRange ? dateRange.endDate.toDate() : null;
  const citySelect = document.getElementById('filter-city');
  const ageSelect = document.getElementById('filter-age');
  const brandSelect = document.getElementById('filter-brand');
  
  const city = citySelect ? citySelect.value : '';
  const age = ageSelect ? ageSelect.value : '';
  const brand = brandSelect ? brandSelect.value : '';
  
  filteredSurveys = allSurveys.filter(survey => {
    // Filtro de data
    if (startDate && endDate && survey.data) {
      if (survey.data < startDate || survey.data > endDate) return false;
    }
    
    // Filtro de cidade
    if (city && survey.respostas.pergunta1 !== city) return false;
    
    // Filtro de idade
    if (age && survey.respostas.pergunta2 !== age) return false;
    
    // Filtro de marca favorita
    if (brand) {
      const topBeer = getTopBeer(survey.scores);
      if (topBeer !== brand) return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  renderDashboard();
}

function clearFilters() {
  // Resetar filtros para o valor padrão
  const dateRange = $('#date-range').data('daterangepicker');
  if (dateRange) {
    dateRange.setStartDate(moment().subtract(30, 'days'));
    dateRange.setEndDate(moment());
  }
  
  const citySelect = document.getElementById('filter-city');
  const ageSelect = document.getElementById('filter-age');
  const brandSelect = document.getElementById('filter-brand');
  
  if (citySelect) citySelect.value = '';
  if (ageSelect) ageSelect.value = '';
  if (brandSelect) brandSelect.value = '';
  
  // Restaurar todos os dados
  filteredSurveys = [...allSurveys];
  currentPage = 1;
  renderDashboard();
}

function exportToCSV() {
  if (filteredSurveys.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }
  
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Cabeçalho
  csvContent += "Data,Município,Faixa Etária,Preço,Ocasiões,Zero Álcool,Frequência,Cerveja Favorita,Score\n";
  
  // Dados
  filteredSurveys.forEach(s => {
    const data = s.data instanceof Date ? s.data.toLocaleDateString('pt-BR') : '';
    const municipio = escapeCSV(s.respostas.pergunta1 || '');
    const idade = escapeCSV(s.respostas.pergunta2 || '');
    const preco = escapeCSV(s.respostas.pergunta3 || '');
    const ocasioes = escapeCSV(s.respostas.pergunta4 || '');
    const zeroAlcool = escapeCSV(s.respostas.pergunta5 || '');
    const frequencia = escapeCSV(s.respostas.pergunta6 || '');
    
    const topBeer = getTopBeer(s.scores);
    const cerveja = escapeCSV(topBeer ? (friendlyNames[topBeer] || topBeer) : '');
    const score = topBeer && s.scores[topBeer] ? parseFloat(s.scores[topBeer]).toFixed(0) : '';
    
    csvContent += `${data},${municipio},${idade},${preco},${ocasioes},${zeroAlcool},${frequencia},${cerveja},${score}\n`;
  });
  
  // Criar link de download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "pesquisa_cervejas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function renderDashboard() {
  atualizarKPIs(filteredSurveys);
  renderStats();
  renderBeerRankings();
  renderResultsTable();
  renderBrandChart();
  renderBrandComparison();
  renderQuestionCharts();
  renderCorrelationChart();
}

function showLoading(show) {
  document.body.style.cursor = show ? 'wait' : 'default';
  document.querySelectorAll('button').forEach(btn => {
    if (btn && !btn.classList.contains('toggle-button')) {
      btn.disabled = show;
    }
  });
}

function escapeCSV(text) {
  if (typeof text !== 'string') return '';
  text = text.replace(/"/g, '""');
  if (text.includes(',') || text.includes('\n') || text.includes('"')) {
    text = `"${text}"`;
  }
  return text;
}

function getUniqueValues(question) {
  const values = new Set();
  allSurveys.forEach(survey => {
    if (survey.respostas && survey.respostas[question]) {
      values.add(survey.respostas[question]);
    }
  });
  return Array.from(values).sort();
}

function renderStats() {
  const totalSurveys = filteredSurveys.length;
  const uniqueUsers = new Set();

  filteredSurveys.forEach(survey => {
    const key = `${survey.respostas.pergunta1 || ''}-${survey.respostas.pergunta2 || ''}`;
    uniqueUsers.add(key);
  });

  if (document.getElementById('total-surveys')) {
    document.getElementById('total-surveys').textContent = totalSurveys;
  }
  if (document.getElementById('unique-users')) {
    document.getElementById('unique-users').textContent = uniqueUsers.size;
  }
}

function renderBeerRankings() {
  const container = document.getElementById('beer-rankings');
  if (!container) return;
  
  const scores = {};
  filteredSurveys.forEach(s => {
    for (let k in s.scores) {
      const score = parseFloat(s.scores[k]);
      if (!isNaN(score)) {
        scores[k] = (scores[k] || 0) + score;
      }
    }
  });

  const sorted = Object.entries(scores)
    .filter(([b]) => b && b !== 'undefined' && b !== 'null')
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="no-data">Nenhum dado de ranking disponível.</p>';
    return;
  }

  container.innerHTML = sorted.map(([beer, score], i) => `
    <div class="ranking-item">
      <div class="ranking-position">${i + 1}</div>
      <div class="ranking-details">
        <div class="ranking-name">${friendlyNames[beer] || beer}</div>
        <div class="ranking-bar-container">
          <div class="ranking-bar" style="width: ${(score / sorted[0][1]) * 100}%"></div>
          <span class="ranking-score">${Math.round(score)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderResultsTable() {
  const tbody = document.getElementById('results-tbody');
  const pageInfo = document.getElementById('page-info');
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  if (!tbody) return;

  tbody.innerHTML = '';
  if (!filteredSurveys.length) {
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

    const dateCell = document.createElement('td');
    dateCell.textContent = s.data instanceof Date ? s.data.toLocaleDateString('pt-BR') : 'N/D';
    row.appendChild(dateCell);

    for (let j = 1; j <= 6; j++) {
      const cell = document.createElement('td');
      cell.textContent = (s.respostas[`pergunta${j}`] || '').split(',').map(v => v.trim()).join(', ');
      row.appendChild(cell);
    }

    const top = getTopBeer(s.scores);
    const beerCell = document.createElement('td');
    beerCell.textContent = top ? (friendlyNames[top] || top) : '-';
    row.appendChild(beerCell);

    const scoreCell = document.createElement('td');
    const score = top && s.scores[top] !== undefined ? s.scores[top] : 0;
    scoreCell.textContent = !isNaN(parseFloat(score)) ? parseFloat(score).toFixed(0) : '-';
    row.appendChild(scoreCell);

    tbody.appendChild(row);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar o date range picker se existir
  const dateRangeElement = document.getElementById('date-range');
  if (dateRangeElement && typeof $ !== 'undefined' && typeof $.fn.daterangepicker !== 'undefined') {
    $(dateRangeElement).daterangepicker({
      startDate: moment().subtract(30, 'days'),
      endDate: moment(),
      locale: {
        format: 'DD/MM/YYYY'
      }
    });
  }
  
  // Carregar dados do Firebase
  loadDataFromFirebase();
  
  // Popular opções de filtro
  populateFilterOptions();
  
  // Adicionar event listeners para filtros
  const applyFilterBtn = document.getElementById('apply-filters');
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', applyFilters);
  }
  
  const clearFilterBtn = document.getElementById('clear-filters');
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', clearFilters);
  }
  
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToCSV);
  }
  
  // Adicionar event listeners para paginação
  const prevPageBtn = document.getElementById('prev-page');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderResultsTable();
      }
    });
  }
  
  const nextPageBtn = document.getElementById('next-page');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderResultsTable();
      }
    });
  }
  
  // Adicionar event listeners para as tabs
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      const tabContainer = button.closest('.panel-content');
      
      tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      tabContainer.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      
      button.classList.add('active');
      const tabContent = document.getElementById(`${tabId}-tab`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
      
      // Atualizar gráficos específicos
      if (tabId === 'chart') {
        renderBrandChart();
      } else if (tabId === 'correlations') {
        renderCorrelationChart();
      }
    });
  });
  
  // Eventos para toggling de seções
  document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.closest('.panel-section');
      if (panel) {
        panel.classList.toggle('collapsed');
        const icon = button.querySelector('i');
        if (icon) {
          if (panel.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-down';
          } else {
            icon.className = 'fas fa-chevron-up';
          }
        }
      }
    });
  });
  
  // Eventos para comparação de marcas
  const comparisonBrand1 = document.getElementById('comparison-brand1');
  if (comparisonBrand1) {
    comparisonBrand1.addEventListener('change', renderBrandComparison);
  }
  
  const comparisonBrand2 = document.getElementById('comparison-brand2');
  if (comparisonBrand2) {
    comparisonBrand2.addEventListener('change', renderBrandComparison);
  }
  
  // Eventos para correlações
  const correlationX = document.getElementById('correlation-x');
  if (correlationX) {
    correlationX.addEventListener('change', renderCorrelationChart);
  }
  
  const correlationY = document.getElementById('correlation-y');
  if (correlationY) {
    correlationY.addEventListener('change', renderCorrelationChart);
  }
});

function renderBrandChart() {
  const canvas = document.getElementById('brands-chart');
  if (!canvas) return;

  if (window.brandChart) window.brandChart.destroy();

  const scores = {};
  filteredSurveys.forEach(s => {
    for (let k in s.scores) {
      const score = parseFloat(s.scores[k]);
      if (!isNaN(score)) {
        scores[k] = (scores[k] || 0) + score;
      }
    }
  });

  const sorted = Object.entries(scores)
    .filter(([b]) => b && b !== 'undefined' && b !== 'null')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) return;

  const labels = sorted.map(([b]) => friendlyNames[b] || b);
  const data = sorted.map(([_, v]) => v);

  if (typeof Chart !== 'undefined') {
    window.brandChart = new Chart(canvas, {
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
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

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
    <table class="comparison-table">
      <thead><tr><th>Métrica</th><th>${friendlyNames[brand1]}</th><th>${friendlyNames[brand2]}</th></tr></thead>
      <tbody>
        <tr><td>Pontuação Total</td><td>${Math.round(stats1.totalScore)}</td><td>${Math.round(stats2.totalScore)}</td></tr>
        <tr><td>1ª Opção</td><td>${stats1.firstChoice}</td><td>${stats2.firstChoice}</td></tr>
        <tr><td>Faixa Etária Popular</td><td>${stats1.topAgeGroup}</td><td>${stats2.topAgeGroup}</td></tr>
        <tr><td>Município Popular</td><td>${stats1.topCity}</td><td>${stats2.topCity}</td></tr>
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
      const score = parseFloat(survey.scores[brand]);
      if (!isNaN(score)) totalScore += score;

      const topBeer = getTopBeer(survey.scores);
      if (topBeer === brand) {
        firstChoice++;
        const ageGroup = survey.respostas.pergunta2;
        if (ageGroup) ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
        const city = survey.respostas.pergunta1;
        if (city) cities[city] = (cities[city] || 0) + 1;
      }
    }
  });

  const topAgeGroup = Object.entries(ageGroups).sort((a, b) => b[1] - a[1])[0];
  const topCity = Object.entries(cities).sort((a, b) => b[1] - a[1])[0];

  return {
    totalScore,
    firstChoice,
    topAgeGroup: topAgeGroup ? topAgeGroup[0] : 'N/A',
    topCity: topCity ? topCity[0] : 'N/A'
  };
}

function renderQuestionCharts() {
  const container = document.getElementById('question-charts');
  if (!container) return;

  container.innerHTML = '';

  if (filteredSurveys.length === 0) {
    container.innerHTML = '<p class="no-data">Nenhum dado disponível para análise.</p>';
    return;
  }

  const questions = ['pergunta1', 'pergunta2', 'pergunta3', 'pergunta4', 'pergunta5', 'pergunta6'];
  const dataPerQuestion = {};
  questions.forEach(q => dataPerQuestion[q] = {});

  filteredSurveys.forEach(survey => {
    questions.forEach(q => {
      const answer = survey.respostas[q];
      if (answer) {
        const respostasSeparadas = answer.split(',').map(r => r.trim());
        respostasSeparadas.forEach(resp => {
          if (!dataPerQuestion[q][resp]) dataPerQuestion[q][resp] = 0;
          dataPerQuestion[q][resp]++;
        });
      }
    });
  });

  container.className = 'questions-container';

  if (typeof Chart === 'undefined') return;

  questions.forEach(q => {
    if (Object.keys(dataPerQuestion[q]).length === 0) return;
    const isHorizontal = q === 'pergunta4';
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.style.marginBottom = '2rem';
    if (isHorizontal) {
      chartContainer.style.aspectRatio = '3 / 1';
      chartContainer.style.maxWidth = '700px';
    } else {
      chartContainer.style.aspectRatio = '2 / 1';
    }
    const title = document.createElement('h4');
    title.textContent = questionLabels[q] || q;
    chartContainer.appendChild(title);
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);

    const labels = Object.keys(dataPerQuestion[q]);
    const values = Object.values(dataPerQuestion[q]);

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Respostas',
          data: values,
          backgroundColor: '#2a9d8f'
        }]
      },
      options: {
        indexAxis: isHorizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Distribuição: ${questionLabels[q]}`
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
}


function renderCorrelationChart() {
  const canvas = document.getElementById('correlation-chart');
  if (!canvas) return;
  
  const xElement = document.getElementById('correlation-x');
  const yElement = document.getElementById('correlation-y');
  
  if (!xElement || !yElement) return;
  
  const qX = xElement.value;
  const qY = yElement.value;

  if (!qX || !qY || qX === qY) {
    if (window.correlationChart) window.correlationChart.destroy();
    return;
  }

  const dataMatrix = {};
  filteredSurveys.forEach(s => {
    const x = s.respostas[qX];
    const y = s.respostas[qY];
    if (x && y) {
      const key = `${x}||${y}`;
      dataMatrix[key] = (dataMatrix[key] || 0) + 1;
    }
  });

  if (Object.keys(dataMatrix).length === 0) {
    if (window.correlationChart) window.correlationChart.destroy();
    return;
  }

  const labelsX = Array.from(new Set(Object.keys(dataMatrix).map(k => k.split('||')[0])));
  const labelsY = Array.from(new Set(Object.keys(dataMatrix).map(k => k.split('||')[1])));

  const datasets = labelsY.map((y, i) => {
    const data = labelsX.map(x => dataMatrix[`${x}||${y}`] || 0);
    return {
      label: y,
      data,
      backgroundColor: `hsl(${(i * 45) % 360}, 70%, 60%)`
    };
  });

  if (window.correlationChart) window.correlationChart.destroy();

  if (typeof Chart !== 'undefined') {
    window.correlationChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labelsX,
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${questionLabels[qX]} x ${questionLabels[qY]}`
          }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }
}



// Função de inicialização
function init() {
  try {
    // Verificar se o Firebase está disponível
    if (typeof firebase === 'undefined' && typeof initializeApp === 'undefined') {
      console.error('Firebase não está disponível. Verifique se os scripts foram carregados corretamente.');
      if (document.getElementById('error-message')) {
        document.getElementById('error-message').textContent = 'Erro: Firebase não está disponível.';
      }
      return;
    }
    
    // Carregar dados
    loadDataFromFirebase();
    
    // Configurar eventos e interface
    setupUI();
  } catch (error) {
    console.error('Erro na inicialização:', error);
    if (document.getElementById('error-message')) {
      document.getElementById('error-message').textContent = 'Erro na inicialização: ' + error.message;
    }
  }
}

// Configuração da interface do usuário
function setupUI() {
  // Inicializar o date range picker se existir
  const dateRangeElement = document.getElementById('date-range');
  if (dateRangeElement && typeof $ !== 'undefined' && typeof $.fn.daterangepicker !== 'undefined') {
    $(dateRangeElement).daterangepicker({
      startDate: moment().subtract(30, 'days'),
      endDate: moment(),
      locale: {
        format: 'DD/MM/YYYY'
      }
    });
  }
  
  // Popular opções de filtro
  populateFilterOptions();
  
  // Adicionar event listeners para filtros
  const applyFilterBtn = document.getElementById('apply-filters');
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', applyFilters);
  }
  
  const clearFilterBtn = document.getElementById('clear-filters');
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', clearFilters);
  }
  
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToCSV);
  }
  
  // Adicionar event listeners para paginação
  const prevPageBtn = document.getElementById('prev-page');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderResultsTable();
      }
    });
  }
  
  const nextPageBtn = document.getElementById('next-page');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderResultsTable();
      }
    });
  }
  
  // Adicionar event listeners para as tabs
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      const tabContainer = button.closest('.panel-content');
      
      if (!tabContainer) return;
      
      tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      tabContainer.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      
      button.classList.add('active');
      const tabContent = document.getElementById(`${tabId}-tab`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
      
      // Atualizar gráficos específicos
      if (tabId === 'chart') {
        renderBrandChart();
      } else if (tabId === 'correlations') {
        renderCorrelationChart();
      }
    });
  });
  
  // Eventos para toggling de seções
  document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.closest('.panel-section');
      if (panel) {
        panel.classList.toggle('collapsed');
        const icon = button.querySelector('i');
        if (icon) {
          if (panel.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-down';
          } else {
            icon.className = 'fas fa-chevron-up';
          }
        }
      }
    });
  });
  
  // Eventos para comparação de marcas
  const comparisonBrand1 = document.getElementById('comparison-brand1');
  if (comparisonBrand1) {
    comparisonBrand1.addEventListener('change', renderBrandComparison);
  }
  
  const comparisonBrand2 = document.getElementById('comparison-brand2');
  if (comparisonBrand2) {
    comparisonBrand2.addEventListener('change', renderBrandComparison);
  }
  
  // Eventos para correlações
  const correlationX = document.getElementById('correlation-x');
  if (correlationX) {
    correlationX.addEventListener('change', renderCorrelationChart);
  }
  
  const correlationY = document.getElementById('correlation-y');
  if (correlationY) {
    correlationY.addEventListener('change', renderCorrelationChart);
  }
}