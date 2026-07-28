// main.js - Lógica principal de RedoxLab

document.addEventListener('DOMContentLoaded', () => {
    console.log("RedoxLab Inicializado");

    const btnIniciar = document.getElementById('btn-iniciar');
    if (!btnIniciar) return;

    let reaccionIniciada = false;

    // Catálogo Centralizado de Reacciones
    const REACTIONS_CATALOG = {
        'zn-cu': {
            id: 'zn-cu',
            left: {
                symbol: 'Zn', coreSymbolAfter: 'Zn²⁺',
                titleBefore: 'Átomo de Zinc', titleAfter: 'Ion de Zinc',
                stateStart: '0', stateEnd: '+2', shells: [2, 8, 18], staticElectrons: [],
                elColor: '#94a3b8', elStroke: '#475569', bgColor: '#475569',
                coreColorStart: 'bg-slate-700/80', coreColorEnd: 'bg-red-600',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-red-500/50',
                stateColorStart: 'text-blue-400', stateColorEnd: 'text-red-400',
                descBefore: 'Zn tiene 2 electrones de valencia', descAfter: 'Zn²⁺ perdió 2 electrones'
            },
            right: {
                symbolBefore: 'CuSO₄', symbolAfter: 'Cu',
                coreSymbolBefore: 'Cu', coreSymbolAfter: 'Cu',
                titleBefore: 'Ion de Cobre', titleAfter: 'Átomo de Cobre',
                stateStart: '+2', stateEnd: '0', shells: [2, 8, 17], staticElectrons: [],
                elColor: '#60a5fa', elStroke: '#2563eb', bgColor: '#3b82f6',
                coreColorStart: 'bg-blue-600/30', coreColorEnd: 'bg-orange-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-orange-500/50',
                stateColorStart: 'text-blue-400', stateColorEnd: 'text-slate-300',
                descBefore: 'Cu²⁺ le faltan 2 electrones', descAfter: 'Cu ganó 2 electrones'
            },
            eq: {
                l1Name: 'Zn', l1State: '0', l1Color: 'text-blue-400',
                l2Name: 'CuSO₄', l2State: '+2', l2Color: 'text-blue-400',
                r1Name: 'ZnSO₄', r1State: '+2', r1Color: 'text-slate-600',
                r2Name: 'Cu', r2State: '0', r2Color: 'text-slate-600',
                showPlusRight: true
            },
            transfer: [
                { startR: 48, endR: 38.66, angle: -Math.PI / 4, endIdx: 2 }, // va al nivel 3 de Cu
                { startR: 48, endR: 48, angle: -Math.PI / 8, endIdx: 3 }      // va al nivel 4 de Cu
            ],
            panel3: {
                lTitle: 'ZINC', lDesc: 'Pierde 2 electrones', lType: 'Se oxida', lTypeColor: 'text-red-400',
                rTitle: 'COBRE', rDesc: 'Gana 2 electrones', rType: 'Se reduce', rTypeColor: 'text-green-400'
            },
            panel4: {
                ox: 'Zn → <span class="text-red-400 font-bold">Zn²⁺ + 2e⁻</span>', oxMul: '',
                red: '<span class="text-green-400 font-bold">Cu²⁺ + 2e⁻</span> → Cu', redMul: ''
            },
            panel5: {
                ox: '<span class="font-bold text-blue-400">Cu²⁺</span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>',
                red: '<span class="font-bold text-slate-300">Zn</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>'
            },
            panel7: {
                desc: '',
                lost: '2 e⁻', gained: '2 e⁻', lostTextCls: 'text-red-500 font-bold text-lg', gainedTextCls: 'text-green-500 font-bold text-lg'
            },
            btnStyle: { bg: 'bg-slate-800', border: 'border-blue-500' }
        },
        'na-cl': {
            id: 'na-cl',
            left: {
                symbol: 'Na', coreSymbolAfter: 'Na⁺',
                titleBefore: 'Átomo de Sodio', titleAfter: 'Ion de Sodio',
                stateStart: '0', stateEnd: '+1', shells: [2, 8], staticElectrons: [],
                elColor: '#4ade80', elStroke: '#16a34a', bgColor: '#22c55e',
                coreColorStart: 'bg-slate-700/80', coreColorEnd: 'bg-green-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-green-500/50',
                stateColorStart: 'text-green-400', stateColorEnd: 'text-green-400',
                descBefore: 'Na tiene 1 e⁻ de valencia', descAfter: 'Na⁺ perdió 1 electrón'
            },
            right: {
                symbolBefore: 'Cl₂', symbolAfter: 'Cl⁻',
                coreSymbolBefore: 'Cl', coreSymbolAfter: 'Cl⁻',
                titleBefore: 'Átomo de Cloro', titleAfter: 'Ion de Cloro',
                stateStart: '0', stateEnd: '-1', shells: [2, 8], staticElectrons: [-45, 0, 45, 90, 135, 180, 225],
                elColor: '#f87171', elStroke: '#dc2626', bgColor: '#ef4444',
                coreColorStart: 'bg-red-600/30', coreColorEnd: 'bg-red-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-red-500/50',
                stateColorStart: 'text-red-400', stateColorEnd: 'text-red-400',
                descBefore: 'Cl le falta 1 e⁻ para el octeto', descAfter: 'Cl⁻ ganó 1 electrón'
            },
            eq: {
                l1Name: '2Na', l1State: '0', l1Color: 'text-green-400',
                l2Name: 'Cl₂', l2State: '0', l2Color: 'text-red-400',
                r1Name: '2Na', r1State: '+1', r1Color: 'text-green-500',
                r2Name: 'Cl', r2State: '-1', r2Color: 'text-red-500',
                showPlusRight: false
            },
            transfer: [
                { startR: 48, endR: 48, angle: -Math.PI / 2, endIdx: 2 } // va al nivel 3 de Cl (que ya tiene 7, falta 1)
            ],
            panel3: {
                lTitle: 'SODIO', lDesc: 'Pierde 1 electrón', lType: 'Se oxida', lTypeColor: 'text-green-400',
                rTitle: 'CLORO', rDesc: 'Gana 1 electrón', rType: 'Se reduce', rTypeColor: 'text-red-400'
            },
            panel4: {
                ox: 'Na → <span class="text-green-400 font-bold">Na⁺ + 1e⁻</span>', oxMul: '(Balance: 2Na → <span class="text-green-400 font-bold">2Na⁺ + 2e⁻</span>)',
                red: '<span class="text-red-400 font-bold">Cl₂ + 2e⁻</span> → 2Cl⁻', redMul: ''
            },
            panel5: {
                ox: '<span class="font-bold text-red-400">Cl<sub class="text-[8px]">2</sub></span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>',
                red: '<span class="font-bold text-green-400">Na</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>'
            },
            panel7: {
                desc: 'En el proceso global intervienen 2 electrones en total:<br>1. Cada uno de los dos átomos de sodio entrega 1 e⁻.<br>2. La molécula de cloro (Cl₂) acepta esos 2 e⁻ (uno cada átomo).',
                lost: '2 &times; 1e⁻ = 2e⁻', gained: '1 &times; 2e⁻ = 2e⁻',
                lostTextCls: 'text-green-500 font-bold text-sm md:text-base', gainedTextCls: 'text-red-500 font-bold text-sm md:text-base'
            },
            btnStyle: { bg: 'bg-slate-800', border: 'border-green-500' }
        },
        'fe-cu': {
            id: 'fe-cu',
            left: {
                symbol: 'Fe', coreSymbolAfter: 'Fe²⁺',
                titleBefore: 'Átomo de Hierro', titleAfter: 'Ion de Hierro',
                stateStart: '0', stateEnd: '+2', shells: [2, 8, 14], staticElectrons: [],
                elColor: '#cbd5e1', elStroke: '#94a3b8', bgColor: '#94a3b8',
                coreColorStart: 'bg-slate-700/80', coreColorEnd: 'bg-amber-600',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-amber-500/50',
                stateColorStart: 'text-amber-400', stateColorEnd: 'text-amber-400',
                descBefore: 'Fe transfiere 2 e⁻', descAfter: 'Fe²⁺ perdió 2 electrones'
            },
            right: {
                symbolBefore: 'CuSO₄', symbolAfter: 'Cu',
                coreSymbolBefore: 'Cu', coreSymbolAfter: 'Cu',
                titleBefore: 'Ion de Cobre', titleAfter: 'Átomo de Cobre',
                stateStart: '+2', stateEnd: '0', shells: [2, 8, 17], staticElectrons: [],
                elColor: '#60a5fa', elStroke: '#2563eb', bgColor: '#3b82f6',
                coreColorStart: 'bg-blue-600/30', coreColorEnd: 'bg-orange-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-orange-500/50',
                stateColorStart: 'text-blue-400', stateColorEnd: 'text-slate-300',
                descBefore: 'Cu²⁺ le faltan 2 electrones', descAfter: 'Cu ganó 2 electrones'
            },
            eq: {
                l1Name: 'Fe', l1State: '0', l1Color: 'text-blue-400',
                l2Name: 'CuSO₄', l2State: '+2', l2Color: 'text-blue-400',
                r1Name: 'FeSO₄', r1State: '+2', r1Color: 'text-slate-600',
                r2Name: 'Cu', r2State: '0', r2Color: 'text-slate-600',
                showPlusRight: true
            },
            transfer: [
                { startR: 48, endR: 38.66, angle: -Math.PI / 4, endIdx: 2 }, // va al nivel 3 de Cu
                { startR: 48, endR: 48, angle: -Math.PI / 8, endIdx: 3 }      // va al nivel 4 de Cu
            ],
            panel3: {
                lTitle: 'HIERRO', lDesc: 'Pierde 2 electrones', lType: 'Se oxida', lTypeColor: 'text-amber-400',
                rTitle: 'COBRE', rDesc: 'Gana 2 electrones', rType: 'Se reduce', rTypeColor: 'text-green-400'
            },
            panel4: {
                ox: 'Fe → <span class="text-amber-400 font-bold">Fe²⁺ + 2e⁻</span>', oxMul: '',
                red: '<span class="text-green-400 font-bold">Cu²⁺ + 2e⁻</span> → Cu', redMul: ''
            },
            panel5: {
                ox: '<span class="font-bold text-blue-400">Cu²⁺</span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>',
                red: '<span class="font-bold text-slate-300">Fe</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>'
            },
            panel7: {
                desc: '',
                lost: '2 e⁻', gained: '2 e⁻', lostTextCls: 'text-amber-500 font-bold text-lg', gainedTextCls: 'text-green-500 font-bold text-lg'
            },
            btnStyle: { bg: 'bg-slate-800', border: 'border-amber-500' }
        },
        'mg-o2': {
            id: 'mg-o2',
            left: {
                symbol: 'Mg', coreSymbolAfter: 'Mg²⁺',
                titleBefore: 'Magnesio', titleAfter: 'Ion de Magnesio',
                stateStart: '0', stateEnd: '+2', shells: [2, 8], staticElectrons: [],
                elColor: '#cbd5e1', elStroke: '#94a3b8', bgColor: '#94a3b8',
                coreColorStart: 'bg-slate-600/80', coreColorEnd: 'bg-slate-500',
                atomBorderStart: 'border-slate-500', atomBorderEnd: 'border-slate-400/50',
                stateColorStart: 'text-slate-300', stateColorEnd: 'text-slate-300',
                descBefore: 'Mg tiene 2 electrones de valencia', descAfter: 'Mg²⁺ perdió 2 electrones'
            },
            right: {
                symbolBefore: 'O₂', symbolAfter: 'O²⁻',
                coreSymbolBefore: 'O', coreSymbolAfter: 'O²⁻',
                titleBefore: 'Átomo de Oxígeno (de O₂)', titleAfter: 'Ion Óxido',
                stateStart: '0', stateEnd: '-2', shells: [2], staticElectrons: [45, 90, 135, 180, 225, 270],
                elColor: '#f87171', elStroke: '#dc2626', bgColor: '#ef4444',
                coreColorStart: 'bg-red-600/30', coreColorEnd: 'bg-red-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-red-500/50',
                stateColorStart: 'text-red-400', stateColorEnd: 'text-red-400',
                descBefore: 'O le faltan 2 electrones para ser estable', descAfter: 'O²⁻ ganó 2 electrones'
            },
            eq: {
                l1Name: '2Mg', l1State: '0', l1Color: 'text-slate-300',
                l2Name: 'O₂', l2State: '0', l2Color: 'text-red-400',
                r1Name: '2Mg', r1State: '+2', r1Color: 'text-slate-400',
                r2Name: '2O', r2State: '-2', r2Color: 'text-red-500',
                showPlusRight: false
            },
            transfer: [
                { startR: 48, endR: 48, angle: -Math.PI / 4, endIdx: 1 },
                { startR: 48, endR: 48, angle: 0, endIdx: 1 }
            ],
            panel3: {
                lTitle: 'MAGNESIO', lDesc: 'Pierde 2 electrones', lType: 'Se oxida', lTypeColor: 'text-slate-300',
                rTitle: 'OXÍGENO', rDesc: 'Gana 2 electrones', rType: 'Se reduce', rTypeColor: 'text-red-400'
            },
            panel4: {
                ox: 'Mg → <span class="text-slate-300 font-bold">Mg²⁺ + 2e⁻</span>', oxMul: '(Balance: 2Mg → <span class="text-slate-300 font-bold">2Mg²⁺ + 4e⁻</span>)',
                red: '<span class="text-red-400 font-bold">O₂ + 4e⁻</span> → 2O²⁻', redMul: ''
            },
            panel5: {
                ox: '<span class="font-bold text-red-400">O<sub class="text-[8px]">2</sub></span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>',
                red: '<span class="font-bold text-slate-300">Mg</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>'
            },
            panel7: {
                desc: '',
                lost: '4 e⁻', gained: '4 e⁻', lostTextCls: 'text-slate-400 font-bold text-lg', gainedTextCls: 'text-red-500 font-bold text-lg'
            },
            btnStyle: { bg: 'bg-slate-900', border: 'border-slate-500' }
        },
        'cu-cl2': {
            id: 'cu-cl2',
            left: {
                symbol: 'Cu', coreSymbolAfter: 'Cu⁺',
                titleBefore: 'Cobre', titleAfter: 'Ion de Cobre',
                stateStart: '0', stateEnd: '+1', shells: [2, 8, 18], staticElectrons: [],
                elColor: '#cbd5e1', elStroke: '#94a3b8', bgColor: '#94a3b8',
                coreColorStart: 'bg-orange-600/80', coreColorEnd: 'bg-orange-500',
                atomBorderStart: 'border-slate-500', atomBorderEnd: 'border-orange-500/50',
                stateColorStart: 'text-orange-300', stateColorEnd: 'text-orange-300',
                descBefore: 'Cu tiene 1 electrón de valencia', descAfter: 'Cu⁺ perdió 1 electrón'
            },
            right: {
                symbolBefore: 'Cl₂', symbolAfter: 'Cl⁻',
                coreSymbolBefore: 'Cl', coreSymbolAfter: 'Cl⁻',
                titleBefore: 'Átomo de Cloro (de Cl₂)', titleAfter: 'Ion Cloruro',
                stateStart: '0', stateEnd: '-1', shells: [2, 8], staticElectrons: [-45, 0, 45, 90, 135, 180, 225],
                elColor: '#86efac', elStroke: '#22c55e', bgColor: '#22c55e',
                coreColorStart: 'bg-green-600/30', coreColorEnd: 'bg-green-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-green-500/50',
                stateColorStart: 'text-green-400', stateColorEnd: 'text-green-400',
                descBefore: 'Cl le falta 1 electrón para ser estable', descAfter: 'Cl⁻ ganó 1 electrón'
            },
            eq: {
                l1Name: '2Cu', l1State: '0', l1Color: 'text-orange-300',
                l2Name: 'Cl₂', l2State: '0', l2Color: 'text-green-400',
                r1Name: '2Cu', r1State: '+1', r1Color: 'text-orange-400',
                r2Name: '2Cl', r2State: '-1', r2Color: 'text-green-500',
                showPlusRight: false
            },
            transfer: [
                { startR: 48, endR: 48, angle: -Math.PI / 2, endIdx: 2 }
            ],
            panel3: {
                lTitle: 'COBRE', lDesc: 'Pierde 1 electrón (por átomo)', lType: 'Se oxida', lTypeColor: 'text-orange-400',
                rTitle: 'CLORO', rDesc: 'Gana 1 electrón (por átomo)', rType: 'Se reduce', rTypeColor: 'text-green-400'
            },
            panel4: {
                ox: '2Cu⁰ → <span class="text-orange-400 font-bold">2Cu⁺ + 2e⁻</span>', oxMul: '(Cu⁰ → Cu⁺ + 1e⁻)',
                red: '<span class="text-green-400 font-bold">Cl₂⁰ + 2e⁻</span> → 2Cl⁻', redMul: ''
            },
            panel5: {
                ox: '<span class="font-bold text-green-400">Cl₂</span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>',
                red: '<span class="font-bold text-orange-400">Cu</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>'
            },
            panel7: {
                desc: '2 e⁻ transferidos en total',
                lost: '2', lostTextCls: 'text-orange-400 font-mono text-2xl md:text-3xl font-bold',
                gained: '2', gainedTextCls: 'text-green-400 font-mono text-2xl md:text-3xl font-bold'
            },
            btnStyle: { bg: 'bg-slate-900', border: 'border-orange-500/50' }
        },
        'mg-f2': {
            id: 'mg-f2',
            left: {
                symbol: 'Mg', coreSymbolAfter: 'Mg²⁺',
                titleBefore: 'Magnesio', titleAfter: 'Ion de Magnesio',
                stateStart: '0', stateEnd: '+2', shells: [2, 8], staticElectrons: [],
                elColor: '#cbd5e1', elStroke: '#94a3b8', bgColor: '#94a3b8',
                coreColorStart: 'bg-slate-700/80', coreColorEnd: 'bg-slate-500',
                atomBorderStart: 'border-slate-500', atomBorderEnd: 'border-slate-400/50',
                stateColorStart: 'text-slate-300', stateColorEnd: 'text-slate-300',
                descBefore: 'Mg tiene 2 electrones de valencia', descAfter: 'Mg²⁺ perdió 2 electrones'
            },
            right: {
                symbolBefore: 'F₂', symbolAfter: 'F⁻',
                coreSymbolBefore: 'F', coreSymbolAfter: 'F⁻',
                titleBefore: 'Átomo de Flúor (de F₂)', titleAfter: 'Ion Fluoruro',
                stateStart: '0', stateEnd: '-1', shells: [2], staticElectrons: [-45, 0, 45, 90, 135, 180, 225],
                elColor: '#fde047', elStroke: '#eab308', bgColor: '#eab308',
                coreColorStart: 'bg-yellow-600/30', coreColorEnd: 'bg-yellow-500',
                atomBorderStart: 'border-slate-600', atomBorderEnd: 'border-yellow-500/50',
                stateColorStart: 'text-yellow-400', stateColorEnd: 'text-yellow-400',
                descBefore: 'A cada F le falta 1 electrón para ser estable', descAfter: 'F⁻ ganó 1 electrón'
            },
            eq: {
                l1Name: 'Mg', l1State: '0', l1Color: 'text-slate-300',
                l2Name: 'F₂', l2State: '0', l2Color: 'text-yellow-400',
                r1Name: 'Mg', r1State: '+2', r1Color: 'text-slate-400',
                r2Name: '2F', r2State: '-1', r2Color: 'text-yellow-500',
                showPlusRight: false
            },
            transfer: [
                { targetId: 'atom-2', startR: 48, endR: 48, startAngle: -Math.PI / 4, angle: -Math.PI / 2, endIdx: 1 },
                { targetId: 'atom-3', startR: 48, endR: 48, startAngle: Math.PI + Math.PI / 4, angle: -Math.PI / 2, endIdx: 1 }
            ],
            panel3: {
                lTitle: 'MAGNESIO', lDesc: 'Pierde 2 electrones', lType: 'Se oxida', lTypeColor: 'text-slate-300',
                rTitle: 'FLÚOR', rDesc: 'Gana 1 electrón (por átomo)', rType: 'Se reduce', rTypeColor: 'text-yellow-400'
            },
            panel4: {
                ox: 'Mg⁰ → <span class="text-slate-400 font-bold">Mg²⁺ + 2e⁻</span>', oxMul: '',
                red: '<span class="text-yellow-400 font-bold">F₂⁰ + 2e⁻</span> → 2F⁻', redMul: ''
            },
            panel5: {
                ox: '<span class="font-bold text-yellow-400">F₂</span> <span class="text-slate-500 text-[10px] font-sans">(se reduce)</span>',
                red: '<span class="font-bold text-slate-400">Mg</span> <span class="text-slate-500 text-[10px] font-sans">(se oxida)</span>'
            },
            panel7: {
                desc: '2 e⁻ transferidos en total',
                lost: '2', lostTextCls: 'text-slate-300 font-mono text-2xl md:text-3xl font-bold',
                gained: '2', gainedTextCls: 'text-yellow-400 font-mono text-2xl md:text-3xl font-bold'
            },
            btnStyle: { bg: 'bg-slate-900', border: 'border-yellow-500/50' }
        }
    };

    // Helper para marcar los pasos
    const setActiveStep = (stepNumber) => {
        for (let i = 1; i <= 7; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            if (stepEl) stepEl.className = "px-2 py-1 text-slate-400 rounded-full font-sans font-medium transition-colors duration-500";
        }
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) targetStep.className = "px-3 py-1 bg-indigo-600 text-white rounded-full font-sans font-medium transition-colors duration-500";
    };

    // Helper para revelar paneles
    const revealPanel = (panelId) => {
        const placeholder = document.getElementById(`${panelId}-placeholder`);
        const content = document.getElementById(`${panelId}-content`);
        if (placeholder && content) {
            placeholder.style.opacity = '0';
            setTimeout(() => {
                placeholder.style.display = 'none';
                content.style.opacity = '1';
            }, 500);
        }
    };

    const createSpark = (container, sourceRect, isTrailing) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "40";

        const containerRect = container.getBoundingClientRect();
        const x1 = sourceRect.left - containerRect.left + sourceRect.width / 2;
        const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;

        const angle = isTrailing ? (Math.PI - 0.5 + Math.random()) : (Math.random() * Math.PI * 2);
        const distance = 15 + Math.random() * 30;
        const x2 = x1 + Math.cos(angle) * distance;
        const y2 = y1 + Math.sin(angle) * distance;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let d = `M ${x1} ${y1} `;

        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
        d += `L ${midX} ${midY} L ${x2} ${y2}`;

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#c084fc");
        path.setAttribute("stroke-width", "2");
        path.style.filter = "drop-shadow(0 0 4px #a855f7)";

        svg.appendChild(path);
        container.appendChild(svg);
        return svg;
    };

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes electron-spark {
            0% { box-shadow: 0 0 10px 4px #60a5fa, 0 0 20px 8px #3b82f6; background-color: #ffffff; }
            100% { box-shadow: 0 0 15px 8px #93c5fd, 0 0 30px 12px #2563eb; background-color: #bfdbfe; }
        }
        .electrified {
            animation: electron-spark 0.05s infinite alternate !important;
            z-index: 100 !important;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
        }
        .spin-slow {
            animation: spin 15s linear infinite;
        }
        .spin-slow-reverse {
            animation: spin-reverse 20s linear infinite;
        }
    `;
    document.head.appendChild(style);

    let currentReaction = '';
    let currentAnimFrame = null;
    let currentSparkInterval = null;
    let currentTimeout = null;

    const createBohrBackground = (innerShells, staticValenceElectrons, color, elColor, elStroke) => {
        let svg = `<svg viewBox="-50 -50 100 100" class="absolute inset-0 w-full h-full pointer-events-none z-0">`;
        const totalShells = innerShells.length;
        const step = 22 / Math.max(1, totalShells);

        innerShells.forEach((count, idx) => {
            const r = 24 + step * idx;
            svg += `<circle r="${r}" fill="none" stroke="${color}" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.6" />`;
            const spinClass = idx % 2 === 0 ? 'spin-slow' : 'spin-slow-reverse';
            svg += `<g class="${spinClass}" style="transform-origin: 0px 0px;">`;
            let maxElectrons = count;
            if (count === 17 && idx === 2) maxElectrons = 18;
            if (count === 6 && idx === 1) maxElectrons = 8; // Oxígeno: capa de 8 pero tiene 6
            if (count === 7 && idx === 2) maxElectrons = 8; // Cloro: capa de 8 pero tiene 7

            for (let i = 0; i < maxElectrons; i++) {
                if (count === 17 && idx === 2 && i === 0) continue; // Hueco en i=0
                if (count === 6 && idx === 1 && (i === 0 || i === 7)) continue; // Huecos en i=0 (0rad) y i=7 (-PI/4 rad)
                if (count === 7 && idx === 2 && i === 7) continue; // Hueco en i=7 (-PI/4 rad)

                let angle = (Math.PI * 2 / maxElectrons) * i;
                if (count === 17 && idx === 2) angle -= Math.PI / 4; // Rota para que el hueco quede en -PI/4

                const cx = r * Math.cos(angle);
                const cy = r * Math.sin(angle);
                svg += `<circle cx="${cx}" cy="${cy}" r="1.5" fill="${elColor}" stroke="${elStroke}" stroke-width="0.5" />`;
            }
            svg += `</g>`;
        });

        if (staticValenceElectrons && staticValenceElectrons.length > 0) {
            const r = 48;
            const spinClass = totalShells % 2 === 0 ? 'spin-slow' : 'spin-slow-reverse';
            svg += `<g class="${spinClass}" style="transform-origin: 0px 0px;">`;
            staticValenceElectrons.forEach(angleDeg => {
                const angle = angleDeg * Math.PI / 180;
                const cx = r * Math.cos(angle);
                const cy = r * Math.sin(angle);
                svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="${elColor}" stroke="${elStroke}" stroke-width="0.5" />`;
            });
            svg += `</g>`;
        }
        svg += `</svg>`;
        return svg;
    };

    const injectBohrBg = (containerId, svgHtml) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const oldSvg = container.querySelector('svg');
        if (oldSvg) oldSvg.remove();
        container.insertAdjacentHTML('afterbegin', svgHtml);
    };

    const resetUI = () => {
        if (currentAnimFrame) cancelAnimationFrame(currentAnimFrame);
        if (currentSparkInterval) clearInterval(currentSparkInterval);
        if (currentTimeout) clearTimeout(currentTimeout);
        currentAnimFrame = null;
        currentSparkInterval = null;
        currentTimeout = null;
        
        reaccionIniciada = false;
        btnIniciar.disabled = false;
        btnIniciar.classList.remove('opacity-50', 'cursor-not-allowed');
        btnIniciar.innerHTML = `
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            INICIAR REACCIÓN
        `;

        for (let i = 3; i <= 7; i++) {
            const placeholder = document.getElementById(`panel${i}-placeholder`);
            const content = document.getElementById(`panel${i}-content`);
            if (placeholder && content) {
                placeholder.style.display = 'flex';
                placeholder.style.opacity = '1';
                content.style.opacity = '0';
            }
        }

        setActiveStep(1);
    };

    const setReaction = (reactionId) => {
        if (currentReaction === reactionId && !reaccionIniciada) return;

        resetUI();
        currentReaction = reactionId;
        const data = REACTIONS_CATALOG[reactionId];

        // Panel 1: Botones
        const buttonsInfo = [
            { id: 'zn', reactId: 'zn-cu', iconId: 'icon-zn', iconColor: 'bg-blue-500/20 text-blue-400' },
            { id: 'na', reactId: 'na-cl', iconId: 'icon-na', iconColor: 'bg-green-500/20 text-green-400' },
            { id: 'fe-cu', reactId: 'fe-cu', iconId: 'icon-fe', iconColor: 'bg-amber-500/20 text-amber-400' },
            { id: 'mg-o2', reactId: 'mg-o2', iconId: 'icon-mg', iconColor: 'bg-slate-500/20 text-slate-300' },
            { id: 'cu-cl2', reactId: 'cu-cl2', iconId: 'icon-cu-cl2', iconColor: 'bg-orange-500/20 text-orange-400' },
            { id: 'mg-f2', reactId: 'mg-f2', iconId: 'icon-mg-f2', iconColor: 'bg-yellow-500/20 text-yellow-400' }
        ];

        buttonsInfo.forEach(info => {
            const btn = document.getElementById(`btn-react-${info.id}`);
            const icon = document.getElementById(info.iconId);
            if (!btn) return;
            
            if (info.reactId === reactionId) {
                btn.className = `flex items-center justify-between p-2.5 rounded transition text-left ${data.btnStyle.bg} border ${data.btnStyle.border}`;
                if (icon) icon.className = `w-6 h-6 rounded flex items-center justify-center shrink-0 ${info.iconColor}`;
            } else {
                btn.className = `flex items-center justify-between p-2.5 bg-slate-900 border border-slate-700 rounded hover:bg-slate-800 transition text-left`;
                if (icon) icon.className = `w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-slate-400 shrink-0`;
            }
        });

        // Panel 2: Ecuación
        document.getElementById('eq-l1-name').innerText = data.eq.l1Name;
        document.getElementById('eq-l1-state').innerText = data.eq.l1State;
        document.getElementById('eq-l1-state').className = `${data.eq.l1Color} text-[11px] font-bold mb-1 transition-colors duration-1000`;

        document.getElementById('eq-l2-name').innerText = data.eq.l2Name;
        document.getElementById('eq-l2-state').innerText = data.eq.l2State;
        document.getElementById('eq-l2-state').className = `${data.eq.l2Color} text-[11px] font-bold mb-1 transition-colors duration-1000`;

        document.getElementById('eq-r1-name').innerText = data.eq.r1Name;
        document.getElementById('eq-r1-state').innerText = data.eq.r1State;
        document.getElementById('eq-r1-state').className = `${data.eq.r1Color} text-[11px] font-bold mb-1 transition-colors duration-1000`;

        document.getElementById('eq-r2-name').innerText = data.eq.r2Name;
        document.getElementById('eq-r2-state').innerText = data.eq.r2State;
        document.getElementById('eq-r2-state').className = `${data.eq.r2Color} text-[11px] font-bold mb-1 transition-colors duration-1000`;

        document.getElementById('eq-plus-right').style.display = data.eq.showPlusRight ? 'inline' : 'none';
        document.getElementById('right-side-eq').className = data.eq.showPlusRight ? 'flex items-end gap-2 md:gap-6' : 'flex items-end gap-0';

        // Panel 2: Atomos de Bohr
        document.getElementById('lbl-1-title').innerText = data.left.titleBefore;
        document.getElementById('core-1').innerText = data.left.symbol;
        document.getElementById('core-1').className = `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-1000 z-10 ${data.left.coreColorStart}`;
        document.getElementById('lbl-1-state').innerText = data.left.stateStart;
        document.getElementById('lbl-1-state').className = `mt-4 font-bold text-lg transition-colors duration-1000 ${data.left.stateColorStart}`;
        const atom1 = document.getElementById('atom-1');
        const b1 = data.left.hideBorder ? 'border-0' : 'border border-dashed';
        atom1.className = `w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full ${b1} flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000 ${data.left.atomBorderStart}`;

        document.getElementById('lbl-2-title').innerText = data.right.titleBefore;
        document.getElementById('core-2').innerText = data.right.coreSymbolBefore;
        document.getElementById('core-2').className = `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-1000 z-10 ${data.right.coreColorStart}`;
        document.getElementById('lbl-2-state').innerText = data.right.stateStart;
        document.getElementById('lbl-2-state').className = `mt-4 font-bold text-lg transition-colors duration-1000 ${data.right.stateColorStart}`;
        const atom2 = document.getElementById('atom-2');
        const b2 = data.right.hideBorder ? 'border-0' : 'border border-dashed';
        atom2.className = `w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full ${b2} flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000 ${data.right.atomBorderStart}`;

        const atom3 = document.getElementById('atom-3');
        if (reactionId === 'mg-f2') {
            atom3.classList.remove('hidden');
            document.getElementById('core-3').innerText = data.right.coreSymbolBefore;
            document.getElementById('core-3').className = `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-1000 z-10 ${data.right.coreColorStart}`;
            atom3.className = `w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full ${b2} flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000 ${data.right.atomBorderStart}`;
        } else {
            if (atom3) atom3.className = 'hidden';
        }

        const bg1 = createBohrBackground(data.left.shells, data.left.staticElectrons, data.left.bgColor, data.left.elColor, data.left.elStroke);
        const bg2 = createBohrBackground(data.right.shells, data.right.staticElectrons, data.right.bgColor, data.right.elColor, data.right.elStroke);
        injectBohrBg('atom-1', bg1);
        injectBohrBg('atom-2', bg2);
        if (reactionId === 'mg-f2') {
            injectBohrBg('atom-3', bg2);
        }

        injectBohrBg('p6-l-atom-before', bg1);
        injectBohrBg('p6-r-atom-before', bg2);
        injectBohrBg('p6-l-atom-after', bg1);
        injectBohrBg('p6-r-atom-after', bg2);

        // Limpiar elementos de transferencia previos de todo el DOM
        document.querySelectorAll('.transfer-wrapper, .transfer-electron, .transfer-hole, .p6-transfer-electron').forEach(el => el.remove());

        for (let i = 0; i < data.transfer.length; i++) {
            const t = data.transfer[i];

            // Origen rotatorio
            const startSpinClass = data.left.shells.length % 2 === 0 ? 'spin-slow' : 'spin-slow-reverse';
            const eWrapper = document.createElement('div');
            eWrapper.className = `transfer-wrapper absolute inset-0 w-full h-full pointer-events-none ${startSpinClass}`;
            atom1.appendChild(eWrapper);

            const e = document.createElement('div');
            e.className = `transfer-electron absolute rounded-full z-50 transition-all duration-1000 ease-in-out`;
            e.style.backgroundColor = data.left.elColor;
            e.style.width = '12px';
            e.style.height = '12px';
            e.style.boxShadow = '0 0 8px rgba(255,255,255,0.8)';
            e.id = `electron-${i + 1}`;
            const sAngle = t.startAngle !== undefined ? t.startAngle : t.angle;
            const startLeft = (t.startR * Math.cos(sAngle)).toFixed(2);
            const startTop = (t.startR * Math.sin(sAngle)).toFixed(2);
            e.style.left = `${50 + parseFloat(startLeft)}%`;
            e.style.top = `${50 + parseFloat(startTop)}%`;
            e.style.transform = 'translate(-50%, -50%)';
            eWrapper.appendChild(e);

            // Destino rotatorio (sincronizado con el SVG)
            const targetId = t.targetId || 'atom-2';
            const targetAtom = document.getElementById(targetId);

            const endSpinClass = t.endIdx % 2 === 0 ? 'spin-slow' : 'spin-slow-reverse';
            const hWrapper = document.createElement('div');
            hWrapper.className = `transfer-wrapper absolute inset-0 w-full h-full pointer-events-none ${endSpinClass}`;
            hWrapper.id = `hWrapper-${i + 1}`;
            targetAtom.appendChild(hWrapper);

            const h = document.createElement('div');
            h.className = `transfer-hole absolute border border-slate-400 rounded-full z-50 transition-opacity duration-1000`;
            h.style.width = '12px';
            h.style.height = '12px';
            h.id = `hole-${i + 1}`;
            const hLeft = (t.endR * Math.cos(t.angle)).toFixed(2);
            const hTop = (t.endR * Math.sin(t.angle)).toFixed(2);
            h.style.left = `${50 + parseFloat(hLeft)}%`;
            h.style.top = `${50 + parseFloat(hTop)}%`;
            h.style.transform = 'translate(-50%, -50%)';
            hWrapper.appendChild(h);

            // Panel 6 origen
            const p6wrapper1 = document.createElement('div');
            p6wrapper1.className = `transfer-wrapper absolute inset-0 w-full h-full pointer-events-none ${startSpinClass}`;
            document.getElementById('p6-l-atom-before').appendChild(p6wrapper1);

            const p6e = document.createElement('div');
            p6e.className = `p6-transfer-electron absolute rounded-full`;
            p6e.style.width = '8px';
            p6e.style.height = '8px';
            p6e.style.backgroundColor = data.left.elColor;
            const sAngle2 = t.startAngle !== undefined ? t.startAngle : t.angle;
            p6e.style.left = `${50 + parseFloat((t.startR * Math.cos(sAngle2)).toFixed(2))}%`;
            p6e.style.top = `${50 + parseFloat((t.startR * Math.sin(sAngle2)).toFixed(2))}%`;
            p6e.style.transform = 'translate(-50%, -50%)';
            p6wrapper1.appendChild(p6e);

            // Panel 6 destino rotatorio
            const p6wrapper2 = document.createElement('div');
            p6wrapper2.className = `transfer-wrapper absolute inset-0 w-full h-full pointer-events-none ${endSpinClass}`;
            document.getElementById('p6-r-atom-after').appendChild(p6wrapper2);

            const p6e2 = document.createElement('div');
            p6e2.className = `p6-transfer-electron absolute rounded-full hidden`;
            p6e2.style.width = '8px';
            p6e2.style.height = '8px';
            p6e2.style.backgroundColor = data.left.elColor;
            const p6endLeft = (t.endR * Math.cos(t.angle)).toFixed(2);
            const p6endTop = (t.endR * Math.sin(t.angle)).toFixed(2);
            p6e2.style.left = `${50 + parseFloat(p6endLeft)}%`;
            p6e2.style.top = `${50 + parseFloat(p6endTop)}%`;
            p6e2.style.transform = 'translate(-50%, -50%)';
            p6wrapper2.appendChild(p6e2);
        }

        // Panel 3
        document.getElementById('p3-l-title').innerText = data.panel3.lTitle;
        document.getElementById('p3-l-start').innerText = data.left.stateStart;
        document.getElementById('p3-l-end').innerText = data.left.stateEnd;
        document.getElementById('p3-l-end').className = data.panel3.lTypeColor;
        document.getElementById('p3-l-desc').innerText = data.panel3.lDesc;
        document.getElementById('p3-l-type').className = `text-xs font-semibold mt-1.5 ${data.panel3.lTypeColor}`;
        document.getElementById('p3-l-type').innerText = data.panel3.lType;

        document.getElementById('p3-r-title').innerText = data.panel3.rTitle;
        document.getElementById('p3-r-start').innerText = data.right.stateStart;
        document.getElementById('p3-r-start').className = 'text-slate-300';
        document.getElementById('p3-r-end').innerText = data.right.stateEnd;
        document.getElementById('p3-r-end').className = data.panel3.rTypeColor;
        document.getElementById('p3-r-desc').innerText = data.panel3.rDesc;
        document.getElementById('p3-r-type').className = `text-xs font-semibold mt-1.5 ${data.panel3.rTypeColor}`;
        document.getElementById('p3-r-type').innerText = data.panel3.rType;

        // Panel 4
        document.getElementById('p4-ox').innerHTML = data.panel4.ox;
        const p4oxmul = document.getElementById('p4-ox-mul');
        if (data.panel4.oxMul) { p4oxmul.innerHTML = data.panel4.oxMul; p4oxmul.classList.remove('hidden'); } else p4oxmul.classList.add('hidden');

        document.getElementById('p4-red').innerHTML = data.panel4.red;
        const p4redmul = document.getElementById('p4-red-mul');
        if (data.panel4.redMul) { p4redmul.innerHTML = data.panel4.redMul; p4redmul.classList.remove('hidden'); } else p4redmul.classList.add('hidden');

        // Panel 5
        document.getElementById('p5-ox').innerHTML = data.panel5.ox;
        document.getElementById('p5-red').innerHTML = data.panel5.red;

        // Panel 6 Textos
        document.getElementById('p6-l-title-before').innerText = data.left.titleBefore;
        document.getElementById('p6-l-core-before').innerText = data.left.symbol;
        document.getElementById('p6-l-core-before').className = `w-6 h-6 rounded-full shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white ${data.left.coreColorStart}`;

        document.getElementById('p6-r-title-before').innerText = data.right.titleBefore;
        document.getElementById('p6-r-core-before').innerText = data.right.coreSymbolBefore;
        document.getElementById('p6-r-core-before').className = `w-6 h-6 rounded-full shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white ${data.right.coreColorStart}`;

        document.getElementById('p6-l-title-after').innerText = data.left.titleAfter;
        document.getElementById('p6-l-core-after').innerText = data.left.symbol;

        document.getElementById('p6-r-title-after').innerText = data.right.titleAfter;
        document.getElementById('p6-r-core-after').innerText = data.right.coreSymbolAfter;

        document.getElementById('p6-desc-l-before').innerText = data.left.descBefore;
        document.getElementById('p6-desc-l-before').className = data.left.stateColorStart;
        document.getElementById('p6-desc-r-before').innerText = data.right.descBefore;
        document.getElementById('p6-desc-r-before').className = `${data.right.stateColorStart} mt-1`;

        document.getElementById('p6-desc-l-after').innerText = data.left.descAfter;
        document.getElementById('p6-desc-l-after').className = data.left.stateColorEnd;
        document.getElementById('p6-desc-r-after').innerText = data.right.descAfter;
        document.getElementById('p6-desc-r-after').className = `${data.right.stateColorEnd} mt-1`;

        // Panel 7
        const p7desc = document.getElementById('p7-desc');
        if (data.panel7.desc) { p7desc.innerHTML = data.panel7.desc; p7desc.style.display = 'block'; } else p7desc.style.display = 'none';

        document.getElementById('p7-lost').innerHTML = data.panel7.lost;
        document.getElementById('p7-lost').className = data.panel7.lostTextCls;
        document.getElementById('p7-gained').innerHTML = data.panel7.gained;
        document.getElementById('p7-gained').className = data.panel7.gainedTextCls;
    };

    // Configuración inicial
    setReaction('zn-cu');

    btnIniciar.addEventListener('click', () => {
        if (reaccionIniciada) return;
        reaccionIniciada = true;

        btnIniciar.disabled = true;
        btnIniciar.classList.add('opacity-50', 'cursor-not-allowed');
        btnIniciar.innerHTML = "REACCIÓN EN PROCESO...";

        setActiveStep(2);

        const data = REACTIONS_CATALOG[currentReaction];
        const container = document.getElementById('anim-container');
        const containerRect = container.getBoundingClientRect();

        // Preparar electrones (FLIP)
        for (let i = 1; i <= data.transfer.length; i++) {
            const eEl = document.getElementById(`electron-${i}`);
            if (eEl) {
                eEl.classList.add('electrified');
                const rectE = eEl.getBoundingClientRect();

                // Mover a anim-container
                container.appendChild(eEl);
                eEl.style.transition = 'none';
                eEl.style.left = `${rectE.left - containerRect.left + rectE.width / 2}px`;
                eEl.style.top = `${rectE.top - containerRect.top + rectE.height / 2}px`;
                eEl.style.transform = 'translate(-50%, -50%)';

                // Forzar reflow
                eEl.getBoundingClientRect();
            }
        }

        setTimeout(() => {
            document.getElementById('lbl-1-title').className = `mb-3 text-lg font-semibold text-slate-500 transition-colors duration-1000 text-center whitespace-nowrap`;
            document.getElementById('lbl-2-title').className = `mb-3 text-lg font-semibold text-slate-500 transition-colors duration-1000 text-center whitespace-nowrap`;
        }, 50);

        // Disparar animación hacia los huecos dinámicos usando rAF
        let startAnimTime = null;
        const animDuration = 1000;
        
        const movingElectrons = [];
        for (let i = 1; i <= data.transfer.length; i++) {
            const eEl = document.getElementById(`electron-${i}`);
            const hEl = document.getElementById(`hole-${i}`);
            if (eEl && hEl) movingElectrons.push({ eEl, hEl, i });
        }

        const animateFlight = (timestamp) => {
            if (!reaccionIniciada) return;
            if (!startAnimTime) startAnimTime = timestamp;
            let progress = (timestamp - startAnimTime) / animDuration;
            if (progress > 1) progress = 1;

            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

            movingElectrons.forEach(({ eEl, hEl }) => {
                if (eEl._startLeft === undefined) {
                    eEl._startLeft = parseFloat(eEl.style.left);
                    eEl._startTop = parseFloat(eEl.style.top);
                }

                const rectH = hEl.getBoundingClientRect();
                const currentContainerRect = container.getBoundingClientRect();
                const targetLeft = rectH.left - currentContainerRect.left + rectH.width / 2;
                const targetTop = rectH.top - currentContainerRect.top + rectH.height / 2;

                eEl.style.left = `${eEl._startLeft + (targetLeft - eEl._startLeft) * ease}px`;
                eEl.style.top = `${eEl._startTop + (targetTop - eEl._startTop) * ease}px`;
            });

            if (progress < 1) currentAnimFrame = requestAnimationFrame(animateFlight);
        };
        currentAnimFrame = requestAnimationFrame(animateFlight);

        currentSparkInterval = setInterval(() => {
            for (let i = 1; i <= data.transfer.length; i++) {
                const eEl = document.getElementById(`electron-${i}`);
                if (eEl) {
                    const rect = eEl.getBoundingClientRect();
                    for (let j = 0; j < 2; j++) {
                        const s = createSpark(container, rect, true);
                        setTimeout(() => { if (s && s.parentNode) s.remove(); }, 100);
                    }
                }
            }
        }, 50);

        currentTimeout = setTimeout(() => {
            clearInterval(currentSparkInterval);

            // Actualizar Left Atom (Panel 2)
            document.getElementById('core-1').className = `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-1000 z-10 ${data.left.coreColorEnd}`;
            document.getElementById('core-1').innerText = data.left.coreSymbolAfter;
            document.getElementById('atom-1').className = `w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full border border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000 ${data.left.atomBorderEnd}`;
            document.getElementById('lbl-1-title').innerText = data.left.titleAfter;
            document.getElementById('lbl-1-state').innerText = data.left.stateEnd;
            document.getElementById('lbl-1-state').className = `mt-4 font-bold text-lg transition-colors duration-1000 ${data.left.stateColorEnd}`;
            document.getElementById('eq-l1-state').className = `${data.left.stateColorEnd} text-[11px] font-bold mb-1 transition-colors duration-1000`;

            // Actualizar Right Atom (Panel 2)
            document.getElementById('core-2').className = `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-1000 z-10 ${data.right.coreColorEnd}`;
            document.getElementById('core-2').innerText = data.right.coreSymbolAfter;
            document.getElementById('atom-2').className = `w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full border border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000 ${data.right.atomBorderEnd}`;
            
            if (currentReaction === 'mg-f2') {
                const atom3 = document.getElementById('atom-3');
                document.getElementById('core-3').className = `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-1000 z-10 ${data.right.coreColorEnd}`;
                document.getElementById('core-3').innerText = data.right.coreSymbolAfter;
                atom3.className = `w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full border border-dashed flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-colors duration-1000 ${data.right.atomBorderEnd}`;
            }

            document.getElementById('lbl-2-title').innerText = data.right.titleAfter;
            document.getElementById('lbl-2-state').innerText = data.right.stateEnd;
            document.getElementById('lbl-2-state').className = `mt-4 font-bold text-lg transition-colors duration-1000 ${data.right.stateColorEnd}`;
            document.getElementById('eq-l2-state').className = `${data.right.stateColorEnd} text-[11px] font-bold mb-1 transition-colors duration-1000`;

            document.getElementById('eq-r1-state').className = `${data.eq.r1Color} text-[11px] font-bold mb-1 transition-colors duration-1000`;
            document.getElementById('eq-r1-name').className = `text-slate-200 transition-colors duration-1000`;

            document.getElementById('eq-r2-state').className = `${data.eq.r2Color} text-[11px] font-bold mb-1 transition-colors duration-1000`;
            document.getElementById('eq-r2-name').className = `text-slate-200 transition-colors duration-1000`;

            // Actualizar Panel 6 colores finales y electrones
            document.getElementById('p6-l-core-after').className = `w-6 h-6 rounded-full shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white ${data.left.coreColorEnd}`;
            document.getElementById('p6-r-core-after').className = `w-6 h-6 rounded-full shadow-inner z-10 flex items-center justify-center text-[8px] font-bold text-white ${data.right.coreColorEnd}`;

            document.getElementById('p6-r-atom-after').querySelectorAll('.p6-transfer-electron').forEach(el => el.classList.remove('hidden'));

            for (let i = 1; i <= data.transfer.length; i++) {
                const eEl = document.getElementById(`electron-${i}`);
                const hEl = document.getElementById(`hole-${i}`);
                if (eEl) eEl.classList.remove('electrified');
                if (hEl) hEl.style.opacity = '0';

                if (eEl) {
                    const t = data.transfer[i - 1];
                    const hWrapper = document.getElementById(`hWrapper-${i}`);
                    if (hWrapper) {
                        const freshE = document.createElement('div');
                        freshE.className = `absolute rounded-full z-50`;
                        freshE.style.width = '12px';
                        freshE.style.height = '12px';
                        freshE.style.boxShadow = '0 0 8px rgba(255,255,255,0.8)';
                        freshE.style.backgroundColor = data.right.elColor;
                        
                        const endLeft = (t.endR * Math.cos(t.angle)).toFixed(2);
                        const endTop = (t.endR * Math.sin(t.angle)).toFixed(2);
                        freshE.style.left = `${50 + parseFloat(endLeft)}%`;
                        freshE.style.top = `${50 + parseFloat(endTop)}%`;
                        freshE.style.transform = 'translate(-50%, -50%)';
                        
                        hWrapper.appendChild(freshE);
                        eEl.remove();
                    }
                }
            }

            currentTimeout = setTimeout(() => {
                setActiveStep(3);
                revealPanel('panel3');

                currentTimeout = setTimeout(() => {
                    setActiveStep(4);
                    revealPanel('panel4');

                    currentTimeout = setTimeout(() => {
                        setActiveStep(5);
                        revealPanel('panel5');

                        currentTimeout = setTimeout(() => {
                            setActiveStep(6);
                            revealPanel('panel6');

                            currentTimeout = setTimeout(() => {
                                setActiveStep(7);
                                revealPanel('panel7');

                                btnIniciar.innerHTML = "REACCIÓN COMPLETADA";
                            }, 1200);
                        }, 1200);
                    }, 1200);
                }, 1200);
            }, 1000);
        }, 1000);
    });

    document.getElementById('btn-react-zn')?.addEventListener('click', () => setReaction('zn-cu'));
    document.getElementById('btn-react-na')?.addEventListener('click', () => setReaction('na-cl'));
    document.getElementById('btn-react-fe-cu')?.addEventListener('click', () => setReaction('fe-cu'));
    document.getElementById('btn-react-mg-o2')?.addEventListener('click', () => setReaction('mg-o2'));
    document.getElementById('btn-react-cu-cl2')?.addEventListener('click', () => setReaction('cu-cl2'));
    document.getElementById('btn-react-mg-f2')?.addEventListener('click', () => setReaction('mg-f2'));

    // Configuración inicial
});
