function applyDateMask(input) {
            input.value = input.value
                .replace(/\D/g, '') 
                .replace(/^(\d{2})(\d)/, '$1/$2') 
                .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3') 
                .replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, '$1/$2/$3'); 
        }

        function openLockPopup() {
            document.getElementById("lockPopup").style.display = "block";
        }
        
        function closeLockPopup() {
            document.getElementById("lockPopup").style.display = "none";
            document.getElementById("lockAnswer").value = "";
        }
        
        function checkLockAnswer() {
            var answer = document.getElementById("lockAnswer").value.toLowerCase();
            if (answer === "30/11/2024") {
                closeLockPopup();
                document.getElementById("messagePopup").style.display = "block";
            } else {
                alert("Você não é ela!🖕🏼🖕🏼");
                window.close();                
                closeLockPopup();
            }
        }

        function closeMessagePopup() {
            document.getElementById("messagePopup").style.display = "none";
        }
        
        function createHearts() {
            const heartContainer = document.querySelector('.hearts');
            setInterval(() => {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.textContent = '❤';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
                heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
                heartContainer.appendChild(heart);
                setTimeout(() => heart.remove(), 5000);
            }, 500);
        }
        createHearts();
      
        let audio = document.getElementById("musica");

        function iniciarAudio() {
            audio.play().catch(error => console.log("Autoplay bloqueado:", error));
            document.removeEventListener("click", iniciarAudio);
            document.removeEventListener("touchstart", iniciarAudio);
        }
    
        document.addEventListener("click", iniciarAudio);
        document.addEventListener("touchstart", iniciarAudio);
    
        function toggleAudio() {
            let audio = document.getElementById("musica");
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }
        function mudarPagina(pagina) {
            document.querySelectorAll('.container').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`pagina${pagina}`).classList.add('active');

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });    
        }

        function mostrarPopup() {
            document.getElementById('popup').style.display = 'block';
            document.getElementById('popup').scrollTop = 0; 
        }

        function fecharPopup() {
            document.getElementById('popup').style.display = 'none';
            document.getElementById('creditos').style.display = 'block';
        }

        function reiniciar() {
            document.getElementById('creditos').style.display = 'none';
            mudarPagina(1);
        }

        async function atualizarTempo() {
            await sincronizarHorario(); // Ajusta a diferença antes de iniciar
        
            const inicio = new Date('2024-11-30T15:05:00-03:00'); // Data fixa do início
        
            setInterval(() => {
                const agora = new Date(new Date().getTime() + diferencaHorario); // Ajusta para horário de Brasília
                const diff = new Date(agora - inicio);
        
                const anos = diff.getUTCFullYear() - 1970;
                const meses = diff.getUTCMonth();
                const dias = diff.getUTCDate() - 1;
                const horas = diff.getUTCHours();
                const minutos = diff.getUTCMinutes();
                const segundos = diff.getUTCSeconds();
        
                document.getElementById('tempoJuntos').textContent = `${anos} anos, ${meses} meses, ${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
            }, 1000);
        }
        
        atualizarTempo();      
        
        async function obterHorarioBrasilia() {
            try {
                const response = await fetch("https://www.timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo");
                const data = await response.json();
                return new Date(`${data.date}T${data.time}-03:00`);
            } catch (error) {
                return new Date(); 
            }
        }

        let diferencaHorario = 0; // Diferença entre o horário local e o de Brasília

        async function sincronizarHorario() {
            try {
                const response = await fetch("https://www.timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo");
                const data = await response.json();
        
                const horarioBrasilia = new Date(
                    data.year, 
                    data.month - 1, // Mês no JavaScript começa do zero
                    data.day, 
                    data.hour, 
                    data.minute, 
                    data.seconds || 0
                );
        
                if (isNaN(horarioBrasilia.getTime())) {
                    throw new Error("Falha ao criar o objeto Date");
                }
        
                // Pegando o horário local para calcular a diferença
                const horarioLocal = new Date();
                diferencaHorario = horarioBrasilia - horarioLocal; // Ajuste do tempo baseado no horário de Brasília
        
            } catch (error) {
                diferencaHorario = 0; // Se a API falhar, usa o relógio do dispositivo sem ajustes
            }
        }
        
        async function verificarAcesso() {
            await sincronizarHorario(); // Ajusta a diferença antes de iniciar
        
            const dataLiberacao = new Date('2025-03-10T00:00:00-03:00'); // Data alvo fixa
            const agora = new Date(new Date().getTime() + diferencaHorario); // Ajusta a diferença no relógio local

            if (agora >= dataLiberacao) {
                document.getElementById('bloqueio').style.display = "none"; // Esconde a tela de bloqueio
                document.getElementById('conteudoSite').style.display = "block"; // Exibe o conteúdo do site
            } else {    
                setInterval(() => {
                    const agora = new Date(new Date().getTime() + diferencaHorario); // Ajusta a diferença no relógio local
                    const diff = dataLiberacao - agora; // Calcula o tempo restante
            
                    if (diff <= 0) {
                        location.reload(); // Atualiza a página quando chegar a data
                        return;
                    }
            
                    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
            
                    document.getElementById('tempoRestante').textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
                }, 1000);
            }
        }
        
        verificarAcesso();


        document.addEventListener("contextmenu", function(event) {
          event.preventDefault();
        });
        
        document.addEventListener("keydown", function(event) {
          if (event.keyCode === 123) {
            event.preventDefault();
          }
        });   
		
function carregarConteudo(pagina, botao) {
    // Remove a classe ativo de todos os botões
    document.querySelectorAll('.submenu-btn').forEach(b => b.classList.remove('ativo'));
    
    // Adiciona classe ativo no botão clicado
    botao.classList.add('ativo');

    // Pega o container do conteúdo
    const container = document.getElementById('conteudo-subpagina');

    // Faz o fetch do HTML da subpágina
    fetch(pagina)
        .then(response => {
            if (!response.ok) throw new Error('Não foi possível carregar a página.');
            return response.text();
        })
        .then(html => {
            container.innerHTML = html; // insere o conteúdo
        })
        .catch(err => {
            container.innerHTML = `<p style="color:red;">Erro ao carregar a página: ${err.message}</p>`;
        });
}

        function mudarTela(tela) {
            document.querySelectorAll('.container').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`tela${tela}`).classList.add('active');

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });    
        }
function irParaPagina(paginaHTML) {
    window.location.href = paginaHTML;
}

	const folderId = "1OXskvDUyReWhND79yc-aRofMiTjnNpii"; // ID da sua pasta
    const apiKey = "AIzaSyD-DfJgb98-zuJFSChdAt0XRW74ERAxfi4"; // precisa gerar no Google Cloud

    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`)
      .then(res => res.json())
      .then(data => {
        const galeria = document.getElementById('galeria');
        data.files.forEach(file => {
          if (file.mimeType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = `https://lh3.googleusercontent.com/d/${file.id}=w1000`;
            img.onclick = () => abrirModal(img.src);
            galeria.appendChild(img);
          }
        });
      });

    function abrirModal(src) {
      document.getElementById('imgModal').src = src;
      document.getElementById('modal').style.display = 'flex';
    }
    function fecharModal() {
      document.getElementById('modal').style.display = 'none';
    }	

document.getElementById('modal-aleatorio')?.addEventListener('click', () => {
  document.getElementById('modal-aleatorio').style.display = 'none';
});

// Só executa se a página tiver o modal específico (ou seja, só nessa tela)
if (document.getElementById('modal-aleatorio')) {
  mostrarExplosaoDeImagens();
}

function mostrarExplosaoDeImagens() {
  fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`)
    .then(res => res.json())
    .then(data => {
      const imagens = data.files.filter(f => f.mimeType.startsWith("image/"));
      if (!imagens.length) return;

      // 🔹 Cria camada escura translúcida por trás das imagens
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(0, 0, 0, 0.6)';
      overlay.style.zIndex = 998;
      overlay.style.opacity = 0;
      overlay.style.transition = 'opacity 0.8s ease';
      document.body.appendChild(overlay);
      setTimeout(() => overlay.style.opacity = 1, 50);

      // 🔹 Escolhe 5 imagens aleatórias
      const selecionadas = imagens.sort(() => Math.random() - 0.5).slice(0, 5);

      selecionadas.forEach(file => {
        const img = document.createElement('img');
        img.src = `https://lh3.googleusercontent.com/d/${file.id}=w1000`;
        img.style.position = 'fixed';

        // 🔹 Tamanho maior e aleatório
        img.style.width = `${200 + Math.random() * 250}px`;

        const imgWidth = parseFloat(img.style.width);
        const imgHeight = imgWidth; // assume imagem quadrada
        const margin = 20;

        const maxLeft = window.innerWidth - imgWidth - margin;
        const maxTop = window.innerHeight - imgHeight - margin;

        const left = Math.random() * maxLeft + margin;
        const top = Math.random() * maxTop + margin;
        const rotate = Math.random() * 360;

        img.style.left = `${left}px`;
        img.style.top = `${top}px`;
        img.style.transform = `rotate(${rotate}deg) scale(1)`;
        img.style.opacity = 0;
        img.style.transition = 'all 1s ease';
        img.style.cursor = 'pointer';
        img.style.zIndex = 999;

        // 🔹 Faz a imagem surgir suavemente
        setTimeout(() => {
          img.style.opacity = 1;
          img.style.transform = `rotate(${rotate}deg) scale(1.1)`;
        }, 100);

        // 🔹 Ao clicar: fade + sumir + remover overlay quando todas forem fechadas
        img.onclick = () => {
          img.style.opacity = 0;
          img.style.transform = `rotate(${rotate}deg) scale(0.7)`;
          setTimeout(() => {
            img.remove();
            // remove overlay se todas as imagens sumirem
            if (document.querySelectorAll('img[data-explosao]').length === 0) {
              overlay.style.opacity = 0;
              setTimeout(() => overlay.remove(), 800);
            }
          }, 1000);
        };

		setInterval(() => {
          img.style.transform = `rotate(${Math.random() * 360}deg) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
        }, 2500 + Math.random() * 2000);

        img.dataset.explosao = 'true';
        document.body.appendChild(img);
      });
    });
}

