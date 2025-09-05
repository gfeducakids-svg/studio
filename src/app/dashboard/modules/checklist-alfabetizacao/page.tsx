
'use client';

// This component renders a full, self-contained HTML page with its own styles and scripts.
// It's a special case for a highly interactive module.

const checklistHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checklist de Alfabetização Interativo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

       body {
            font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
            background-color: #F8F9FA;
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }

        .back-button-container {
             max-width: 900px;
             margin: 0 auto;
             padding-bottom: 1rem;
             text-align: left;
        }

        .btn-back {
            background: transparent;
            color: #333;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }

        .btn-back:hover {
            background-color: rgba(0,0,0,0.05);
        }

        .container-inner {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
        }

        .header {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.05) 10px,
                rgba(255,255,255,0.05) 20px
            );
            animation: move 20s linear infinite;
        }

        @keyframes move {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .header h1 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }

        .header .subtitle {
            color: white;
            font-size: 1.2rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .progress-container {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 2px solid #e9ecef;
        }

        .progress-bar {
            background: #e9ecef;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            height: 100%;
            width: 0%;
            border-radius: 10px;
            transition: width 0.5s ease;
            position: relative;
            overflow: hidden;
        }

        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .progress-text {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
            color: #666;
        }

        .content {
            padding: 30px;
        }

        .module {
            margin-bottom: 30px;
            border: 2px solid #f0f0f0;
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
            background: white;
        }

        .module:hover {
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transform: translateY(-5px);
        }

        .module-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .module-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }

        .module-header:hover::before {
            left: 100%;
        }

        .module-header h2 {
            font-size: 1.5rem;
            margin: 0;
            position: relative;
            z-index: 1;
        }

        .module-content {
            padding: 20px;
            background: #f8f9fa;
        }

        .checklist-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        }

        .checklist-item:hover {
            transform: translateX(10px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .checkbox {
            width: 24px;
            height: 24px;
            border: 3px solid #ddd;
            border-radius: 50%;
            margin-right: 15px;
            position: relative;
            transition: all 0.3s ease;
            flex-shrink: 0;
            cursor: pointer;
        }

        .checkbox.checked {
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            border-color: #4ecdc4;
            animation: bounce 0.5s ease;
        }

        .checkbox.checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 14px;
        }

        @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            80% { transform: translateY(-5px); }
        }

        .checklist-text {
            flex: 1;
            line-height: 1.5;
            transition: all 0.3s ease;
        }

        .checklist-item.completed .checklist-text {
            text-decoration: line-through;
            opacity: 0.6;
        }

        .module-progress {
            margin-top: 15px;
            padding: 15px;
            background: white;
            border-radius: 10px;
            text-align: center;
        }

        .module-progress-bar {
            background: #e9ecef;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }

        .module-progress-fill {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            height: 100%;
            width: 0%;
            border-radius: 4px;
            transition: width 0.5s ease;
        }

        .controls {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 5px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .floating-shapes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .shape {
            position: absolute;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            animation: float 20s infinite linear;
        }

        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        .celebration {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }

        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #ff6b6b;
            animation: confetti-fall 3s ease-out forwards;
        }

        @keyframes confetti-fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }

        @media (max-width: 768px) {
            .container-inner {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
            
            .controls {
                bottom: 20px;
                right: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="floating-shapes" id="floatingShapes"></div>
    
    <div class="back-button-container">
        <a href="/dashboard" class="btn-back" title="Voltar">
            <span style="font-size: 20px;">&#8592;</span> Voltar
        </a>
    </div>

    <div class="container-inner">
        <div class="header">
            <div>
                 <h1>Checklist de Alfabetização</h1>
                 <p class="subtitle">Acompanhe o progresso da alfabetização de forma interativa</p>
            </div>
        </div>
        
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" id="overallProgress"></div>
            </div>
            <div class="progress-text" id="progressText">0% Concluído (0 de 48 itens)</div>
        </div>

        <div class="content">
            <!-- Módulo 01 -->
            <div class="module">
                <div class="module-header" onclick="toggleModule(this)">
                    <h2>📚 Módulo 01 – Pré-Alfabetização: Construindo as Bases</h2>
                </div>
                <div class="module-content">
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Reconhece rimas em músicas e parlendas.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Identifica sons iniciais de palavras (ex.: "bola" começa com /b/).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Participa de brincadeiras de aliteração (palavras que começam com o mesmo som).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Faz traçados simples (linhas retas, curvas e zigue-zague).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Recorta e manipula figuras simples.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Coordena som e movimento (palmas, pulos, gestos ao ouvir sons).</div>
                    </div>
                    <div class="module-progress">
                        <div>Progresso do Módulo: <span class="module-progress-text">0%</span></div>
                        <div class="module-progress-bar">
                            <div class="module-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Módulo 02 -->
            <div class="module">
                <div class="module-header" onclick="toggleModule(this)">
                    <h2>🔤 Módulo 02 – Apresentando o Alfabeto: Forma e Som</h2>
                </div>
                <div class="module-content">
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Reconhece letras do alfabeto (forma visual).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Associa letras aos sons correspondentes (fonema + grafema).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Nomeia objetos iniciados por determinada letra.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Identifica letras em diferentes contextos (cartazes, livros, jogos).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Participa de jogos de "Caça às Letras".</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Diferencia sons vocálicos básicos (a, e, i, o, u).</div>
                    </div>
                    <div class="module-progress">
                        <div>Progresso do Módulo: <span class="module-progress-text">0%</span></div>
                        <div class="module-progress-bar">
                            <div class="module-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Módulo 03 -->
            <div class="module">
                <div class="module-header" onclick="toggleModule(this)">
                    <h2>🔀 Módulo 03 – Sílabas Simples (CV): Combinando Sons</h2>
                </div>
                <div class="module-content">
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Forma e reconhece sílabas simples (consoante + vogal).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Lê e escreve sílabas como PA, ME, LU.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Combina sílabas para formar palavras (ex.: PA + TO = PATO).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Usa cartões ou jogos com sílabas para formar palavras.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Participa de jogos como "Bingo de Sílabas".</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Reconhece padrões sonoros e visuais em palavras simples.</div>
                    </div>
                    <div class="module-progress">
                        <div>Progresso do Módulo: <span class="module-progress-text">0%</span></div>
                        <div class="module-progress-bar">
                            <div class="module-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Módulo 04 -->
            <div class="module">
                <div class="module-header" onclick="toggleModule(this)">
                    <h2>🗣️ Módulo 04 – Método Fônico: Pronúncia Correta</h2>
                </div>
                <div class="module-content">
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Reproduz corretamente os sons puros das letras (sem vogais extras).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Distingue sons de vogais (a, e, i, o, u) de consoantes simples (p, t, m, s, f).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Identifica boca/lábios/posição da língua ao emitir sons.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Usa jogos orais (pesca de fonemas, adivinha o som).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Reconhece dígrafos simples (CH, NH, LH).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Consegue juntar fonemas para formar palavras.</div>
                    </div>
                    <div class="module-progress">
                        <div>Progresso do Módulo: <span class="module-progress-text">0%</span></div>
                        <div class="module-progress-bar">
                            <div class="module-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Módulo 05 -->
            <div class="module">
                <div class="module-header" onclick="toggleModule(this)">
                    <h2>📝 Módulo 05 – Formação de Palavras e Frases</h2>
                </div>
                <div class="module-content">
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Lê e escreve palavras CVC (ex.: SOL, PÉ).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Reconhece palavras com sílabas repetidas (Lala, Vivi, Nana).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Forma frases simples com sujeito + verbo (ex.: "Sol vai").</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Diferencia sujeito (quem faz) e verbo (o que faz).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Usa cores ou destaques para identificar partes da frase.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Produz frases curtas de forma independente.</div>
                    </div>
                    <div class="module-progress">
                        <div>Progresso do Módulo: <span class="module-progress-text">0%</span></div>
                        <div class="module-progress-bar">
                            <div class="module-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Módulo 06 -->
            <div class="module">
                <div class="module-header" onclick="toggleModule(this)">
                    <h2>📖 Módulo 06 – Escrita e Compreensão Leitora</h2>
                </div>
                <div class="module-content">
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Cobre letras tracejadas com precisão.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Escreve palavras simples sob ditado (ex.: sol, pato, lua).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Constrói palavras a partir de imagens (ex.: gato → G-A-T-O).</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Lê textos curtos com apoio do educador.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Participa de dramatizações simples para compreender textos.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Faz jogos de memória com palavras e imagens.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Resolve cruzadinhas e caça-palavras simples.</div>
                    </div>
                    <div class="checklist-item" onclick="toggleItem(this)">
                        <div class="checkbox"></div>
                        <div class="checklist-text">Produz frases escritas a partir de desenhos.</div>
                    </div>
                    <div class="module-progress">
                        <div>Progresso do Módulo: <span class="module-progress-text">0%</span></div>
                        <div class="module-progress-bar">
                            <div class="module-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="controls">
        <button class="btn" onclick="resetAll()">🔄 Resetar Tudo</button>
        <button class="btn" onclick="printPDF()">🖨️ Imprimir PDF</button>
    </div>

    <div class="celebration" id="celebration"></div>

    <script>
        let progress = {
            completed: 0,
            total: 48
        };

        // Criar formas flutuantes
        function createFloatingShapes() {
            const shapesContainer = document.getElementById('floatingShapes');
            const shapes = ['🎈', '⭐', '🌟', '✨', '🎨', '📚', '✏️', '🎯'];
            
            setInterval(() => {
                if (Math.random() < 0.3) {
                    const shape = document.createElement('div');
                    shape.className = 'shape';
                    shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                    shape.style.left = Math.random() * 100 + '%';
                    shape.style.fontSize = (Math.random() * 20 + 20) + 'px';
                    shape.style.animationDuration = (Math.random() * 10 + 15) + 's';
                    shapesContainer.appendChild(shape);
                    
                    setTimeout(() => {
                        if (shape.parentNode) {
                            shape.parentNode.removeChild(shape);
                        }
                    }, 25000);
                }
            }, 2000);
        }

        function toggleModule(header) {
            const content = header.nextElementSibling;
            const isVisible = content.style.display !== 'none';
            
            content.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                content.style.animation = 'slideDown 0.3s ease-out';
            }
        }

        function toggleItem(item) {
            const checkbox = item.querySelector('.checkbox');
            const isChecked = checkbox.classList.contains('checked');
            
            if (isChecked) {
                checkbox.classList.remove('checked');
                item.classList.remove('completed');
                progress.completed--;
            } else {
                checkbox.classList.add('checked');
                item.classList.add('completed');
                progress.completed++;
                
                if (progress.completed === progress.total) {
                    celebrate();
                }
            }
            
            updateProgress();
            updateModuleProgress(item);
        }

        function updateProgress() {
            const percentage = Math.round((progress.completed / progress.total) * 100);
            const progressFill = document.getElementById('overallProgress');
            const progressText = document.getElementById('progressText');
            
            progressText.textContent = \`\${percentage}% Concluído (\${progress.completed} de \${progress.total} itens)\`;
        }

        function updateModuleProgress(item) {
            const module = item.closest('.module');
            const items = module.querySelectorAll('.checklist-item');
            const checkedItems = module.querySelectorAll('.checkbox.checked');
            const percentage = Math.round((checkedItems.length / items.length) * 100);
            
            const progressText = module.querySelector('.module-progress-text');
            const progressFill = module.querySelector('.module-progress-fill');
            
            progressText.textContent = percentage + '%';
            progressFill.style.width = percentage + '%';
        }

        function celebrate() {
            const celebration = document.getElementById('celebration');
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
            
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 2 + 's';
                    celebration.appendChild(confetti);
                    
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    }, 3000);
                }, i * 100);
            }
            
            setTimeout(() => {
                alert('🎉 Parabéns! Você completou todos os itens da alfabetização! 🎉');
            }, 1000);
        }

        function resetAll() {
            if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
                const checkboxes = document.querySelectorAll('.checkbox');
                const items = document.querySelectorAll('.checklist-item');
                
                checkboxes.forEach(checkbox => checkbox.classList.remove('checked'));
                items.forEach(item => item.classList.remove('completed'));
                
                progress.completed = 0;
                updateProgress();
                
                // Resetar progresso dos módulos
                const moduleProgressTexts = document.querySelectorAll('.module-progress-text');
                const moduleProgressFills = document.querySelectorAll('.module-progress-fill');
                
                moduleProgressTexts.forEach(text => text.textContent = '0%');
                moduleProgressFills.forEach(fill => fill.style.width = '0%');
            }
        }

        function printPDF() {
            window.print();
        }

        // Salvar progresso no localStorage (se disponível)
        function saveProgress() {
            const checkboxes = document.querySelectorAll('.checkbox.checked');
            const completedItems = [];
            
            checkboxes.forEach((checkbox, index) => {
                const item = checkbox.closest('.checklist-item');
                const text = item.querySelector('.checklist-text').textContent;
                completedItems.push(text);
            });
            
            // Em um ambiente real, isso seria salvo no localStorage
            // localStorage.setItem('alfabetizacao-progress', JSON.stringify(completedItems));
        }

        function loadProgress() {
            // Em um ambiente real, isso carregaria do localStorage
            // const saved = localStorage.getItem('alfabetizacao-progress');
            // if (saved) {
            //     const completedItems = JSON.parse(saved);
            //     // Restaurar itens marcados...
            // }
        }

        // Adicionar animações CSS dinâmicas
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .module-header:hover {
                animation: pulse 0.5s ease-in-out;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                    margin: 0;
                }
                
                .container-inner {
                    box-shadow: none;
                    border-radius: 0;
                    max-width: none;
                    width: 100%;
                }
                
                .controls {
                    display: none;
                }
                
                .floating-shapes {
                    display: none;
                }
                
                .celebration {
                    display: none;
                }
                
                .header {
                    background: #667eea !important;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
                
                .module {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                
                .module-content {
                    display: block !important;
                }
            }
        \`;
        document.head.appendChild(style);

        // Inicializar aplicação
        document.addEventListener('DOMContentLoaded', function() {
            createFloatingShapes();
            loadProgress();
            
            // Adicionar eventos de teclado para acessibilidade
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'r') {
                    e.preventDefault();
                    resetAll();
                }
                if (e.ctrlKey && e.key === 'p') {
                    e.preventDefault();
                    printPDF();
                }
            });
            
            // Tornar itens focáveis para acessibilidade
            const items = document.querySelectorAll('.checklist-item');
            items.forEach((item, index) => {
                item.setAttribute('tabindex', '0');
                item.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(this);
                    }
                });
            });
            
            // Auto-salvar progresso
            setInterval(saveProgress, 30000); // Salva a cada 30 segundos
        });

        // Adicionar tooltips informativos
        function addTooltips() {
            const tooltips = [
                { selector: '.progress-container', text: 'Acompanhe o progresso geral da alfabetização' },
                { selector: '.module-header', text: 'Clique para expandir/recolher o módulo' },
                { selector: '.checkbox', text: 'Clique para marcar como concluído' }
            ];
            
            tooltips.forEach(tooltip => {
                const elements = document.querySelectorAll(tooltip.selector);
                elements.forEach(el => {
                    el.setAttribute('title', tooltip.text);
                });
            });
        }

        // Função para destacar módulos próximos ao completar
        function highlightNearCompletion() {
            const modules = document.querySelectorAll('.module');
            
            modules.forEach(module => {
                const items = module.querySelectorAll('.checklist-item');
                const checkedItems = module.querySelectorAll('.checkbox.checked');
                const percentage = (checkedItems.length / items.length) * 100;
                
                if (percentage >= 80 && percentage < 100) {
                    module.style.borderColor = '#feca57';
                    module.style.borderWidth = '3px';
                } else if (percentage === 100) {
                    module.style.borderColor = '#4ecdc4';
                    module.style.borderWidth = '3px';
                } else {
                    module.style.borderColor = '#f0f0f0';
                    module.style.borderWidth = '2px';
                }
            });
        }

        // Atualizar função toggleItem para incluir destacação
        const originalToggleItem = toggleItem;
        toggleItem = function(item) {
            originalToggleItem(item);
            highlightNearCompletion();
        };

        // Adicionar funcionalidade de busca
        function addSearchFunctionality() {
            const searchContainer = document.createElement('div');
            searchContainer.innerHTML = \`
                <div style="padding: 20px; background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                    <div style="position: relative;">
                        <i class="fas fa-search" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #666; z-index: 10;"></i>
                        <input type="text" id="searchInput" placeholder="Buscar item específico..." 
                               style="width: 100%; padding: 12px 12px 12px 45px; border: 2px solid #ddd; border-radius: 25px; font-size: 16px; outline: none; font-family: 'Poppins', sans-serif;">
                    </div>
                </div>
            \`;
            
            const progressContainer = document.querySelector('.progress-container');
            progressContainer.parentNode.insertBefore(searchContainer, progressContainer.nextSibling);
            
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const items = document.querySelectorAll('.checklist-item');
                
                items.forEach(item => {
                    const text = item.querySelector('.checklist-text').textContent.toLowerCase();
                    const module = item.closest('.module');
                    
                    if (text.includes(searchTerm)) {
                        item.style.display = 'flex';
                        item.style.backgroundColor = searchTerm ? '#fff3cd' : 'white';
                        module.querySelector('.module-content').style.display = 'block';
                    } else {
                        item.style.display = searchTerm ? 'none' : 'flex';
                        item.style.backgroundColor = 'white';
                    }
                });
                
                // Mostrar/ocultar módulos baseado na busca
                if (searchTerm) {
                    const modules = document.querySelectorAll('.module');
                    modules.forEach(module => {
                        const visibleItems = module.querySelectorAll('.checklist-item[style*="flex"]');
                        if (visibleItems.length === 0) {
                            module.style.display = 'none';
                        } else {
                            module.style.display = 'block';
                        }
                    });
                } else {
                    document.querySelectorAll('.module').forEach(module => {
                        module.style.display = 'block';
                    });
                }
            });
        }

        // Chamar funções adicionais após carregamento
        setTimeout(() => {
            addTooltips();
            addSearchFunctionality();
        }, 1000);
    </script>
</body>
</html>
`;

export default function ChecklistPage() {
  return (
    <div className="w-full h-full">
        <iframe 
            srcDoc={checklistHtml}
            style={{ width: '100%', height: '100vh', border: 'none' }}
            title="Checklist de Alfabetização Interativo"
        />
    </div>
  );
}

    

    