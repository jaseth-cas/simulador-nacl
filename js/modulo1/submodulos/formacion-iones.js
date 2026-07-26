/**
 * Submódulo 2: Formación de Iones (Catión Na⁺ y Anión Cl⁻)
 */
window.FormacionIones = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        let naGroup = `<g id="mod2-na-container" style="transition: all 1.5s ease-in-out; transform-origin: 300px 300px;">`;
        naGroup += `<g id="mod2-na-ion">` + generateAtomSVG({ symbol: 'Na', name: 'Sodio', shells: [2, 8], x: 300, y: 300, color: '#3b82f6', electronColor: '#60a5fa', electronStroke: '#2563eb', idPrefix: 'm2-nap', showCharge: true, charge: 1, showBrackets: true, showLabels: true, startBracketsVisible: true }) + `</g>`;
        naGroup += `</g>`;
        let clGroup = `<g id="mod2-cl-container" style="transition: all 1.5s ease-in-out; transform-origin: 700px 300px;">`;
        clGroup += `<g id="mod2-cl-ion">` + generateAtomSVG({ symbol: 'Cl', name: 'Cloro', shells: [2, 8, 8], x: 700, y: 300, color: '#10b981', electronColor: '#4ade80', electronStroke: '#166534', idPrefix: 'm2-cln', showCharge: true, charge: -1, showBrackets: true, showLabels: true, startBracketsVisible: true }) + `</g>`;
        clGroup += `</g>`;
        
        let arrowsGroup = `<g id="mod2-arrows" style="opacity: 0; transition: opacity 0.5s ease-in-out;">`;
        arrowsGroup += drawArrow('m2-arr-left', 480, 300, 488, 300, 'white');
        arrowsGroup += drawArrow('m2-arr-right', 500, 300, 492, 300, 'white');
        arrowsGroup += `</g>`;
        
        svgLayer.innerHTML = naGroup + clGroup + arrowsGroup;
        
        // Colorear el electrón transferido (el último de la capa de valencia) de color azul (Sodio)
        const transferredElectron = document.getElementById('m2-cln-electron-2-7');
        if (transferredElectron) {
            transferredElectron.setAttribute('fill', '#60a5fa');
            transferredElectron.setAttribute('stroke', '#2563eb');
        }
    }

    function play(appInstance) {
        const naCont = document.getElementById('mod2-na-container');
        const clCont = document.getElementById('mod2-cl-container');
        
        if (naCont) naCont.style.transform = 'translateX(100px)';
        if (clCont) clCont.style.transform = 'translateX(-100px)';
        const arrows = document.getElementById('mod2-arrows');
        if (arrows) arrows.style.opacity = '1';

        window.currentAnimationTimeout = setTimeout(() => {
            if (appInstance && appInstance.currentSubmodule === 2) {
                appInstance.setPlayState(false);
            }
        }, 1500);
    }

    function reset() {
        const naCont = document.getElementById('mod2-na-container');
        const clCont = document.getElementById('mod2-cl-container');
        if (naCont) naCont.style.transform = 'translateX(0)';
        if (clCont) clCont.style.transform = 'translateX(0)';
        const arrows = document.getElementById('mod2-arrows');
        if (arrows) arrows.style.opacity = '0';
    }

    return { render, play, reset };
})();
