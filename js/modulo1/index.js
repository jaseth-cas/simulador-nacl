/**
 * Orquestador principal del Módulo 1: Enlace Iónico (NaCl)
 */
window.Modulo1 = (function() {
    class Modulo1Class {
        constructor(parentApp) {
            this.app = parentApp;
            this.currentSubmodule = 0;
            if (window.AtraccionRepulsion) {
                window.AtraccionRepulsion.setupControls(this);
            }
        }

        openSubmodule(id) {
            if (id < 1 || id > 4) return;
            this.currentSubmodule = id;
            this.renderCurrentSubmodule();
        }

        clearLayers() {
            this.app.svgLayer.classList.add('hidden');
            this.app.forcesLayer.classList.add('hidden');
            this.app.webglContainer.classList.add('hidden');
            this.app.mod3Controls.classList.add('hidden');

            const svgContent = document.getElementById('svg-content');
            if (svgContent) svgContent.innerHTML = '';
            const forcesContainer = document.getElementById('forces-container');
            if (forcesContainer) forcesContainer.innerHTML = '';

            if (window.RedIonica3D) window.RedIonica3D.dispose();
        }

        renderCurrentSubmodule() {
            this.clearLayers();
            this.app.setPlayState(false);
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);

            switch (this.currentSubmodule) {
                case 1:
                    this.app.simTitle.innerText = "Transferencia de Electrones";
                    this.app.simDesc.innerText = "El sodio (Na) transfiere su electrón de valencia al cloro (Cl).";
                    this.app.svgLayer.classList.remove('hidden');
                    window.TransferenciaElectrones.render();
                    break;
                case 2:
                    this.app.simTitle.innerText = "Formación de Iones";
                    this.app.simDesc.innerText = "Tras la transferencia, el Na pierde su última capa y se reduce (Catión Na⁺). El Cl la completa y aumenta ligeramente (Anión Cl⁻).";
                    this.app.svgLayer.classList.remove('hidden');
                    window.FormacionIones.render();
                    break;
                case 3:
                    this.app.simTitle.innerText = "Atracción y Repulsión Electrostática";
                    this.app.simDesc.innerText = "Las cargas opuestas se atraen; las cargas iguales se repelen.";
                    this.app.forcesLayer.classList.remove('hidden');
                    this.app.mod3Controls.classList.remove('hidden');
                    window.AtraccionRepulsion.render(this);
                    break;
                case 4:
                    this.app.simTitle.innerText = "Sólido Iónico (Red Cristalina)";
                    this.app.simDesc.innerText = "Múltiples iones Na⁺ y Cl⁻ se organizan alternadamente formando una estructura cúbica tridimensional. No existen moléculas aisladas.";
                    this.app.webglContainer.classList.remove('hidden');
                    window.RedIonica3D.init();
                    break;
            }
        }

        play() {
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaElectrones.play(this); break;
                case 2: window.FormacionIones.play(this); break;
                case 3: window.AtraccionRepulsion.play(this); break;
                case 4: window.RedIonica3D.play(this); break;
            }
        }

        reset() {
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaElectrones.reset(); break;
                case 2: window.FormacionIones.reset(); break;
                case 3: window.AtraccionRepulsion.reset(); break;
                case 4: window.RedIonica3D.reset(); break;
            }
        }

        setPlayState(isPlaying) {
            this.app.setPlayState(isPlaying);
        }
    }

    return Modulo1Class;
})();
