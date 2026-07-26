/**
 * Submódulo 3: Atracción y Repulsión Electrostática en MgO (+2 y -2)
 */
window.AtraccionMgo = (function() {
    let selectedCase = 'attract';

    function render(appInstance) {
        selectedCase = 'attract';
        updateButtons();
        buildForcesDOM();
        
        // Actualizar textos de los botones del DOM para MgO
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');
        if (b1) b1.innerText = "Mg²⁺ y O²⁻";
        if (b2) b2.innerText = "Mg²⁺ y Mg²⁺";
        if (b3) b3.innerText = "O²⁻ y O²⁻";
    }

    function setupControls(appInstance) {
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');

        if (b1) {
            b1.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 2) return;
                selectedCase = 'attract';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b2) {
            b2.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 2) return;
                selectedCase = 'repel-mg';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b3) {
            b3.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 2) return;
                selectedCase = 'repel-o';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
    }

    function updateButtons() {
        const actClass = ['bg-orange-500/20', 'text-orange-300']; // Orange theme
        const inactClass = ['text-slate-400'];
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na'); // reused ID
        const b3 = document.getElementById('btn-case-repel-cl'); // reused ID
        
        // Clean all colors including previous mod1 primary
        const allClassesToRemove = ['bg-primary/20', 'text-blue-300', 'bg-orange-500/20', 'text-orange-300', 'text-slate-400'];
        
        [b1, b2, b3].forEach(b => {
            if (b) {
                b.classList.remove(...allClassesToRemove);
                b.classList.add(...inactClass);
            }
        });
        if (selectedCase === 'attract' && b1) {
            b1.classList.add(...actClass);
            b1.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-mg' && b2) {
            b2.classList.add(...actClass);
            b2.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-o' && b3) {
            b3.classList.add(...actClass);
            b3.classList.remove(...inactClass);
        }
    }

    function getIonHTML(type) {
        if (type === 'Mg') {
            return `<div class="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-800 flex items-center justify-center shadow-lg border-2 border-orange-300 text-white font-bold text-xl relative z-10">Mg²⁺</div>`;
        } else {
            return `<div class="w-28 h-28 rounded-full bg-gradient-to-br from-red-400 to-red-800 flex items-center justify-center shadow-lg border-2 border-red-300 text-white font-bold text-xl relative z-10">O²⁻</div>`;
        }
    }

    function buildForcesDOM() {
        const container = document.getElementById('forces-container');
        if (!container) return;

        let leftType, rightType;
        if (selectedCase === 'attract') { leftType = 'Mg'; rightType = 'O'; }
        else if (selectedCase === 'repel-mg') { leftType = 'Mg'; rightType = 'Mg'; }
        else { leftType = 'O'; rightType = 'O'; }
        
        const isAttract = selectedCase === 'attract';
        
        // Flechas más gruesas (stroke-width 3) para indicar fuerza mayor (q1*q2 = 4 vs 1 en NaCl)
        const leftArrowHTML = isAttract 
            ? `<div id="mod3-arrow-left" class="absolute right-[-12px] opacity-0 transition-opacity duration-300">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="7" y2="10" stroke="white" stroke-width="3"/><polygon points="7,6 12,10 7,14" fill="white"/></svg>
               </div>`
            : `<div id="mod3-arrow-left" class="absolute left-[-12px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="7" y2="10" stroke="white" stroke-width="3"/><polygon points="7,6 12,10 7,14" fill="white"/></svg>
               </div>`;
               
        const rightArrowHTML = isAttract
            ? `<div id="mod3-arrow-right" class="absolute left-[-12px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="7" y2="10" stroke="white" stroke-width="3"/><polygon points="7,6 12,10 7,14" fill="white"/></svg>
               </div>`
            : `<div id="mod3-arrow-right" class="absolute right-[-12px] opacity-0 transition-opacity duration-300">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="7" y2="10" stroke="white" stroke-width="3"/><polygon points="7,6 12,10 7,14" fill="white"/></svg>
               </div>`;
        
        container.innerHTML = `
            <div id="mod3-left" class="absolute left-1/4 -translate-x-1/2 flex items-center justify-center transition-all duration-500 ease-in-out">
                ${leftArrowHTML}
                ${getIonHTML(leftType)}
            </div>
            <div id="mod3-right" class="absolute right-1/4 translate-x-1/2 flex items-center justify-center transition-all duration-500 ease-in-out">
                ${getIonHTML(rightType)}
                ${rightArrowHTML}
            </div>
        `;
    }

    function play(appInstance) {
        const left = document.getElementById('mod3-left');
        const right = document.getElementById('mod3-right');
        const aLeft = document.getElementById('mod3-arrow-left');
        const aRight = document.getElementById('mod3-arrow-right');
        if (!left || !right) return;

        if (aLeft) aLeft.style.opacity = '1';
        if (aRight) aRight.style.opacity = '1';
        
        // Más aceleración y distancia (fuerza 4x)
        if (selectedCase === 'attract') {
            left.style.left = 'calc(50% - 61px)';
            right.style.right = 'calc(50% - 61px)';
        } else {
            left.style.left = '10%';
            right.style.right = '10%';
        }
        
        window.currentAnimationTimeout = setTimeout(() => {
            if (appInstance && appInstance.currentSubmodule === 3) {
                appInstance.setPlayState(false);
                if (aLeft) aLeft.style.opacity = '0';
                if (aRight) aRight.style.opacity = '0';
            }
        }, 1000); // Faster duration than NaCl
    }

    function reset() {
        const left = document.getElementById('mod3-left');
        const right = document.getElementById('mod3-right');
        const aLeft = document.getElementById('mod3-arrow-left');
        const aRight = document.getElementById('mod3-arrow-right');
        if (left && right) {
            left.style.left = '25%';
            right.style.right = '25%';
            left.style.transform = '';
            right.style.transform = '';
            if (aLeft) aLeft.style.opacity = '0';
            if (aRight) aRight.style.opacity = '0';
        }
    }

    return { render, setupControls, play, reset };
})();
