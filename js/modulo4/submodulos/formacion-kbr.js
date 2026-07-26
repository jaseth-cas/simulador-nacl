/**
 * Submódulo 2: Formación de Iones KBr (Catión K⁺ y Anión Br⁻)
 */
window.FormacionKbr = (function() {
    function render() {
        const svgLayer = document.getElementById('svg-content');
        const { generateAtomSVG, drawArrow } = window.BohrUtils;
        
        let kGroup = `<g id="mod4-k-container" style="transition: all 1.5s ease-in-out; transform-origin: 250px 300px;">`;
        kGroup += `<g id="mod4-k-ion">` + generateAtomSVG({ 
            symbol: 'K', 
            name: 'Potasio',
            shells: [2, 8, 8], // Perdió su 4ta capa
            x: 250, 
            y: 300, 
            color: '#eab308', 
            idPrefix: 'm4-kp', 
            showCharge: true, 
            charge: 1, 
            showBrackets: true, 
            showLabels: true, 
            startBracketsVisible: true,
            electronColor: '#fef08a',
            electronStroke: '#ca8a04'
        }) + `</g>`;
        kGroup += `</g>`;
        
        let brGroup = `<g id="mod4-br-container" style="transition: all 1.5s ease-in-out; transform-origin: 750px 300px;">`;
        brGroup += `<g id="mod4-br-ion">` + generateAtomSVG({ 
            symbol: 'Br', 
            name: 'Bromo',
            shells: [2, 8, 18, 8], // Completó su 4ta capa
            x: 750, 
            y: 300, 
            color: '#a8a29e', 
            idPrefix: 'm4-brn', 
            showCharge: true, 
            charge: -1, 
            showBrackets: true, 
            showLabels: true, 
            startBracketsVisible: true,
            electronColor: '#e7e5e4',
            electronStroke: '#57534e'
        }) + `</g>`;
        brGroup += `</g>`;
        
        let arrowsGroup = `<g id="mod4-arrows" style="opacity: 0; transition: opacity 0.5s ease-in-out;">`;
        arrowsGroup += drawArrow('m4-arr-left', 480, 300, 488, 300, 'white');
        arrowsGroup += drawArrow('m4-arr-right', 500, 300, 492, 300, 'white');
        arrowsGroup += `</g>`;
        
        svgLayer.innerHTML = kGroup + brGroup + arrowsGroup;
        
        // Colorear el electrón transferido (el último de la capa de valencia) con el color del Potasio
        const transferredElectron = document.getElementById('m4-brn-electron-3-7');
        if (transferredElectron) {
            transferredElectron.setAttribute('fill', '#fef08a');
            transferredElectron.setAttribute('stroke', '#ca8a04');
        }
    }

    function play(appInstance) {
        const kCont = document.getElementById('mod4-k-container');
        const brCont = document.getElementById('mod4-br-container');
        
        if (kCont) kCont.style.transform = 'translateX(130px)';
        if (brCont) brCont.style.transform = 'translateX(-130px)';
        const arrows = document.getElementById('mod4-arrows');
        if (arrows) arrows.style.opacity = '1';

        window.currentAnimationTimeout = setTimeout(() => {
            if (appInstance && appInstance.currentSubmodule === 2) {
                appInstance.setPlayState(false);
            }
        }, 1500);
    }

    function reset() {
        const kCont = document.getElementById('mod4-k-container');
        const brCont = document.getElementById('mod4-br-container');
        if (kCont) kCont.style.transform = 'translateX(0)';
        if (brCont) brCont.style.transform = 'translateX(0)';
        const arrows = document.getElementById('mod4-arrows');
        if (arrows) arrows.style.opacity = '0';
    }

    return { render, play, reset };
})();
