/**
 * Orquestador principal del Módulo 4: Enlace Iónico en KBr
 */
window.Modulo4 = (function() {
    class Modulo4Class {
        constructor(parentApp) {
            this.app = parentApp;
            this.currentSubmodule = 0;
            if (window.AtraccionKbr) {
                window.AtraccionKbr.setupControls(this);
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

            if (window.RedIonicaKbr) window.RedIonicaKbr.dispose();
        }

        renderCurrentSubmodule() {
            this.clearLayers();
            this.app.setPlayState(false);
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);

            switch (this.currentSubmodule) {
                case 1:
                    this.app.simTitle.innerText = "Transferencia de Electrones en KBr";
                    this.app.simDesc.innerText = "Potasio (K) con capa de valencia en n=4 transfiere 1 electrón a Bromo (Br) también en n=4.";
                    this.app.svgLayer.classList.remove('hidden');
                    window.TransferenciaKbr.render();
                    break;
                case 2:
                    this.app.simTitle.innerText = "Formación de Iones (K⁺ y Br⁻)";
                    this.app.simDesc.innerText = "El catión K⁺ es isoelectrónico con Argón (Ar), y el anión Br⁻ es isoelectrónico con Criptón (Kr).";
                    this.app.svgLayer.classList.remove('hidden');
                    window.FormacionKbr.render();
                    break;
                case 3:
                    this.app.simTitle.innerText = "Atracción (+1 / -1) con Gran Radio";
                    this.app.simDesc.innerText = "La fuerza electrostática es proporcional a las cargas (+1 y -1) e inversamente proporcional al cuadrado de la distancia (que es grande por los radios iónicos).";
                    this.app.forcesLayer.classList.remove('hidden');
                    this.app.mod3Controls.classList.remove('hidden');
                    window.AtraccionKbr.render(this);
                    break;
                case 4:
                    this.app.simTitle.innerText = "Red Cristalina 3D del KBr";
                    this.app.simDesc.innerText = "Red cúbica centrada en las caras (FCC) similar al NaCl, pero con un espacio interiónico mayor.";
                    this.app.webglContainer.classList.remove('hidden');
                    window.RedIonicaKbr.init();
                    break;
            }
        }

        play() {
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaKbr.play(this); break;
                case 2: window.FormacionKbr.play(this); break;
                case 3: window.AtraccionKbr.play(this); break;
                case 4: window.RedIonicaKbr.play(this); break;
            }
        }

        reset() {
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaKbr.reset(); break;
                case 2: window.FormacionKbr.reset(); break;
                case 3: window.AtraccionKbr.reset(); break;
                case 4: window.RedIonicaKbr.reset(); break;
            }
        }

        setPlayState(isPlaying) {
            this.app.setPlayState(isPlaying);
        }
    }

    return Modulo4Class;
})();
