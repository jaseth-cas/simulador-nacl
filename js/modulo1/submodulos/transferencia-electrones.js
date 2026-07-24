/**
 * Submódulo 1: Transferencia de Electrones (Modelo de Bohr de Na y Cl)
 */
window.TransferenciaElectrones = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        const naSVG = generateAtomSVG({
            symbol: 'Na',
            name: 'Sodio',
            shells: [2, 8, 1],
            x: 300,
            y: 300,
            color: '#3b82f6',
            electronColor: '#60a5fa',
            electronStroke: '#2563eb',
            idPrefix: 'mod1-na',
            showLabels: true
        });
        const clSVG = generateAtomSVG({
            symbol: 'Cl',
            name: 'Cloro',
            shells: [2, 8, 7],
            x: 700,
            y: 300,
            color: '#10b981',
            electronColor: '#4ade80',
            electronStroke: '#166534',
            valenceEmptySpots: [2],
            idPrefix: 'mod1-cl',
            showLabels: true
        });
        const arrow = drawArrow('mod1-arrow', 380, 220, 620, 220, 'rgba(255,255,255,0.3)', true);
        svgLayer.innerHTML = arrow + naSVG + clSVG;
    }

    function play(appInstance) {
        const valenceNa = document.getElementById('mod1-na-electron-2-0');
        if (valenceNa) valenceNa.style.opacity = '0';
        
        const tempElectron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        tempElectron.setAttribute('cx', '380');
        tempElectron.setAttribute('cy', '300');
        tempElectron.setAttribute('r', '4');
        tempElectron.setAttribute('fill', '#60a5fa');
        tempElectron.setAttribute('stroke', '#2563eb');
        tempElectron.classList.add('animate-pulse-glow');
        tempElectron.style.transition = 'all 1.5s ease-in-out';
        tempElectron.style.transform = 'translateX(0px)';
        tempElectron.style.opacity = '0';
        document.getElementById('svg-content').appendChild(tempElectron);
        
        setTimeout(() => {
            tempElectron.style.opacity = '1';
            tempElectron.style.transform = 'translateX(240px)';
        }, 50);

        setTimeout(() => {
            tempElectron.style.opacity = '0';
        }, 1500);

        window.currentAnimationTimeout = setTimeout(() => {
            if (tempElectron.parentNode) tempElectron.remove();
            
            const valenceCl = document.getElementById('mod1-cl-electron-2-7');
            if (valenceCl) {
                valenceCl.style.opacity = '1';
                valenceCl.setAttribute('fill', '#60a5fa');
                valenceCl.setAttribute('stroke', '#2563eb');
            }
            
            const labelNa = document.getElementById('mod1-na-label');
            if (labelNa) labelNa.textContent = 'Ion Sodio ⁺';
            
            const labelCl = document.getElementById('mod1-cl-label');
            if (labelCl) labelCl.textContent = 'Ion Cloro ⁻';
            
            if (appInstance && appInstance.currentSubmodule === 1) {
                appInstance.setPlayState(false);
            }
        }, 2000);
    }

    function reset() {
        const valenceNa = document.getElementById('mod1-na-electron-2-0');
        if (valenceNa) valenceNa.style.opacity = '1';
        
        const valenceCl = document.getElementById('mod1-cl-electron-2-7');
        if (valenceCl) valenceCl.style.opacity = '0';
        
        const labelNa = document.getElementById('mod1-na-label');
        if (labelNa) labelNa.textContent = 'Átomo de Sodio';
        
        const labelCl = document.getElementById('mod1-cl-label');
        if (labelCl) labelCl.textContent = 'Átomo de Cloro';
    }

    return { render, play, reset };
})();
