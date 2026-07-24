/**
 * Submódulo 3: Atracción y Repulsión Electrostática
 */
window.AtraccionRepulsion = (function() {
    let selectedCase = 'attract';

    function render(appInstance) {
        selectedCase = 'attract';
        updateButtons();
        buildForcesDOM();
        
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');
        if (b1) b1.innerText = "Na⁺ y Cl⁻";
        if (b2) b2.innerText = "Na⁺ y Na⁺";
        if (b3) b3.innerText = "Cl⁻ y Cl⁻";
    }

    function setupControls(appInstance) {
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');

        if (b1) {
            b1.addEventListener('click', () => {
                if (appInstance.app.currentModuleId !== 1) return;
                selectedCase = 'attract';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b2) {
            b2.addEventListener('click', () => {
                if (appInstance.app.currentModuleId !== 1) return;
                selectedCase = 'repel-na';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
        if (b3) {
            b3.addEventListener('click', () => {
                if (appInstance.app.currentModuleId !== 1) return;
                selectedCase = 'repel-cl';
                reset();
                updateButtons();
                buildForcesDOM();
            });
        }
    }

    function updateButtons() {
        const actClass = ['bg-primary/20', 'text-blue-300'];
        const inactClass = ['text-slate-400'];
        const b1 = document.getElementById('btn-case-attract');
        const b2 = document.getElementById('btn-case-repel-na');
        const b3 = document.getElementById('btn-case-repel-cl');
        [b1, b2, b3].forEach(b => {
            if (b) {
                b.classList.remove(...actClass);
                b.classList.add(...inactClass);
            }
        });
        if (selectedCase === 'attract' && b1) {
            b1.classList.add(...actClass);
            b1.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-na' && b2) {
            b2.classList.add(...actClass);
            b2.classList.remove(...inactClass);
        } else if (selectedCase === 'repel-cl' && b3) {
            b3.classList.add(...actClass);
            b3.classList.remove(...inactClass);
        }
    }

    function getIonHTML(type) {
        if (type === 'Na') {
            return `<div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center shadow-lg border-2 border-blue-300 text-white font-bold text-2xl relative z-10">Na⁺</div>`;
        } else {
            return `<div class="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-800 flex items-center justify-center shadow-lg border-2 border-green-300 text-white font-bold text-2xl relative z-10">Cl⁻</div>`;
        }
    }

    function buildForcesDOM() {
        const container = document.getElementById('forces-container');
        if (!container) return;

        let leftType, rightType;
        if (selectedCase === 'attract') { leftType = 'Na'; rightType = 'Cl'; }
        else if (selectedCase === 'repel-na') { leftType = 'Na'; rightType = 'Na'; }
        else { leftType = 'Cl'; rightType = 'Cl'; }
        
        const isAttract = selectedCase === 'attract';
        
        const leftArrowHTML = isAttract 
            ? `<div id="mod3-arrow-left" class="absolute right-[-60px] opacity-0 transition-opacity duration-300">
                    <svg width="50" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="white" stroke-width="3"/><polygon points="40,5 50,10 40,15" fill="white"/></svg>
               </div>`
            : `<div id="mod3-arrow-left" class="absolute left-[-60px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="50" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="white" stroke-width="3"/><polygon points="40,5 50,10 40,15" fill="white"/></svg>
               </div>`;
               
        const rightArrowHTML = isAttract
            ? `<div id="mod3-arrow-right" class="absolute left-[-60px] opacity-0 transition-opacity duration-300 transform rotate-180">
                    <svg width="50" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="white" stroke-width="3"/><polygon points="40,5 50,10 40,15" fill="white"/></svg>
               </div>`
            : `<div id="mod3-arrow-right" class="absolute right-[-60px] opacity-0 transition-opacity duration-300">
                    <svg width="50" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="white" stroke-width="3"/><polygon points="40,5 50,10 40,15" fill="white"/></svg>
               </div>`;
        
        container.innerHTML = `
            <div id="mod3-left" class="absolute left-1/4 -translate-x-1/2 flex items-center justify-center transition-transform duration-1000 ease-in-out">
                ${leftArrowHTML}
                ${getIonHTML(leftType)}
            </div>
            <div id="mod3-right" class="absolute right-1/4 translate-x-1/2 flex items-center justify-center transition-transform duration-1000 ease-in-out">
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
        }, 1200);
    }

    function reset() {
        const left = document.getElementById('mod3-left');
        const right = document.getElementById('mod3-right');
        const aLeft = document.getElementById('mod3-arrow-left');
        const aRight = document.getElementById('mod3-arrow-right');
        if (left && right) {
            left.style.transform = 'translateX(-50%)';
            right.style.transform = 'translateX(50%)';
            if (aLeft) aLeft.style.opacity = '0';
            if (aRight) aRight.style.opacity = '0';
        }
    }

    return { render, setupControls, play, reset };
})();
