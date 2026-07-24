/**
 * Submódulo 1: Transferencia de Electrones en AlF3 (Al -> 3F)
 */
window.TransferenciaAlf3 = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        
        // Aluminio: [2, 8, 3] en el centro
        const alSVG = generateAtomSVG({
            symbol: 'Al',
            name: 'Aluminio',
            shells: [2, 8, 3],
            x: 500,
            y: 380,
            color: '#a855f7',
            idPrefix: 'mod3-al',
            showLabels: true,
            electronColor: '#fcd34d',
            electronStroke: '#d97706'
        });
        
        // Flúor 1, 2 y 3: [2, 7] trigonal plana
        const fProps = {
            symbol: 'F',
            name: 'Flúor',
            shells: [2, 7],
            color: '#06b6d4',
            showLabels: false,
            valenceEmptySpots: [1],
            electronColor: '#67e8f9',
            electronStroke: '#0891b2'
        };

        const f1SVG = generateAtomSVG({ ...fProps, x: 500, y: 120, idPrefix: 'mod3-f1' });
        const f2SVG = generateAtomSVG({ ...fProps, x: 240, y: 480, idPrefix: 'mod3-f2' });
        const f3SVG = generateAtomSVG({ ...fProps, x: 760, y: 480, idPrefix: 'mod3-f3' });
        
        const arrow1 = drawArrow('mod3-a1', 500, 280, 500, 210, 'rgba(255,255,255,0.3)', true);
        const arrow2 = drawArrow('mod3-a2', 406, 416, 315, 449, 'rgba(255,255,255,0.3)', true);
        const arrow3 = drawArrow('mod3-a3', 594, 416, 685, 449, 'rgba(255,255,255,0.3)', true);
        
        svgLayer.innerHTML = arrow1 + arrow2 + arrow3 + alSVG + f1SVG + f2SVG + f3SVG;
    }

    function play(appInstance) {
        const valenceAl1 = document.getElementById('mod3-al-electron-2-0');
        const valenceAl2 = document.getElementById('mod3-al-electron-2-1');
        const valenceAl3 = document.getElementById('mod3-al-electron-2-2');
        
        if (valenceAl1) valenceAl1.style.opacity = '0';
        if (valenceAl2) valenceAl2.style.opacity = '0';
        if (valenceAl3) valenceAl3.style.opacity = '0';
        
        const svgLayer = document.getElementById('svg-content');
        
        const createElectron = (cx, cy) => {
            const e = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            e.setAttribute('cx', cx.toString());
            e.setAttribute('cy', cy.toString());
            e.setAttribute('r', '4');
            e.setAttribute('fill', '#fcd34d');
            e.setAttribute('stroke', '#d97706');
            e.classList.add('animate-pulse-glow');
            e.style.transition = 'all 1.5s ease-in-out';
            e.style.opacity = '0';
            svgLayer.appendChild(e);
            return e;
        };

        // El1 va de Al a F1 (arriba)
        const e1 = createElectron(500, 295);

        // El2 va de Al a F2 (abajo izquierda)
        const e2 = createElectron(426, 422.5);

        // El3 va de Al a F3 (abajo derecha)
        const e3 = createElectron(574, 422.5);
        
        setTimeout(() => {
            e1.style.opacity = '1';
            e2.style.opacity = '1';
            e3.style.opacity = '1';
            
            e1.style.transform = `translate(0px, -110px)`;
            e2.style.transform = `translate(-124px, 38px)`;
            e3.style.transform = `translate(124px, 38px)`;
        }, 50);

        setTimeout(() => {
            e1.style.opacity = '0';
            e2.style.opacity = '0';
            e3.style.opacity = '0';
        }, 1500);

        window.currentAnimationTimeout = setTimeout(() => {
            if (e1.parentNode) e1.remove();
            if (e2.parentNode) e2.remove();
            if (e3.parentNode) e3.remove();
            
            // Los 3 electrones de los Flúor que estaban vacíos se vuelven visibles
            const valenceF1 = document.getElementById('mod3-f1-electron-1-7');
            const valenceF2 = document.getElementById('mod3-f2-electron-1-7');
            const valenceF3 = document.getElementById('mod3-f3-electron-1-7');
            if (valenceF1) valenceF1.style.opacity = '1';
            if (valenceF2) valenceF2.style.opacity = '1';
            if (valenceF3) valenceF3.style.opacity = '1';
            
            const labelAl = document.getElementById('mod3-al-label');
            if (labelAl) labelAl.textContent = 'Ion Aluminio 3⁺';
            
            const updateLabel = (id) => {
                const l = document.getElementById(id);
                if (l) l.textContent = 'Ion Flúor ⁻';
            };
            updateLabel('mod3-f1-label');
            updateLabel('mod3-f2-label');
            updateLabel('mod3-f3-label');
            
            if (appInstance && appInstance.currentSubmodule === 1) {
                appInstance.setPlayState(false);
            }
        }, 2000);
    }

    function reset() {
        const valenceAl1 = document.getElementById('mod3-al-electron-2-0');
        const valenceAl2 = document.getElementById('mod3-al-electron-2-1');
        const valenceAl3 = document.getElementById('mod3-al-electron-2-2');
        if (valenceAl1) valenceAl1.style.opacity = '1';
        if (valenceAl2) valenceAl2.style.opacity = '1';
        if (valenceAl3) valenceAl3.style.opacity = '1';
        
        const valenceF1 = document.getElementById('mod3-f1-electron-1-7');
        const valenceF2 = document.getElementById('mod3-f2-electron-1-7');
        const valenceF3 = document.getElementById('mod3-f3-electron-1-7');
        if (valenceF1) valenceF1.style.opacity = '0';
        if (valenceF2) valenceF2.style.opacity = '0';
        if (valenceF3) valenceF3.style.opacity = '0';
        
        const labelAl = document.getElementById('mod3-al-label');
        if (labelAl) labelAl.textContent = 'Átomo de Aluminio';
        
        const resetLabel = (id) => {
            const l = document.getElementById(id);
            if (l) l.textContent = 'Átomo de Flúor';
        };
        resetLabel('mod3-f1-label');
        resetLabel('mod3-f2-label');
        resetLabel('mod3-f3-label');
    }

    return { render, play, reset };
})();
