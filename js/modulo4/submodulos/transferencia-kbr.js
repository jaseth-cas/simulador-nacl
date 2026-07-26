/**
 * Submódulo 1: Transferencia de Electrones en KBr (K -> Br)
 */
window.TransferenciaKbr = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        
        // Potasio: [2, 8, 8, 1]
        const kSVG = generateAtomSVG({
            symbol: 'K',
            name: 'Potasio',
            shells: [2, 8, 8, 1],
            x: 250,
            y: 300,
            color: '#eab308', // Yellow
            idPrefix: 'mod4-k',
            showLabels: true,
            electronColor: '#fef08a',
            electronStroke: '#ca8a04'
        });
        
        // Bromo: [2, 8, 18, 7]
        const brSVG = generateAtomSVG({
            symbol: 'Br',
            name: 'Bromo',
            shells: [2, 8, 18, 7],
            x: 750,
            y: 300,
            color: '#a8a29e', // Stone
            idPrefix: 'mod4-br',
            showLabels: true,
            valenceEmptySpots: [3], // Un hueco en la última capa (índice 3)
            electronColor: '#e7e5e4',
            electronStroke: '#57534e'
        });
        
        // Flecha horizontal por el medio (y=300)
        const arrow = drawArrow('mod4-arrow', 360, 300, 640, 300, 'rgba(255,255,255,0.3)', true);
        svgLayer.innerHTML = arrow + kSVG + brSVG;
    }

    function play(appInstance) {
        // En KBr se transfiere 1 electrón del K (capa n=4, índice 3, electrón 0)
        const valenceK = document.getElementById('mod4-k-electron-3-0');
        if (valenceK) valenceK.style.opacity = '0';
        
        const svgLayer = document.getElementById('svg-content');
        
        const tempElectron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        tempElectron.setAttribute('cx', '355'); // Borde derecho del K
        tempElectron.setAttribute('cy', '300'); // Medio
        tempElectron.setAttribute('r', '4');
        tempElectron.setAttribute('fill', '#fef08a');
        tempElectron.setAttribute('stroke', '#ca8a04');
        tempElectron.classList.add('animate-pulse-glow');
        tempElectron.style.transition = 'all 1.5s ease-in-out';
        tempElectron.style.transform = 'translate(0px, 0px)';
        tempElectron.style.opacity = '0';
        
        svgLayer.appendChild(tempElectron);
        
        setTimeout(() => {
            tempElectron.style.opacity = '1';
            tempElectron.style.transform = 'translate(290px, 0px)'; // Hacia el borde izquierdo del Br (355 + 290 = 645)
        }, 50);

        setTimeout(() => {
            tempElectron.style.opacity = '0';
        }, 1500);

        window.currentAnimationTimeout = setTimeout(() => {
            if (tempElectron.parentNode) tempElectron.remove();
            
            // El electrón del Bromo que estaba vacío se vuelve visible y toma el color del Potasio
            const valenceBr = document.getElementById('mod4-br-electron-3-7');
            if (valenceBr) {
                valenceBr.style.opacity = '1';
                valenceBr.setAttribute('fill', '#fef08a');
                valenceBr.setAttribute('stroke', '#ca8a04');
            }
            
            const labelK = document.getElementById('mod4-k-label');
            if (labelK) labelK.textContent = 'Ion Potasio ⁺';
            
            const labelBr = document.getElementById('mod4-br-label');
            if (labelBr) labelBr.textContent = 'Ion Bromuro ⁻';
            
            if (appInstance && appInstance.currentSubmodule === 1) {
                appInstance.setPlayState(false);
            }
        }, 2000);
    }

    function reset() {
        const valenceK = document.getElementById('mod4-k-electron-3-0');
        if (valenceK) valenceK.style.opacity = '1';
        
        const valenceBr = document.getElementById('mod4-br-electron-3-7');
        if (valenceBr) valenceBr.style.opacity = '0';
        
        const labelK = document.getElementById('mod4-k-label');
        if (labelK) labelK.textContent = 'Átomo de Potasio';
        
        const labelBr = document.getElementById('mod4-br-label');
        if (labelBr) labelBr.textContent = 'Átomo de Bromo';
    }

    return { render, play, reset };
})();
