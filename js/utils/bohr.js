/**
 * Utilidades para la generación de diagramas atómicos de Bohr en SVG y flechas de fuerza.
 */
window.BohrUtils = (function() {
    function generateAtomSVG(options) {
        const {
            symbol, name, shells = [2], x = 0, y = 0, color = '#3b82f6', 
            electronColor = '#60a5fa', electronStroke = '#2563eb',
            idPrefix = 'atom', showCharge = false, charge = 0, 
            showBrackets = false, startBracketsVisible = false,
            showLabels = false, valenceEmptySpots = [], chargePosition
        } = options;
        
        const coreRadius = 25;
        const shellSpacing = 20;
        
        let svg = '';
        svg += `<g id="${idPrefix}-atom" style="transform: translate(${x}px, ${y}px);">`;
        svg += `<circle r="${coreRadius}" fill="url(#grad-${symbol.toLowerCase()})" class="nucleus" />`;
        const textY = (showCharge && !showBrackets) ? -2 : 5;
        svg += `<text x="0" y="${textY}" fill="white" font-weight="bold" text-anchor="middle" font-size="16">${symbol}</text>`;

        if (showCharge && charge !== 0 && !showBrackets) {
            const chargeStr = charge > 0 ? (charge > 1 ? `${charge}⁺` : '⁺') : (Math.abs(charge) > 1 ? `${Math.abs(charge)}⁻` : '⁻');
            svg += `<text x="14" y="-8" fill="white" font-weight="bold" font-size="14">${chargeStr}</text>`;
        }

        if (showBrackets) {
            const maxRadius = coreRadius + (shells.length) * shellSpacing + 10;
            const bOpacity = startBracketsVisible ? '1' : '0';
            svg += `<path d="M ${-maxRadius+10} ${-maxRadius-10} L ${-maxRadius} ${-maxRadius-10} L ${-maxRadius} ${maxRadius+10} L ${-maxRadius+10} ${maxRadius+10}" fill="none" stroke="white" stroke-width="2" opacity="${bOpacity}" class="bracket-elem" />`;
            svg += `<path d="M ${maxRadius-10} ${-maxRadius-10} L ${maxRadius} ${-maxRadius-10} L ${maxRadius} ${maxRadius+10} L ${maxRadius-10} ${maxRadius+10}" fill="none" stroke="white" stroke-width="2" opacity="${bOpacity}" class="bracket-elem" />`;
            
            const chargeStr = charge > 0 ? (charge > 1 ? `${charge}+` : '+') : (Math.abs(charge) > 1 ? `${Math.abs(charge)}-` : '-');
            let chargeX = charge > 0 ? -maxRadius - 40 : maxRadius + 10;
            if (chargePosition === 'left') {
                chargeX = -maxRadius - 30; // Un poco más cerca para los negativos
            } else if (chargePosition === 'right') {
                chargeX = maxRadius + 10;
            }
            svg += `<text x="${chargeX}" y="${-maxRadius}" fill="red" font-weight="bold" font-size="28" opacity="${bOpacity}" class="bracket-elem">${chargeStr}</text>`;
        }

        if (showLabels) {
            const maxRadius = coreRadius + (shells.length) * shellSpacing + 10;
            const labelY = showBrackets ? -maxRadius - 30 : -maxRadius - 20;
            const chargeSign = charge > 0 ? '⁺' : '⁻';
            const chargeNum = Math.abs(charge) > 1 ? Math.abs(charge) : '';
            const labelText = charge !== 0 && showCharge ? `Ion ${name} ${chargeNum}${chargeSign}` : `Átomo de ${name}`;
            svg += `<text id="${idPrefix}-label" x="0" y="${labelY}" fill="#94a3b8" font-weight="600" text-anchor="middle" font-size="14" style="transition: opacity 0.5s;">${labelText}</text>`;
        }

        shells.forEach((electronCount, shellIndex) => {
            const radius = coreRadius + (shellIndex + 1) * shellSpacing;
            const shellId = `${idPrefix}-shell-${shellIndex}`;
            svg += `<circle id="${shellId}" r="${radius}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5" />`;
            
            const hasEmptySpots = valenceEmptySpots.includes(shellIndex);
            let divisor = electronCount;
            if (hasEmptySpots) {
                // If it's a valence shell that is filling up (like 7 going to 8), we divide by the full capacity (8)
                divisor = electronCount > 2 ? 8 : 2; // Simplification for common octets
            }
            
            const angleStep = (2 * Math.PI) / divisor;
            const endI = hasEmptySpots ? divisor : electronCount;
            const groupClass = (shellIndex % 2 === 0 ? 'spin-slow' : 'spin-slow-reverse');
            
            svg += `<g class="${groupClass}" style="transform-origin: 0px 0px;">`;
            for (let i = 0; i < endI; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const ex = radius * Math.cos(angle);
                const ey = radius * Math.sin(angle);
                const electronId = `${idPrefix}-electron-${shellIndex}-${i}`;
                
                let elColor = electronColor;
                let elStroke = electronStroke;
                let opacity = '1';
                
                // Si este espacio está vacío inicialmente, lo dibujamos invisible (opacidad 0) pero preparado para ser llenado
                if (hasEmptySpots && i >= electronCount) {
                    opacity = '0';
                    // The receiving electrons will come from the cation, so we keep the color/stroke of the cation, 
                    // or we set it later in JS via element styling.
                    elColor = '#fcd34d'; // Default incoming electron color (can be overwritten by css)
                    elStroke = '#d97706';
                }
                
                svg += `<circle id="${electronId}" cx="${ex}" cy="${ey}" r="4" fill="${elColor}" stroke="${elStroke}" stroke-width="1" opacity="${opacity}" style="transition: opacity 0.5s ease-in-out;" />`;
            }
            svg += `</g>`;
        });
        svg += `</g>`;
        return svg;
    }

    function drawArrow(id, x1, y1, x2, y2, color = 'white', dashed = false) {
        const dash = dashed ? 'stroke-dasharray="5,5"' : '';
        let defs = `
        <defs>
            <marker id="arrow-${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="${color}" />
            </marker>
        </defs>`;
        return `${defs}<line id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" marker-end="url(#arrow-${id})" ${dash} />`;
    }

    return { generateAtomSVG, drawArrow };
})();
