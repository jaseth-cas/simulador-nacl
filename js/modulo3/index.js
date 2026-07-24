/**
 * Orquestador principal del Módulo 3: Enlace Iónico en AlF₃
 */
window.Modulo3 = (function() {
    class Modulo3Class {
        constructor(parentApp) {
            this.app = parentApp;
            this.currentSubmodule = 0;
            if (window.AtraccionAlf3) {
                window.AtraccionAlf3.setupControls(this);
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

            if (window.RedIonicaAlf3) window.RedIonicaAlf3.dispose();
        }

        renderCurrentSubmodule() {
            this.clearLayers();
            this.app.setPlayState(false);
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);

            switch (this.currentSubmodule) {
                case 1:
                    this.app.simTitle.innerText = "Transferencia de Electrones en AlF₃";
                    this.app.simDesc.innerText = "El Aluminio (Al) transfiere sus 3 electrones de valencia. Como cada Flúor (F) solo necesita 1, se requieren 3 átomos de Flúor.";
                    this.app.svgLayer.classList.remove('hidden');
                    window.TransferenciaAlf3.render();
                    break;
                case 2:
                    this.app.simTitle.innerText = "Formación de Iones (Al³⁺ y 3 F⁻)";
                    this.app.simDesc.innerText = "Se forma un catión trivalente de Aluminio y tres aniones de Flúor. La carga neta total es cero (+3 + 3(-1) = 0).";
                    this.app.svgLayer.classList.remove('hidden');
                    window.FormacionAlf3.render();
                    break;
                case 3:
                    this.app.simTitle.innerText = "Fuerzas Multicanal";
                    this.app.simDesc.innerText = "El catión Al³⁺ interactúa electrostáticamente con los 3 aniones de Flúor simultáneamente.";
                    this.app.forcesLayer.classList.remove('hidden');
                    this.app.mod3Controls.classList.remove('hidden');
                    window.AtraccionAlf3.render(this);
                    break;
                case 4:
                    this.app.simTitle.innerText = "Red Cristalina 3D del AlF₃";
                    this.app.simDesc.innerText = "Estructura más compleja basada en octaedros compartiendo vértices, garantizando la estequiometría 1:3 en la red completa.";
                    this.app.webglContainer.classList.remove('hidden');
                    window.RedIonicaAlf3.init();
                    break;
            }
        }

        play() {
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaAlf3.play(this); break;
                case 2: window.FormacionAlf3.play(this); break;
                case 3: window.AtraccionAlf3.play(this); break;
                case 4: window.RedIonicaAlf3.play(this); break;
            }
        }

        reset() {
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaAlf3.reset(); break;
                case 2: window.FormacionAlf3.reset(); break;
                case 3: window.AtraccionAlf3.reset(); break;
                case 4: window.RedIonicaAlf3.reset(); break;
            }
        }

        setPlayState(isPlaying) {
            this.app.setPlayState(isPlaying);
        }
    }

    return Modulo3Class;
})();
