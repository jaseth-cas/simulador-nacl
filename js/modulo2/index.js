/**
 * Orquestador principal del Módulo 2: Enlace Iónico en MgO
 */
window.Modulo2 = (function() {
    class Modulo2Class {
        constructor(parentApp) {
            this.app = parentApp;
            this.currentSubmodule = 0;
            if (window.AtraccionMgo) {
                window.AtraccionMgo.setupControls(this);
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

            if (window.RedIonicaMgo) window.RedIonicaMgo.dispose();
        }

        renderCurrentSubmodule() {
            this.clearLayers();
            this.app.setPlayState(false);
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);

            switch (this.currentSubmodule) {
                case 1:
                    this.app.simTitle.innerText = "Transferencia de Electrones en MgO";
                    this.app.simDesc.innerText = "El magnesio (Mg) transfiere sus dos electrones de valencia (capa n=3) a un átomo de oxígeno (O).";
                    this.app.svgLayer.classList.remove('hidden');
                    window.TransferenciaMgo.render();
                    break;
                case 2:
                    this.app.simTitle.innerText = "Formación de Iones (Mg²⁺ y O²⁻)";
                    this.app.simDesc.innerText = "Ambos alcanzan la configuración del Neón. El catión Mg²⁺ colapsa su capa de valencia original, y el anión O²⁻ completa su octeto.";
                    this.app.svgLayer.classList.remove('hidden');
                    window.FormacionMgo.render();
                    break;
                case 3:
                    this.app.simTitle.innerText = "Atracción Fuerte (+2 / -2)";
                    this.app.simDesc.innerText = "La fuerza de atracción electrostática es proporcional al producto de las cargas. Las cargas +2 y -2 generan una atracción mucho más intensa que en el NaCl.";
                    this.app.forcesLayer.classList.remove('hidden');
                    this.app.mod3Controls.classList.remove('hidden');
                    window.AtraccionMgo.render(this);
                    break;
                case 4:
                    this.app.simTitle.innerText = "Red Cristalina 3D del MgO";
                    this.app.simDesc.innerText = "Adopta una red cúbica centrada en las caras (tipo NaCl) pero con una energía reticular mucho mayor debido a las altas cargas y pequeños radios.";
                    this.app.webglContainer.classList.remove('hidden');
                    window.RedIonicaMgo.init();
                    break;
            }
        }

        play() {
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaMgo.play(this); break;
                case 2: window.FormacionMgo.play(this); break;
                case 3: window.AtraccionMgo.play(this); break;
                case 4: window.RedIonicaMgo.play(this); break;
            }
        }

        reset() {
            if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);
            switch (this.currentSubmodule) {
                case 1: window.TransferenciaMgo.reset(); break;
                case 2: window.FormacionMgo.reset(); break;
                case 3: window.AtraccionMgo.reset(); break;
                case 4: window.RedIonicaMgo.reset(); break;
            }
        }

        setPlayState(isPlaying) {
            this.app.setPlayState(isPlaying);
        }
    }

    return Modulo2Class;
})();
