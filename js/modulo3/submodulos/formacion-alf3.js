/**
 * Submódulo 2: Formación de Iones AlF3 (Catión Al³⁺ y 3 Aniones F⁻)
 */
window.FormacionAlf3 = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        
        let alGroup = `<g id="mod3-al-container" style="transition: transform 1.5s ease-in-out; transform-origin: 500px 380px;">`;
        alGroup += `<g id="mod3-al-ion">` + generateAtomSVG({ 
            symbol: 'Al', 
            name: 'Aluminio',
            shells: [2, 8], 
            x: 500, 
            y: 380, 
            color: '#a855f7', 
            idPrefix: 'm3-alp', 
            showCharge: true, 
            charge: 3, 
            showBrackets: true, 
            showLabels: true, 
            startBracketsVisible: true,
            electronColor: '#fcd34d',
            electronStroke: '#d97706'
        }) + `</g>`;
        alGroup += `</g>`;
        
        const fProps = {
            symbol: 'F', 
            name: 'Flúor',
            shells: [2, 8], 
            color: '#06b6d4', 
            showCharge: true, 
            charge: -1, 
            showBrackets: true, 
            showLabels: false, 
            startBracketsVisible: true,
            electronColor: '#67e8f9',
            electronStroke: '#0891b2'
        };

        // Trigonal plana más ancha y baja
        let f1Group = `<g id="mod3-f1-container" style="transition: transform 1.5s ease-in-out; transform-origin: 500px 120px;">`;
        f1Group += `<g id="mod3-f1-ion">` + generateAtomSVG({ ...fProps, x: 500, y: 120, idPrefix: 'm3-f1n' }) + `</g></g>`;

        let f2Group = `<g id="mod3-f2-container" style="transition: transform 1.5s ease-in-out; transform-origin: 240px 480px;">`;
        f2Group += `<g id="mod3-f2-ion">` + generateAtomSVG({ ...fProps, x: 240, y: 480, idPrefix: 'm3-f2n', chargePosition: 'left' }) + `</g></g>`;

        let f3Group = `<g id="mod3-f3-container" style="transition: transform 1.5s ease-in-out; transform-origin: 760px 480px;">`;
        f3Group += `<g id="mod3-f3-ion">` + generateAtomSVG({ ...fProps, x: 760, y: 480, idPrefix: 'm3-f3n', chargePosition: 'right' }) + `</g></g>`;
        
        let arrowsGroup = `<g id="mod3-arrows" style="opacity: 0; transition: opacity 0.5s ease-in-out;">`;
        arrowsGroup += drawArrow('m3-arr-1a', 500, 225, 500, 240, 'white');
        arrowsGroup += drawArrow('m3-arr-1b', 500, 270, 500, 255, 'white');
        arrowsGroup += drawArrow('m3-arr-2a', 339, 441, 353, 436, 'white');
        arrowsGroup += drawArrow('m3-arr-2b', 376, 427, 362, 432, 'white');
        arrowsGroup += drawArrow('m3-arr-3a', 661, 441, 647, 436, 'white');
        arrowsGroup += drawArrow('m3-arr-3b', 624, 427, 638, 432, 'white');
        arrowsGroup += `</g>`;
        
        svgLayer.innerHTML = alGroup + f1Group + f2Group + f3Group + arrowsGroup;
    }

    function play(appInstance) {
        const alCont = document.getElementById('mod3-al-container');
        const f1Cont = document.getElementById('mod3-f1-container');
        const f2Cont = document.getElementById('mod3-f2-container');
        const f3Cont = document.getElementById('mod3-f3-container');
        
        // Se atraen hacia el centro
        if (f1Cont) f1Cont.style.transform = 'translateY(15px)';
        if (f2Cont) f2Cont.style.transform = 'translate(15px, -7px)';
        if (f3Cont) f3Cont.style.transform = 'translate(-15px, -7px)';
        
        const arrows = document.getElementById('mod3-arrows');
        if (arrows) arrows.style.opacity = '1';

        window.currentAnimationTimeout = setTimeout(() => {
            if (appInstance && appInstance.currentSubmodule === 2) {
                appInstance.setPlayState(false);
            }
        }, 1500);
    }

    function reset() {
        const alCont = document.getElementById('mod3-al-container');
        const f1Cont = document.getElementById('mod3-f1-container');
        const f2Cont = document.getElementById('mod3-f2-container');
        const f3Cont = document.getElementById('mod3-f3-container');
        if (f1Cont) f1Cont.style.transform = 'translate(0, 0)';
        if (f2Cont) f2Cont.style.transform = 'translate(0, 0)';
        if (f3Cont) f3Cont.style.transform = 'translate(0, 0)';
        
        const arrows = document.getElementById('mod3-arrows');
        if (arrows) arrows.style.opacity = '0';
    }

    return { render, play, reset };
})();
