// Referências aos elementos HTML
    const redLamp = document.getElementById('red');
    const yellowLamp = document.getElementById('yellow');
    const greenLamp = document.getElementById('green');
    const contadorElement = document.getElementById('contador');
    const statusElement = document.getElementById('status');
    const welcomeMessageElement = document.getElementById('welcome-message');
    const pedestrianButton = document.getElementById('pedestrian-button'); // NOVA REFERÊNCIA DO BOTÃO

    // Variáveis de controle
    let timeoutId;          // Para o setTimeout que agenda a próxima luz
    let intervaloContagemId; // Para o setInterval do contador regressivo
    let isPedestrianActive = false; // NOVA VARIÁVEL: Para saber se o pedestre está ativo

    // --- Funções Auxiliares ---

    function apagarTodasAsLuzes() {
        redLamp.classList.remove('red-on');
        yellowLamp.classList.remove('yellow-on');
        greenLamp.classList.remove('green-on');
    }

    // MODIFICADA: Agora pode receber um terceiro argumento opcional para "forçar" a próxima função
    function iniciarContador(tempoInicial, proximaFuncao, forcarProxima = false) {
        let tempoRestante = tempoInicial;
        contadorElement.textContent = `Contagem: ${tempoRestante} s`;

        // Limpa qualquer contador regressivo que possa estar rodando
        clearInterval(intervaloContagemId);
        clearTimeout(timeoutId); // Limpa qualquer setTimeout agendado também!

        intervaloContagemId = setInterval(() => {
            tempoRestante--;
            contadorElement.textContent = `Contagem: ${tempoRestante} s`;

            if (tempoRestante <= 0) {
                clearInterval(intervaloContagemId); // Para o contador quando chega a zero
                
                // Se a interrupção do pedestre NÃO estiver ativa, ou se for uma interrupção forçada
                if (!isPedestrianActive || forcarProxima) {
                    proximaFuncao(); 
                }
            }
        }, 1000); // Executa a cada 1000 milissegundos (1 segundo)
    }

    // --- Funções das Luzes (Estados do Semáforo) ---

    function acenderVermelho() {
        apagarTodasAsLuzes();
        redLamp.classList.add('red-on');
        statusElement.textContent = 'Status: Carros Parados';
        console.log("Luz Vermelha acesa.");
        
        // Verifica se o pedestre está ativo para não seguir o ciclo normal imediatamente
        if (!isPedestrianActive) {
            iniciarContador(15, acenderVerde); // Vermelho normal por 15 segundos
        } else {
            // Se o pedestre acabou de atravessar, o vermelho para carros dura menos
            // antes de retornar ao ciclo normal (verde para carros)
            iniciarContador(5, acenderVerde); // Vermelho curto após pedestre
            isPedestrianActive = false; // Desativa o modo pedestre
        }
    }

    function acenderAmarelo() {
        apagarTodasAsLuzes();
        yellowLamp.classList.add('yellow-on');
        statusElement.textContent = 'Status: Atenção!';
        console.log("Luz Amarela acesa.");
        
        iniciarContador(3, acenderVermelho);
    }

    function acenderVerde() {
        apagarTodasAsLuzes();
        greenLamp.classList.add('green-on');
        statusElement.textContent = 'Status: Carros Liberados';
        console.log("Luz Verde acesa.");
        
        iniciarContador(10, acenderAmarelo);
    }

    // --- LÓGICA DO PEDESTRE (NOVA FUNÇÃO) ---
    function acionarPedestre() {
        // Se o semáforo já está vermelho ou amarelo para carros, não precisa mudar
        if (redLamp.classList.contains('red-on')) {
            statusElement.textContent = 'Status: Pedestre pode atravessar! (Carros parados)';
            iniciarContador(8, acenderVerde); // Pedestre atravessa, depois verde para carros
            isPedestrianActive = false; // Resetar isPedestrianActive aqui se a fase de pedestre não muda a cor do semaforo
        } else if (yellowLamp.classList.contains('yellow-on')) {
            // Se já está amarelo, espere acabar e vá para vermelho
            isPedestrianActive = true; // Ativa o modo pedestre
            // A própria função yellow chamará o vermelho, que vai para a lógica do pedestre
            statusElement.textContent = 'Status: Pedestre aguarde um pouco.';

        } else if (greenLamp.classList.contains('green-on')) {
            // Se está verde para carros, primeiro muda para amarelo, depois vermelho para pedestre
            isPedestrianActive = true; // Ativa o modo pedestre
            statusElement.textContent = 'Status: Pedestre solicitou! Atenção!';
            apagarTodasAsLuzes(); // Apaga o verde para carros
            yellowLamp.classList.add('yellow-on'); // Acende o amarelo
            
            // Força a transição para vermelho após 3 segundos
            iniciarContador(3, acenderVermelho, true); // Força para vermelho
        }
    }

    // --- LÓGICA DE INÍCIO DO PROJETO COM BOAS-VINDAS ---
    function iniciarProjeto() {
        let userName = prompt("Por favor, digite seu nome:");

        if (userName) {
            welcomeMessageElement.textContent = `Olá, ${userName}! Bem-vindo ao Semáforo Inteligente.`;
        } else {
            welcomeMessageElement.textContent = `Olá! Bem-vindo(a) ao Semáforo Inteligente.`;
        }

        // Dá um pequeno tempo para a mensagem ser lida e então inicia o semáforo
        setTimeout(() => {
            welcomeMessageElement.style.display = 'none'; // Esconde a mensagem de boas-vindas
            acenderVermelho(); // Inicia o ciclo do semáforo com a luz vermelha
            console.log("Semáforo iniciado automaticamente após a saudação.");
        }, 3000); // Exibe a mensagem por 3 segundos
    }

    // --- Adicionar o Event Listener para o botão do pedestre ---
    pedestrianButton.addEventListener('click', acionarPedestre);

    // Chama a função de início do projeto quando a página carrega
    iniciarProjeto(); 