/**
 * Submódulo 3: Atracción y Repulsión Electrostática en AlF3 (+3 y -1)
 */
window.AtraccionAlf3 = (function() {
    let selectedCase = 'attract';

    function render(appInstance) {
        selectedCase = 'attract';
        updateButtons();
        buildForcesDOM();
        
        // Actualizar textos de los botones del DOM para AlF3
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');
        if (b1) b1.innerText = "Al³⁺ y F⁻";
        if (b2) b2.innerText = "Al³⁺ y Al³⁺";
        if (b3) b3.innerText = "F⁻ y F⁻";
    }

    function setupControls(appInstance) {
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');

        if (b1) {
            b1.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 3) return;
                selectedCase = 'attract';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b2) {
            b2.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 3) return;
                selectedCase = 'repel-al';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b3) {
            b3.addEventListener('click', () => {
                if(appInstance.app.currentModuleId !== 3) return;
                selectedCase = 'repel-f';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
    }

    function updateButtons() {
        const actClass = ['bg-purple-500/20', 'text-purple-300']; // Purple theme
        const inactClass = ['text-slate-400'];
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na'); 
        const b3 = document.getElementById('btn-case-repel-cl'); 
        
        const allClassesToRemove = ['bg-primary/20', 'text-blue-300', 'bg-orange-500/20', 'text-orange-300', 'bg-purple-500/20', 'text-purple-300', 'text-slate-400'];
        
        [b1, b2, b3].forEach(b => {
            if (b) {
                b.classList.remove(...allClassesToRemove);
                b.classList.add(...inactClass);
            }
        });
        if (selectedCase === 'attract' && b1) {
            b1.classList.add(...actClass);
            b1.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-al' && b2) {
            b2.classList.add(...actClass);
            b2.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-f' && b3) {
            b3.classList.add(...actClass);
            b3.classList.remove(...inactClass);
        }
    }

    function getIonHTML(type) {
        if (type === 'Al') {
            return `<div class="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 flex items-center justify-center shadow-lg border-2 border-purple-300 text-white font-bold text-2xl relative z-10">Al³⁺</div>`;
        } else {
            return `<div class="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-800 flex items-center justify-center shadow-lg border-2 border-cyan-300 text-white font-bold text-xl relative z-10">F⁻</div>`;
        }
    }

    function buildForcesDOM() {
        const container = document.getElementById('forces-container');
        if (!container) return;

        let leftType, rightType;
        
        if (selectedCase === 'attract') { 
            leftType = 'Al'; rightType = 'F'; 
        }
        else if (selectedCase === 'repel-al') { 
            leftType = 'Al'; rightType = 'Al'; 
        }
        else { 
            leftType = 'F'; rightType = 'F'; 
        }
        
        const isAttract = selectedCase === 'attract';
        
        const leftArrowHTML = isAttract 
            ? `<div id="mod3-arrow-left" class="absolute right-[-12px] opacity-0 transition-opacity duration-300">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="8" y2="10" stroke="white" stroke-width="2"/><polygon points="8,7 12,10 8,13" fill="white"/></svg>
               </div>`
            : `<div id="mod3-arrow-left" class="absolute left-[-12px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="8" y2="10" stroke="white" stroke-width="2"/><polygon points="8,7 12,10 8,13" fill="white"/></svg>
               </div>`;
               
        const rightArrowHTML = isAttract
            ? `<div id="mod3-arrow-right" class="absolute left-[-12px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="8" y2="10" stroke="white" stroke-width="2"/><polygon points="8,7 12,10 8,13" fill="white"/></svg>
               </div>`
            : `<div id="mod3-arrow-right" class="absolute right-[-12px] opacity-0 transition-opacity duration-300">
                    <svg width="12" height="20"><line x1="0" y1="10" x2="8" y2="10" stroke="white" stroke-width="2"/><polygon points="8,7 12,10 8,13" fill="white"/></svg>
               </div>`;
        
        container.innerHTML = `
            <div id="mod3-left" class="absolute left-1/4 -translate-x-1/2 flex items-center justify-center transition-all duration-1000 ease-in-out">
                ${leftArrowHTML}
                ${getIonHTML(leftType)}
            </div>
            <div id="mod3-right" class="absolute right-1/4 translate-x-1/2 flex items-center justify-center transition-all duration-1000 ease-in-out">
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
        
        if (selectedCase === 'attract') {
            left.style.left = 'calc(50% - 55px)';
            right.style.right = 'calc(50% - 55px)';
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
        }, 1500);
    }

    function reset() {
        const left = document.getElementById('mod3-left');
        const right = document.getElementById('mod3-right');
        const aLeft = document.getElementById('mod3-arrow-left');
        const aRight = document.getElementById('mod3-arrow-right');
        
        if (left) {
            left.style.left = '25%';
            left.style.transform = '';
        }
        if (right) {
            right.style.right = '25%';
            right.style.transform = '';
        }
        if (aLeft) aLeft.style.opacity = '0';
        if (aRight) aRight.style.opacity = '0';
    }

    return { render, setupControls, play, reset };
})();
