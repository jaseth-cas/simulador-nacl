/**
 * Submódulo 2: Formación de Iones MgO (Catión Mg²⁺ y Anión O²⁻)
 */
window.FormacionMgo = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        
        let mgGroup = `<g id="mod2-mg-container" style="transition: all 1.5s ease-in-out; transform-origin: 300px 300px;">`;
        mgGroup += `<g id="mod2-mg-ion">` + generateAtomSVG({ 
            symbol: 'Mg', 
            name: 'Magnesio',
            shells: [2, 8], // Perdió su 3ra capa
            x: 300, 
            y: 300, 
            color: '#f97316', 
            idPrefix: 'm2-mgp', 
            showCharge: true, 
            charge: 2, 
            showBrackets: true, 
            showLabels: true, 
            startBracketsVisible: true,
            electronColor: '#fcd34d',
            electronStroke: '#d97706'
        }) + `</g>`;
        mgGroup += `</g>`;
        
        let oGroup = `<g id="mod2-o-container" style="transition: all 1.5s ease-in-out; transform-origin: 700px 300px;">`;
        oGroup += `<g id="mod2-o-ion">` + generateAtomSVG({ 
            symbol: 'O', 
            name: 'Oxígeno',
            shells: [2, 8], // Completó su 2da capa
            x: 700, 
            y: 300, 
            color: '#ef4444', 
            idPrefix: 'm2-on', 
            showCharge: true, 
            charge: -2, 
            showBrackets: true, 
            showLabels: true, 
            startBracketsVisible: true,
            electronColor: '#fca5a5',
            electronStroke: '#b91c1c'
        }) + `</g>`;
        oGroup += `</g>`;
        
        let arrowsGroup = `<g id="mod2-arrows" style="opacity: 0; transition: opacity 0.5s ease-in-out;">`;
        arrowsGroup += drawArrow('m2-arr-left', 490, 300, 498, 300, 'white');
        arrowsGroup += drawArrow('m2-arr-right', 510, 300, 502, 300, 'white');
        arrowsGroup += `</g>`;
        
        svgLayer.innerHTML = mgGroup + oGroup + arrowsGroup;
    }

    function play(appInstance) {
        const mgCont = document.getElementById('mod2-mg-container');
        const oCont = document.getElementById('mod2-o-container');
        
        // Reducimos la traslación para que no choquen con la carga 2+ que ahora está a la derecha
        if (mgCont) mgCont.style.transform = 'translateX(110px)';
        if (oCont) oCont.style.transform = 'translateX(-110px)';
        const arrows = document.getElementById('mod2-arrows');
        if (arrows) arrows.style.opacity = '1';

        window.currentAnimationTimeout = setTimeout(() => {
            if (appInstance && appInstance.currentSubmodule === 2) {
                appInstance.setPlayState(false);
            }
        }, 1500);
    }

    function reset() {
        const mgCont = document.getElementById('mod2-mg-container');
        const oCont = document.getElementById('mod2-o-container');
        if (mgCont) mgCont.style.transform = 'translateX(0)';
        if (oCont) oCont.style.transform = 'translateX(0)';
        const arrows = document.getElementById('mod2-arrows');
        if (arrows) arrows.style.opacity = '0';
    }

    return { render, play, reset };
})();
