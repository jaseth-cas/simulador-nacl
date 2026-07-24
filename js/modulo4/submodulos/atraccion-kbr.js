/**
 * Submódulo 3: Atracción y Repulsión Electrostática en KBr (+1 y -1)
 */
window.AtraccionKbr = (function() {
    let selectedCase = 'attract';

    function render(appInstance) {
        selectedCase = 'attract';
        updateButtons();
        buildForcesDOM();
        
        // Actualizar textos de los botones del DOM para KBr
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');
        if (b1) b1.innerText = "K⁺ y Br⁻";
        if (b2) b2.innerText = "K⁺ y K⁺";
        if (b3) b3.innerText = "Br⁻ y Br⁻";
    }

    function setupControls(appInstance) {
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');

        if (b1) {
            b1.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 4) return;
                selectedCase = 'attract';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b2) {
            b2.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 4) return;
                selectedCase = 'repel-k';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b3) {
            b3.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 4) return;
                selectedCase = 'repel-br';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
    }

    function updateButtons() {
        const actClass = ['bg-yellow-500/20', 'text-yellow-300']; 
        const inactClass = ['text-slate-400'];
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na'); 
        const b3 = document.getElementById('btn-case-repel-cl'); 
        
        const allClassesToRemove = ['bg-primary/20', 'text-blue-300', 'bg-orange-500/20', 'text-orange-300', 'bg-purple-500/20', 'text-purple-300', 'bg-yellow-500/20', 'text-yellow-300', 'text-slate-400'];
        
        [b1, b2, b3].forEach(b => {
            if (b) {
                b.classList.remove(...allClassesToRemove);
                b.classList.add(...inactClass);
            }
        });
        if (selectedCase === 'attract' && b1) {
            b1.classList.add(...actClass);
            b1.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-k' && b2) {
            b2.classList.add(...actClass);
            b2.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-br' && b3) {
            b3.classList.add(...actClass);
            b3.classList.remove(...inactClass);
        }
    }

    function getIonHTML(type) {
        if (type === 'K') {
            return `<div class="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-800 flex items-center justify-center shadow-lg border-2 border-yellow-300 text-white font-bold text-2xl relative z-10">K⁺</div>`;
        } else {
            return `<div class="w-40 h-40 rounded-full bg-gradient-to-br from-stone-400 to-stone-700 flex items-center justify-center shadow-lg border-2 border-stone-300 text-white font-bold text-2xl relative z-10">Br⁻</div>`;
        }
    }

    function buildForcesDOM() {
        const container = document.getElementById('forces-container');
        if (!container) return;

        let leftType, rightType;
        if (selectedCase === 'attract') { leftType = 'K'; rightType = 'Br'; }
        else if (selectedCase === 'repel-k') { leftType = 'K'; rightType = 'K'; }
        else { leftType = 'Br'; rightType = 'Br'; }
        
        const isAttract = selectedCase === 'attract';
        
        // Flechas más delgadas (fuerza menor por distancia)
        const leftArrowHTML = isAttract 
            ? `<div id="mod4-arrow-left" class="absolute right-[-50px] opacity-0 transition-opacity duration-300">
                    <svg width="40" height="16"><line x1="0" y1="8" x2="30" y2="8" stroke="white" stroke-width="2"/><polygon points="30,3 40,8 30,13" fill="white"/></svg>
               </div>`
            : `<div id="mod4-arrow-left" class="absolute left-[-50px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="40" height="16"><line x1="0" y1="8" x2="30" y2="8" stroke="white" stroke-width="2"/><polygon points="30,3 40,8 30,13" fill="white"/></svg>
               </div>`;
               
        const rightArrowHTML = isAttract
            ? `<div id="mod4-arrow-right" class="absolute left-[-50px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="40" height="16"><line x1="0" y1="8" x2="30" y2="8" stroke="white" stroke-width="2"/><polygon points="30,3 40,8 30,13" fill="white"/></svg>
               </div>`
            : `<div id="mod4-arrow-right" class="absolute right-[-50px] opacity-0 transition-opacity duration-300">
                    <svg width="40" height="16"><line x1="0" y1="8" x2="30" y2="8" stroke="white" stroke-width="2"/><polygon points="30,3 40,8 30,13" fill="white"/></svg>
               </div>`;
        
        container.innerHTML = `
            <div id="mod4-left" class="absolute left-1/4 -translate-x-1/2 flex items-center justify-center transition-transform duration-1000 ease-in-out">
                ${leftArrowHTML}
                ${getIonHTML(leftType)}
            </div>
            <div id="mod4-right" class="absolute right-1/4 translate-x-1/2 flex items-center justify-center transition-transform duration-1000 ease-in-out">
                ${getIonHTML(rightType)}
                ${rightArrowHTML}
            </div>
        `;
    }

    function play(appInstance) {
        const left = document.getElementById('mod4-left');
        const right = document.getElementById('mod4-right');
        const aLeft = document.getElementById('mod4-arrow-left');
        const aRight = document.getElementById('mod4-arrow-right');
        if (!left || !right) return;

        if (aLeft) aLeft.style.opacity = '1';
        if (aRight) aRight.style.opacity = '1';
        
        // Movimiento más sutil, no se acercan tanto (radios grandes)
        if (selectedCase === 'attract') {
            left.style.transform = 'translateX(calc(-50% + 40px))';
            right.style.transform = 'translateX(calc(50% - 40px))';
        } else {
            left.style.transform = 'translateX(calc(-50% - 40px))';
            right.style.transform = 'translateX(calc(50% + 40px))';
        }
        
        window.currentAnimationTimeout = setTimeout(() => {
            if (appInstance && appInstance.currentSubmodule === 3) {
                appInstance.setPlayState(false);
                if (aLeft) aLeft.style.opacity = '0';
                if (aRight) aRight.style.opacity = '0';
            }
        }, 1500); 
    }

    function reset() {
        const left = document.getElementById('mod4-left');
        const right = document.getElementById('mod4-right');
        const aLeft = document.getElementById('mod4-arrow-left');
        const aRight = document.getElementById('mod4-arrow-right');
        if (left && right) {
            left.style.transform = 'translateX(-50%)';
            right.style.transform = 'translateX(50%)';
            if (aLeft) aLeft.style.opacity = '0';
            if (aRight) aRight.style.opacity = '0';
        }
    }

    return { render, setupControls, play, reset };
})();
