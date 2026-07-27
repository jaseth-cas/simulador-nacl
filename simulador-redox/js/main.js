// main.js - Lógica principal de RedoxLab

document.addEventListener('DOMContentLoaded', () => {
    console.log("RedoxLab Inicializado");

    const btnIniciar = document.getElementById('btn-iniciar');
    if (!btnIniciar) return;

    let reaccionIniciada = false;

    // Helper para marcar los pasos
    const setActiveStep = (stepNumber) => {
        // Reset all steps to inactive style
        for (let i = 1; i <= 6; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            if (stepEl) {
                stepEl.className = "px-2 py-1 text-slate-400 rounded-full font-sans font-medium transition-colors duration-500";
            }
        }
        // Set target step to active style
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.className = "px-3 py-1 bg-indigo-600 text-white rounded-full font-sans font-medium transition-colors duration-500";
        }
    };

    // Helper para revelar paneles
    const revealPanel = (panelId) => {
        const placeholder = document.getElementById(`${panelId}-placeholder`);
        const content = document.getElementById(`${panelId}-content`);
        if (placeholder && content) {
            placeholder.style.opacity = '0';
            setTimeout(() => {
                placeholder.style.display = 'none';
                content.style.opacity = '1';
            }, 500); // Esperar que termine la transición de opacidad
        }
    };

    // Función para emitir un pequeño rayo o chispa desde el electrón
    const createSpark = (container, sourceRect, isTrailing) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "40";

        const containerRect = container.getBoundingClientRect();
        const x1 = sourceRect.left - containerRect.left + sourceRect.width / 2;
        const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;
        
        // Si isTrailing es true, la chispa va hacia la izquierda (dejando un rastro)
        const angle = isTrailing ? (Math.PI - 0.5 + Math.random()) : (Math.random() * Math.PI * 2);
        const distance = 15 + Math.random() * 30;
        const x2 = x1 + Math.cos(angle) * distance;
        const y2 = y1 + Math.sin(angle) * distance;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let d = `M ${x1} ${y1} `;
        
        const midX = (x1 + x2)/2 + (Math.random() - 0.5)*20;
        const midY = (y1 + y2)/2 + (Math.random() - 0.5)*20;
        d += `L ${midX} ${midY} L ${x2} ${y2}`;

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#c084fc"); // Morado/Azulado como en la referencia
        path.setAttribute("stroke-width", "2");
        path.style.filter = "drop-shadow(0 0 4px #a855f7)";
        
        svg.appendChild(path);
        container.appendChild(svg);
        return svg;
    };

    // Añadir estilos para que los electrones lleven la electricidad y giren
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes electron-spark {
            0% { box-shadow: 0 0 10px 4px #60a5fa, 0 0 20px 8px #3b82f6; background-color: #ffffff; }
            100% { box-shadow: 0 0 15px 8px #93c5fd, 0 0 30px 12px #2563eb; background-color: #bfdbfe; }
        }
        .electrified {
            animation: electron-spark 0.05s infinite alternate !important;
            z-index: 100 !important;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
        }
        .spin-slow {
            animation: spin 15s linear infinite;
        }
        .spin-slow-reverse {
            animation: spin-reverse 20s linear infinite;
        }
    `;
    document.head.appendChild(style);

    let currentReaction = ''; // Puede ser 'zn-cu' o 'na-cl'

    const btnZn = document.getElementById('btn-react-zn');
    const btnNa = document.getElementById('btn-react-na');

    // Función para crear las capas internas de Bohr que giran
    const createBohrBackground = (innerShells, staticValenceElectrons, color, elColor, elStroke) => {
        let svg = `<svg viewBox="-50 -50 100 100" class="absolute inset-0 w-full h-full pointer-events-none z-0">`;
        const totalShells = innerShells.length;
        
        const step = 22 / Math.max(1, totalShells); 

        innerShells.forEach((count, idx) => {
            const r = 24 + step * idx;
            svg += `<circle r="${r}" fill="none" stroke="${color}" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.6" />`;
            const spinClass = idx % 2 === 0 ? 'spin-slow' : 'spin-slow-reverse';
            svg += `<g class="${spinClass}" style="transform-origin: 0px 0px;">`;
            for(let i=0; i<count; i++) {
                const angle = (Math.PI * 2 / count) * i;
                const cx = r * Math.cos(angle);
                const cy = r * Math.sin(angle);
                svg += `<circle cx="${cx}" cy="${cy}" r="1.5" fill="${elColor}" stroke="${elStroke}" stroke-width="0.5" />`;
            }
            svg += `</g>`;
        });

        // Capa de valencia exterior
        svg += `<circle r="48" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="3 3" opacity="0.4" />`;

        if (staticValenceElectrons && staticValenceElectrons.length > 0) {
            const r = 48; // Radio exterior estático
            staticValenceElectrons.forEach(angleDeg => {
                const angle = angleDeg * Math.PI / 180;
                const cx = r * Math.cos(angle);
                const cy = r * Math.sin(angle);
                svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="${elColor}" stroke="${elStroke}" stroke-width="0.5" />`;
            });
        }
        svg += `</svg>`;
        return svg;
    };

    const injectBohrBg = (containerId, svgHtml) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const oldSvg = container.querySelector('svg');
        if (oldSvg) oldSvg.remove();
        container.insertAdjacentHTML('afterbegin', svgHtml);
    };

    const resetUI = () => {
        reaccionIniciada = false;
        btnIniciar.disabled = false;
        btnIniciar.classList.remove('opacity-50', 'cursor-not-allowed');
        btnIniciar.innerHTML = `
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            INICIAR REACCIÓN
        `;
        
        document.getElementById('electron-1').style.transform = '';
        document.getElementById('electron-1').classList.remove('electrified');
        document.getElementById('electron-2').style.transform = '';
        document.getElementById('electron-2').classList.remove('electrified');
        
        document.getElementById('hole-1').style.opacity = '1';
        document.getElementById('hole-2').style.opacity = '1';

        for(let i=3; i<=7; i++) {
            const placeholder = document.getElementById(`panel${i}-placeholder`);
            const content = document.getElementById(`panel${i}-content`);
            if (placeholder && content) {
                placeholder.style.display = 'flex';
                placeholder.style.opacity = '1';
                content.style.opacity = '0';
            }
        }
        
        setActiveStep(1);
    };

    // Cambiar de reacción
    const setReaction = (reactionId) => {
        if (currentReaction === reactionId && !reaccionIniciada) return;
        
        resetUI();
        currentReaction = reactionId;

        // Estilos de botones
        if (reactionId === 'zn-cu') {
            btnZn.classList.replace('bg-slate-900', 'bg-slate-800');
            btnZn.classList.replace('border-slate-700', 'border-blue-500');
            btnNa.classList.replace('bg-slate-800', 'bg-slate-900');
            btnNa.classList.replace('border-orange-500', 'border-slate-700');
            
            // Textos globales
            document.getElementById('eq-l1-name').innerText = 'Zn';
            document.getElementById('eq-l1-state').innerText = '0';
            document.getElementById('eq-l1-state').className = "text-blue-400 text-[11px] font-bold mb-1 transition-colors duration-1000";
            document.getElementById('eq-l2-name').innerText = 'CuSO₄';
            document.getElementById('eq-l2-state').innerText = '+2';
            document.getElementById('eq-l2-state').className = "text-blue-400 text-[11px] font-bold mb-1 transition-colors duration-1000";
            document.getElementById('eq-r1-name').innerText = 'ZnSO₄';
            document.getElementById('eq-r1-state').innerText = '+2';
            document.getElementById('eq-r1-state').className = "text-slate-600 text-[11px] font-bold mb-1 transition-colors duration-1000";
            document.getElementById('eq-r2-name').innerText = 'Cu';
            document.getElementById('eq-r2-state').innerText = '0';
            document.getElementById('eq-r2-state').className = "text-slate-600 text-[11px] font-bold mb-1 transition-colors duration-1000";
            
            document.getElementById('eq-plus-right').style.display = 'inline';
            document.getElementById('right-side-eq').className = 'flex items-end gap-2 md:gap-6';
            
            // Átomo 1 (Zn)
            document.getElementById('lbl-1-title').innerText = 'Átomo de Zinc';
            document.getElementById('core-1').innerText = 'Zn';
            document.getElementById('core-1').className = "w-10 h-10 rounded-full bg-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-300 shadow-inner transition-colors duration-1000 z-10";
            document.getElementById('atom-1').className = "w-[100px] h-[100px] rounded-full border border-slate-600 border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000";
            
            // Fondo Bohr Zn (2, 8, 18)
            const bgZn = createBohrBackground([2, 8, 18], [], '#475569', '#94a3b8', '#475569');
            
            // Átomo 2 (Cu)
            document.getElementById('lbl-2-title').innerText = 'Ion de Cobre';
            document.getElementById('core-2').innerText = 'Cu';
            document.getElementById('core-2').className = "w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-200 shadow-inner transition-colors duration-1000 z-10";
            document.getElementById('atom-2').className = "w-[100px] h-[100px] rounded-full border border-slate-600 border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000";
            
            // Fondo Bohr Cu2+ (2, 8, 17)
            const bgCu = createBohrBackground([2, 8, 17], [], '#3b82f6', '#60a5fa', '#2563eb');

            // Inyectar SVGs en el panel central
            injectBohrBg('atom-1', bgZn);
            injectBohrBg('atom-2', bgCu);
            
            // Inyectar SVGs en el Panel 6 (tamaño ajustado automáticamente por viewBox)
            injectBohrBg('p6-l-atom-before', bgZn);
            injectBohrBg('p6-r-atom-before', bgCu);
            injectBohrBg('p6-l-atom-after', bgZn);
            injectBohrBg('p6-r-atom-after', bgCu);
            
            // 2 electrones visibles
            document.getElementById('electron-2').style.display = 'block';
            document.getElementById('hole-2').style.display = 'block';
            
            // Textos del panel 3, 4, 5, 6, 7
            document.getElementById('p3-l-title').innerText = 'ZINC';
            document.getElementById('p3-r-title').innerText = 'COBRE';
            document.getElementById('p3-l-start').innerText = '0';
            document.getElementById('p3-l-end').innerText = '+2';
            document.getElementById('p3-l-desc').innerText = 'Pierde 2 electrones';
            document.getElementById('p3-r-start').innerText = '+2';
            document.getElementById('p3-r-end').innerText = '0';
            document.getElementById('p3-r-desc').innerText = 'Gana 2 electrones';
            
            document.getElementById('p4-ox').innerHTML = 'Zn → <span class="text-red-400 font-bold">Zn²⁺ + 2e⁻</span>';
            document.getElementById('p4-ox-mul').classList.add('hidden');
            document.getElementById('p4-red').innerHTML = '<span class="text-green-400 font-bold">Cu²⁺ + 2e⁻</span> → Cu';
            document.getElementById('p4-red-mul').classList.add('hidden');
            
            document.getElementById('p5-ox').innerHTML = '<span class="font-bold text-blue-400">CuSO₄</span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>';
            document.getElementById('p5-red').innerHTML = '<span class="font-bold text-slate-300">Zn</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>';
            
            document.getElementById('p6-desc-l-before').innerText = 'Zn tiene 2 electrones de valencia';
            document.getElementById('p6-desc-r-before').innerText = 'Cu²⁺ le faltan 2 electrones';
            document.getElementById('p6-desc-l-after').innerText = 'Zn²⁺ perdió 2 electrones';
            document.getElementById('p6-desc-r-after').innerText = 'Cu ganó 2 electrones';
            
            // Colores panel 6 (Zn/Cu)
            document.getElementById('p6-l-title-before').innerText = 'Átomo de Zinc';
            document.getElementById('p6-l-core-before').innerText = 'Zn';
            document.getElementById('p6-l-core-before').className = 'w-6 h-6 rounded-full bg-slate-600 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            document.getElementById('p6-r-title-before').innerText = 'Ion de Cobre';
            document.getElementById('p6-r-core-before').innerText = 'Cu';
            document.getElementById('p6-r-core-before').className = 'w-6 h-6 rounded-full bg-blue-600 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            
            document.getElementById('p6-l-e1').style.display = 'block';
            document.getElementById('p6-l-e2').style.display = 'block';
            document.getElementById('p6-l-e3').style.display = 'none';
            document.getElementById('p6-l-e4').style.display = 'none';

            document.getElementById('p6-l-title-after').innerText = 'Ion de Zinc';
            document.getElementById('p6-l-core-after').innerText = 'Zn';
            document.getElementById('p6-l-core-after').className = 'w-6 h-6 rounded-full bg-red-600 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            document.getElementById('p6-r-title-after').innerText = 'Átomo de Cobre';
            document.getElementById('p6-r-core-after').innerText = 'Cu';
            document.getElementById('p6-r-core-after').className = 'w-6 h-6 rounded-full bg-orange-500 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            
            document.getElementById('p6-r-e1').style.display = 'block';
            document.getElementById('p6-r-e2').style.display = 'block';
            document.getElementById('p6-r-e3').style.display = 'none';
            document.getElementById('p6-r-e4').style.display = 'none';
            
            document.getElementById('p7-desc').style.display = 'none';
            document.getElementById('p7-lost').innerHTML = '2 e⁻';
            document.getElementById('p7-gained').innerHTML = '2 e⁻';
            
        } else if (reactionId === 'na-cl') {
            btnNa.classList.replace('bg-slate-900', 'bg-slate-800');
            btnNa.classList.replace('border-slate-700', 'border-green-500');
            btnZn.classList.replace('bg-slate-800', 'bg-slate-900');
            btnZn.classList.replace('border-blue-500', 'border-slate-700');
            
            // Textos globales
            document.getElementById('eq-l1-name').innerText = '2Na';
            document.getElementById('eq-l1-state').innerText = '0';
            document.getElementById('eq-l1-state').className = "text-green-400 text-[11px] font-bold mb-1 transition-colors duration-1000";
            document.getElementById('eq-l2-name').innerText = 'Cl₂';
            document.getElementById('eq-l2-state').innerText = '0';
            document.getElementById('eq-l2-state').className = "text-red-400 text-[11px] font-bold mb-1 transition-colors duration-1000";
            document.getElementById('eq-r1-name').innerText = '2Na';
            document.getElementById('eq-r1-state').innerText = '+1';
            document.getElementById('eq-r1-state').className = "text-green-500 text-[11px] font-bold mb-1 transition-colors duration-1000";
            document.getElementById('eq-r2-name').innerText = 'Cl';
            document.getElementById('eq-r2-state').innerText = '-1';
            document.getElementById('eq-r2-state').className = "text-red-500 text-[11px] font-bold mb-1 transition-colors duration-1000";
            
            document.getElementById('eq-plus-right').style.display = 'none';
            document.getElementById('right-side-eq').className = 'flex items-end gap-0';
            
            // Átomo 1 (Na)
            document.getElementById('lbl-1-title').innerText = 'Átomo de Sodio';
            document.getElementById('core-1').innerText = 'Na';
            document.getElementById('core-1').className = "w-10 h-10 rounded-full bg-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-300 shadow-inner transition-colors duration-1000 z-10";
            document.getElementById('atom-1').className = "w-[100px] h-[100px] rounded-full border border-slate-600 border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000";
            
            // Fondo Bohr Na (2, 8)
            const bgNa = createBohrBackground([2, 8], [], '#22c55e', '#4ade80', '#16a34a');
            
            // Átomo 2 (Cl)
            document.getElementById('lbl-2-title').innerText = 'Átomo de Cloro';
            document.getElementById('core-2').innerText = 'Cl';
            document.getElementById('core-2').className = "w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center text-xs font-bold text-red-200 shadow-inner transition-colors duration-1000 z-10";
            document.getElementById('atom-2').className = "w-[100px] h-[100px] rounded-full border border-slate-600 border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000";
            
            // Fondo Bohr Cl (2, 8) y 7 electrones de valencia fijos en [-45, 0, 45, 90, 135, 180, 225] (dejando -90 libre)
            const bgCl = createBohrBackground([2, 8], [-45, 0, 45, 90, 135, 180, 225], '#ef4444', '#f87171', '#dc2626');

            // Inyectar SVGs en el panel central
            injectBohrBg('atom-1', bgNa);
            injectBohrBg('atom-2', bgCl);
            
            // Inyectar SVGs en el Panel 6
            injectBohrBg('p6-l-atom-before', bgNa);
            injectBohrBg('p6-r-atom-before', bgCl);
            injectBohrBg('p6-l-atom-after', bgNa);
            injectBohrBg('p6-r-atom-after', bgCl);
            
            // Solo 1 electrón visible
            document.getElementById('electron-2').style.display = 'none';
            document.getElementById('hole-2').style.display = 'none';
            
            // Textos del panel 3, 4, 5, 6, 7
            document.getElementById('p3-l-title').innerText = 'SODIO';
            document.getElementById('p3-r-title').innerText = 'CLORO';
            document.getElementById('p3-l-start').innerText = '0';
            document.getElementById('p3-l-end').className = 'text-green-400';
            document.getElementById('p3-l-end').innerText = '+1';
            document.getElementById('p3-l-desc').innerText = 'Pierde 1 electrón';
            document.getElementById('p3-l-type').className = 'text-xs text-green-400 font-semibold mt-1';
            document.getElementById('p3-r-start').className = 'text-slate-300';
            document.getElementById('p3-r-start').innerText = '0';
            document.getElementById('p3-r-end').className = 'text-red-400';
            document.getElementById('p3-r-end').innerText = '-1';
            document.getElementById('p3-r-desc').innerText = 'Gana 1 electrón';
            document.getElementById('p3-r-type').className = 'text-xs text-red-400 font-semibold mt-1';
            
            document.getElementById('p4-ox').innerHTML = 'Na → <span class="text-green-400 font-bold">Na⁺ + 1e⁻</span>';
            document.getElementById('p4-ox-mul').innerHTML = '(Balance: 2Na → <span class="text-green-400 font-bold">2Na⁺ + 2e⁻</span>)';
            document.getElementById('p4-ox-mul').classList.remove('hidden');
            
            document.getElementById('p4-red').innerHTML = '<span class="text-red-400 font-bold">Cl₂ + 2e⁻</span> → 2Cl⁻';
            document.getElementById('p4-red-mul').classList.add('hidden');
            
            document.getElementById('p5-ox').innerHTML = '<span class="font-bold text-red-400">Cl<sub class="text-[8px]">2</sub></span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>';
            document.getElementById('p5-red').innerHTML = '<span class="font-bold text-green-400">Na</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>';
            
            document.getElementById('p6-desc-l-before').innerText = 'Na tiene 1 e⁻ de valencia';
            document.getElementById('p6-desc-l-before').className = 'text-green-400';
            document.getElementById('p6-desc-r-before').innerText = 'Cl le falta 1 e⁻ para el octeto';
            document.getElementById('p6-desc-r-before').className = 'text-red-400 mt-1';
            document.getElementById('p6-desc-l-after').innerText = 'Na⁺ perdió 1 electrón';
            document.getElementById('p6-desc-l-after').className = 'text-green-500';
            document.getElementById('p6-desc-r-after').innerText = 'Cl⁻ ganó 1 electrón';
            document.getElementById('p6-desc-r-after').className = 'text-red-500 mt-1';
            
            // Colores panel 6 (Na/Cl)
            document.getElementById('p6-l-title-before').innerText = 'Átomo de Sodio';
            document.getElementById('p6-l-core-before').innerText = 'Na';
            document.getElementById('p6-l-core-before').className = 'w-6 h-6 rounded-full bg-slate-600 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            document.getElementById('p6-r-title-before').innerText = 'Átomo de Cloro';
            document.getElementById('p6-r-core-before').innerText = 'Cl';
            document.getElementById('p6-r-core-before').className = 'w-6 h-6 rounded-full bg-red-600 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            
            document.getElementById('p6-l-e1').style.display = 'block';
            document.getElementById('p6-l-e2').style.display = 'none';
            document.getElementById('p6-l-e3').style.display = 'none';
            document.getElementById('p6-l-e4').style.display = 'none';

            document.getElementById('p6-l-title-after').innerText = 'Ion de Sodio';
            document.getElementById('p6-l-core-after').innerText = 'Na';
            document.getElementById('p6-l-core-after').className = 'w-6 h-6 rounded-full bg-green-500 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            document.getElementById('p6-r-title-after').innerText = 'Ion de Cloro';
            document.getElementById('p6-r-core-after').innerText = 'Cl';
            document.getElementById('p6-r-core-after').className = 'w-6 h-6 rounded-full bg-red-500 shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white';
            
            document.getElementById('p6-r-e1').style.display = 'block';
            document.getElementById('p6-r-e2').style.display = 'none';
            document.getElementById('p6-r-e3').style.display = 'none';
            document.getElementById('p6-r-e4').style.display = 'none';
            
            document.getElementById('p7-desc').style.display = 'block';
            document.getElementById('p7-lost').innerHTML = '2 &times; 1e⁻ = 2e⁻';
            document.getElementById('p7-lost').className = 'text-green-500 font-bold text-sm md:text-base';
            document.getElementById('p7-gained').innerHTML = '1 &times; 2e⁻ = 2e⁻';
            document.getElementById('p7-gained').className = 'text-red-500 font-bold text-sm md:text-base';
        }
    };

    btnZn.addEventListener('click', () => setReaction('zn-cu'));
    btnNa.addEventListener('click', () => setReaction('na-cl'));

    // Configuración inicial
    setReaction('zn-cu');

    btnIniciar.addEventListener('click', () => {
        if (reaccionIniciada) return;
        reaccionIniciada = true;

        // 1. Deshabilitar botón
        btnIniciar.disabled = true;
        btnIniciar.classList.add('opacity-50', 'cursor-not-allowed');
        btnIniciar.innerHTML = "REACCIÓN EN PROCESO...";

        // 2. Iniciar Transferencia de Electrones (Paso 2)
        setActiveStep(2);

        const e1 = document.getElementById('electron-1');
        const e2 = document.getElementById('electron-2');
        const hole1 = document.getElementById('hole-1');
        const hole2 = document.getElementById('hole-2');
        const container = document.getElementById('anim-container');
        
        // FASE 1: Iniciar viaje
        e1.classList.add('electrified');
        if(currentReaction === 'zn-cu') e2.classList.add('electrified');

        let sparkInterval = setInterval(() => {
            const rectE1 = e1.getBoundingClientRect();
            for(let i=0; i<2; i++) {
                const s1 = createSpark(container, rectE1, true);
                setTimeout(() => { if(s1 && s1.parentNode) s1.remove(); }, 100);
            }
            
            if (currentReaction === 'zn-cu') {
                const rectE2 = e2.getBoundingClientRect();
                for(let i=0; i<2; i++) {
                    const s2 = createSpark(container, rectE2, true);
                    setTimeout(() => { if(s2 && s2.parentNode) s2.remove(); }, 100);
                }
            }
        }, 50);

        const rectE1 = e1.getBoundingClientRect();
        const rectH1 = hole1.getBoundingClientRect();
        e1.style.transform = `translate(calc(-50% + ${rectH1.left - rectE1.left}px), calc(-50% + ${rectH1.top - rectE1.top}px))`;

        if (currentReaction === 'zn-cu') {
            const rectE2 = e2.getBoundingClientRect();
            const rectH2 = hole2.getBoundingClientRect();
            e2.style.transform = `translate(calc(-50% + ${rectH2.left - rectE2.left}px), calc(50% + ${rectH2.top - rectE2.top}px))`;
        }

        // FASE 2: Finalizar
        setTimeout(() => {
            clearInterval(sparkInterval);
            
            if (currentReaction === 'zn-cu') {
                document.getElementById('core-1').classList.replace('bg-slate-700/80', 'bg-red-600');
                document.getElementById('core-1').innerText = 'Zn²⁺';
                document.getElementById('atom-1').classList.replace('border-slate-600', 'border-red-500/50');
                document.getElementById('lbl-1-title').innerText = 'Ion de Zinc';
                
                document.getElementById('lbl-1-state').innerText = '+2';
                document.getElementById('lbl-1-state').classList.replace('text-blue-400', 'text-red-400');
                document.getElementById('eq-l1-state').classList.replace('text-blue-400', 'text-red-400');
                
                document.getElementById('eq-r1-state').innerText = '+2';
                document.getElementById('eq-r1-state').classList.replace('text-slate-600', 'text-red-400');
                document.getElementById('eq-r1-name').classList.replace('text-slate-500', 'text-slate-200');
                
                document.getElementById('core-2').classList.replace('bg-blue-600/30', 'bg-orange-500');
                document.getElementById('core-2').innerText = 'Cu';
                document.getElementById('atom-2').classList.replace('border-slate-600', 'border-orange-500/50');
                document.getElementById('lbl-2-title').innerText = 'Átomo de Cobre';
                document.getElementById('lbl-2-state').innerText = '0';
                document.getElementById('lbl-2-state').classList.replace('text-blue-400', 'text-slate-300');
                document.getElementById('eq-l2-state').classList.replace('text-blue-400', 'text-slate-300');
                
                document.getElementById('eq-r2-state').innerText = '0';
                document.getElementById('eq-r2-state').classList.replace('text-slate-600', 'text-slate-300');
                document.getElementById('eq-r2-name').classList.replace('text-slate-500', 'text-slate-200');
            } else {
                // Na-Cl update
                document.getElementById('core-1').classList.replace('bg-slate-700/80', 'bg-green-500');
                document.getElementById('core-1').innerText = 'Na⁺';
                document.getElementById('atom-1').classList.replace('border-slate-600', 'border-green-500/50');
                document.getElementById('lbl-1-title').innerText = 'Ion de Sodio';
                
                document.getElementById('lbl-1-state').innerText = '+1';
                document.getElementById('lbl-1-state').classList.replace('text-blue-400', 'text-green-400');
                document.getElementById('eq-l1-state').classList.replace('text-blue-400', 'text-green-400');
                
                document.getElementById('eq-r1-state').innerText = '+1';
                document.getElementById('eq-r1-state').classList.replace('text-slate-600', 'text-green-400');
                document.getElementById('eq-r1-name').classList.replace('text-slate-500', 'text-slate-200');
                
                document.getElementById('core-2').classList.replace('bg-red-600/30', 'bg-red-500');
                document.getElementById('core-2').innerText = 'Cl⁻';
                document.getElementById('atom-2').classList.replace('border-slate-600', 'border-red-500/50');
                document.getElementById('lbl-2-title').innerText = 'Ion de Cloro';
                document.getElementById('lbl-2-state').innerText = '-1';
                document.getElementById('lbl-2-state').classList.replace('text-blue-400', 'text-red-400');
                document.getElementById('eq-l2-state').classList.replace('text-blue-400', 'text-red-400');
                
                document.getElementById('eq-r2-state').innerText = '-1';
                document.getElementById('eq-r2-state').classList.replace('text-slate-600', 'text-red-400');
                document.getElementById('eq-r2-name').classList.replace('text-slate-500', 'text-slate-200');
            }

            e1.classList.remove('electrified');
            e2.classList.remove('electrified');
            hole1.style.opacity = '0';
            hole2.style.opacity = '0';

            // 3. Revelar Panel 3 (Paso 3)
            setTimeout(() => {
                setActiveStep(3);
                revealPanel('panel3');

                setTimeout(() => {
                    setActiveStep(4);
                    revealPanel('panel4');

                    setTimeout(() => {
                        setActiveStep(5);
                        revealPanel('panel5');

                        setTimeout(() => {
                            setActiveStep(6);
                            revealPanel('panel6');
                            revealPanel('panel7');

                            btnIniciar.innerHTML = "REACCIÓN COMPLETADA";
                        }, 1200);
                    }, 1200);
                }, 1200);
            }, 1000);
        }, 1000);
    });
});
