// Função para ler os dados do Firebase
function getData() {
    const reference = firebase.database().ref('responses');  // Caminho para o nó onde os dados estão armazenados
  
    reference.once('value', (snapshot) => {
      const data = snapshot.val();  // Pega os dados no formato de objeto JavaScript
      console.log(data);  // Exibe os dados no console
  
      // Aqui você pode manipular os dados, como exibir na página ou processar conforme necessário
      for (const timestamp in data) {
        console.log(`Data: ${timestamp}`);
        console.log(`Resposta para a pergunta 1: ${data[timestamp].pergunta1}`);
        console.log(`Resposta para a pergunta 2: ${data[timestamp].pergunta2}`);
        // Continue conforme as suas necessidades
      }
    });
  }
  
  // Chama a função para obter os dados
  getData();
  