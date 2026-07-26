/**
 * Submódulo 1: Transferencia de Electrones en MgO (Mg -> O)
 */
window.TransferenciaMgo = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        
        // Magnesio: [2, 8, 2]
        const mgSVG = generateAtomSVG({
            symbol: 'Mg',
            name: 'Magnesio',
            shells: [2, 8, 2],
            x: 300,
            y: 300,
            color: '#f97316', // Orange
            idPrefix: 'mod2-mg',
            showLabels: true,
            electronColor: '#fcd34d',
            electronStroke: '#d97706'
        });
        
        // Oxígeno: [2, 6] con 2 espacios vacíos en la capa 1 (n=2)
        const oSVG = generateAtomSVG({
            symbol: 'O',
            name: 'Oxígeno',
            shells: [2, 6],
            x: 700,
            y: 300,
            color: '#ef4444', // Red
            idPrefix: 'mod2-o',
            showLabels: true,
            valenceEmptySpots: [1],
            electronColor: '#fca5a5',
            electronStroke: '#b91c1c'
        });
        
        const arrow1 = drawArrow('mod2-arrow1', 395, 280, 625, 280, 'rgba(255,255,255,0.3)', true);
        const arrow2 = drawArrow('mod2-arrow2', 395, 320, 625, 320, 'rgba(255,255,255,0.3)', true);
        svgLayer.innerHTML = arrow1 + arrow2 + mgSVG + oSVG;
    }

    function play(appInstance) {
        // En MgO se transfieren 2 electrones del Mg (capa n=3, índice 2)
        const valenceMg1 = document.getElementById('mod2-mg-electron-2-0');
        const valenceMg2 = document.getElementById('mod2-mg-electron-2-1');
        
        if (valenceMg1) valenceMg1.style.opacity = '0';
        if (valenceMg2) valenceMg2.style.opacity = '0';
        
        const svgLayer = document.getElementById('svg-content');
        
        // Crear 2 electrones animados
        const e1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        e1.setAttribute('cx', '385');
        e1.setAttribute('cy', '280');
        e1.setAttribute('r', '4');
        e1.setAttribute('fill', '#fcd34d');
        e1.setAttribute('stroke', '#d97706');
        e1.classList.add('animate-pulse-glow');
        e1.style.transition = 'all 1.5s ease-in-out';
        e1.style.transform = 'translate(0px, 0px)';
        e1.style.opacity = '0';
        
        const e2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        e2.setAttribute('cx', '385');
        e2.setAttribute('cy', '320');
        e2.setAttribute('r', '4');
        e2.setAttribute('fill', '#fcd34d');
        e2.setAttribute('stroke', '#d97706');
        e2.classList.add('animate-pulse-glow');
        e2.style.transition = 'all 1.5s ease-in-out';
        e2.style.transform = 'translate(0px, 0px)';
        e2.style.opacity = '0';
        
        svgLayer.appendChild(e1);
        svgLayer.appendChild(e2);
        
        setTimeout(() => {
            e1.style.opacity = '1';
            e2.style.opacity = '1';
            e1.style.transform = 'translate(250px, 0px)';
            e2.style.transform = 'translate(250px, 0px)';
        }, 50);

        setTimeout(() => {
            e1.style.opacity = '0';
            e2.style.opacity = '0';
        }, 1500);

        window.currentAnimationTimeout = setTimeout(() => {
            if (e1.parentNode) e1.remove();
            if (e2.parentNode) e2.remove();
            
            // Los 2 electrones del Oxígeno que estaban vacíos se vuelven visibles
            // Como Oxygen tiene [2, 6] y divisor=8, los vacíos son 6 y 7
            const valenceO1 = document.getElementById('mod2-o-electron-1-6');
            const valenceO2 = document.getElementById('mod2-o-electron-1-7');
            if (valenceO1) valenceO1.style.opacity = '1';
            if (valenceO2) valenceO2.style.opacity = '1';
            
            const labelMg = document.getElementById('mod2-mg-label');
            if (labelMg) labelMg.textContent = 'Ion Magnesio 2⁺';
            
            const labelO = document.getElementById('mod2-o-label');
            if (labelO) labelO.textContent = 'Ion Oxígeno 2⁻';
            
            if (appInstance && appInstance.currentSubmodule === 1) {
                appInstance.setPlayState(false);
            }
        }, 2000);
    }

    function reset() {
        const valenceMg1 = document.getElementById('mod2-mg-electron-2-0');
        const valenceMg2 = document.getElementById('mod2-mg-electron-2-1');
        if (valenceMg1) valenceMg1.style.opacity = '1';
        if (valenceMg2) valenceMg2.style.opacity = '1';
        
        const valenceO1 = document.getElementById('mod2-o-electron-1-6');
        const valenceO2 = document.getElementById('mod2-o-electron-1-7');
        if (valenceO1) valenceO1.style.opacity = '0';
        if (valenceO2) valenceO2.style.opacity = '0';
        
        const labelMg = document.getElementById('mod2-mg-label');
        if (labelMg) labelMg.textContent = 'Átomo de Magnesio';
        
        const labelO = document.getElementById('mod2-o-label');
        if (labelO) labelO.textContent = 'Átomo de Oxígeno';
    }

    return { render, play, reset };
})();
