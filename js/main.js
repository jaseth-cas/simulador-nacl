/**
 * Punto de entrada principal y Router Global del Simulador.
 */
class App {
    constructor() {
        this.currentModuleId = 0; // 0 = Dashboard
        this.currentSubmodule = 0;
        this.isPlaying = false;
        
        // Elementos DOM generales
        this.viewDashboard = document.getElementById('view-dashboard');
        this.viewSimulation = document.getElementById('view-simulation');
        this.btnHome = document.getElementById('btn-home');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.btnPlay = document.getElementById('btn-play');
        this.btnReset = document.getElementById('btn-reset');
        
        this.btnMod1 = document.getElementById('btn-mod-1');
        this.btnMod2 = document.getElementById('btn-mod-2');
        this.btnMod3 = document.getElementById('btn-mod-3');
        this.btnMod4 = document.getElementById('btn-mod-4');
        
        this.simTitle = document.getElementById('sim-title');
        this.simDesc = document.getElementById('sim-desc');
        this.svgLayer = document.getElementById('svg-layer');
        this.forcesLayer = document.getElementById('forces-layer');
        this.webglContainer = document.getElementById('webgl-wrapper');
        this.mod3Controls = document.getElementById('mod3-controls');
        
        this.iconPlay = document.getElementById('icon-play');
        this.iconPause = document.getElementById('icon-pause');
        this.btnPlayText = document.getElementById('btn-play-text');

        // Navigation
        this.currentApp = 'enlace'; // 'enlace' | 'redox'
        this.navEnlace = document.getElementById('nav-enlace');
        this.navRedox = document.getElementById('nav-redox');
        this.viewRedox = document.getElementById('view-redox');

        // Instanciar Módulos Disponibles
        this.modules = {
            1: window.Modulo1 ? new window.Modulo1(this) : null,
            2: window.Modulo2 ? new window.Modulo2(this) : null,
            3: window.Modulo3 ? new window.Modulo3(this) : null,
            4: window.Modulo4 ? new window.Modulo4(this) : null,
        };
        
        this.setupResponsiveScaler();
        this.bindEvents();
    }
    
    setupResponsiveScaler() {
        const renderArea = document.getElementById('render-area');
        if (!renderArea) return;
        
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.applyResponsiveScaling(entry.contentRect.width);
            }
        });
        
        // Guardar referencia para forzar update al cambiar de módulo
        this.responsiveObserver = observer;
        observer.observe(renderArea);
    }
    
    applyResponsiveScaling(width) {
        if (!width) {
            const renderArea = document.getElementById('render-area');
            if (renderArea) width = renderArea.clientWidth;
            else return;
        }
        
        const svgLayer = document.getElementById('svg-layer');
        const forcesContainer = document.getElementById('forces-container');
        const isMobile = width < 600;
        
        // SVG Layer: Ajustar viewBox de manera óptima por módulo para el máximo zoom
        if (svgLayer) {
            if (isMobile) {
                let viewBox = '150 0 700 600'; // Default mobile
                if (this.currentModuleId === 1 || this.currentModuleId === 2) {
                    viewBox = '200 0 600 600'; // Mod 1 & 2 can be zoomed in more
                } else if (this.currentModuleId === 3 || this.currentModuleId === 4) {
                    viewBox = '100 0 800 600'; // Mod 3 & 4 necesitan más espacio horizontal
                }
                svgLayer.setAttribute('viewBox', viewBox);
            } else {
                svgLayer.setAttribute('viewBox', '0 0 1000 600');
            }
        }
        
        // Forces Layer: Reducir drasticamente el width interno en móviles para acercar los iones
        if (forcesContainer) {
            const internalWidth = isMobile ? 550 : 1000;
            forcesContainer.style.width = `${internalWidth}px`;
            forcesContainer.style.height = '600px';
            
            const scale = width / internalWidth;
            forcesContainer.style.transform = `scale(${Math.min(1.2, scale)})`;
            forcesContainer.style.transformOrigin = 'center center';
        }
    }
    
    bindEvents() {
        this.navEnlace?.addEventListener('click', () => this.switchApp('enlace'));
        this.navRedox?.addEventListener('click', () => this.switchApp('redox'));
        
        this.btnHome?.addEventListener('click', () => this.goHome());
        
        this.btnPrev?.addEventListener('click', () => {
            if (this.currentSubmodule > 1) {
                this.openSubmodule(this.currentSubmodule - 1);
            }
        });
        
        this.btnNext?.addEventListener('click', () => {
            if (this.currentSubmodule < 4) {
                this.openSubmodule(this.currentSubmodule + 1);
            }
        });
        
        // Los botones del Dashboard abren cada Módulo respectivo
        this.btnMod1?.addEventListener('click', () => this.loadModule(1));
        this.btnMod2?.addEventListener('click', () => this.loadModule(2));
        this.btnMod3?.addEventListener('click', () => this.loadModule(3));
        this.btnMod4?.addEventListener('click', () => this.loadModule(4));
        
        this.btnPlay?.addEventListener('click', () => this.togglePlay());
        this.btnReset?.addEventListener('click', () => this.resetSimulation());
    }
    
    switchApp(appName) {
        this.currentApp = appName;
        
        if (appName === 'enlace') {
            this.navEnlace.classList.add('text-blue-400', 'font-semibold', 'border-blue-500');
            this.navEnlace.classList.remove('text-slate-400', 'hover:text-white', 'border-transparent');
            
            this.navRedox.classList.remove('text-blue-400', 'font-semibold', 'border-blue-500');
            this.navRedox.classList.add('text-slate-400', 'hover:text-white', 'border-transparent');
        } else {
            this.navRedox.classList.add('text-blue-400', 'font-semibold', 'border-blue-500');
            this.navRedox.classList.remove('text-slate-400', 'hover:text-white', 'border-transparent');
            
            this.navEnlace.classList.remove('text-blue-400', 'font-semibold', 'border-blue-500');
            this.navEnlace.classList.add('text-slate-400', 'hover:text-white', 'border-transparent');
            
            // Si nos vamos a redox, detenemos la simulación actual
            this.goHome();
        }
        
        this.updateUI();
    }

    goHome() {
        if (this.currentModuleId > 0 && this.modules[this.currentModuleId]) {
            this.modules[this.currentModuleId].clearLayers();
        }
        this.currentModuleId = 0;
        this.currentSubmodule = 0;
        this.isPlaying = false;
        this.updateUI();
        if (window.currentAnimationTimeout) clearTimeout(window.currentAnimationTimeout);
    }
    
    loadModule(moduleId) {
        if (!this.modules[moduleId]) {
            console.warn(`Módulo ${moduleId} no está implementado aún.`);
            return;
        }
        this.currentModuleId = moduleId;
        this.openSubmodule(1); // Iniciar siempre en la etapa 1
    }

    openSubmodule(subId) {
        if (subId < 1 || subId > 4) return;
        this.currentSubmodule = subId;
        this.isPlaying = false;
        this.updateUI();
        
        if (this.modules[this.currentModuleId]) {
            this.modules[this.currentModuleId].openSubmodule(subId);
        }
        
        // Forzar actualización del viewBox y escalas para el nuevo módulo
        this.applyResponsiveScaling();
    }
    
    togglePlay() {
        this.setPlayState(!this.isPlaying);
        if (this.isPlaying && this.modules[this.currentModuleId]) {
            this.modules[this.currentModuleId].play();
        }
    }
    
    resetSimulation() {
        this.setPlayState(false);
        if (this.modules[this.currentModuleId]) {
            this.modules[this.currentModuleId].reset();
        }
    }
    
    setPlayState(isPlaying) {
        this.isPlaying = isPlaying;
        if (isPlaying) {
            this.iconPlay?.classList.add('hidden');
            this.iconPause?.classList.remove('hidden');
            if (this.btnPlayText) this.btnPlayText.innerText = "Pausar";
        } else {
            this.iconPlay?.classList.remove('hidden');
            this.iconPause?.classList.add('hidden');
            if (this.btnPlayText) this.btnPlayText.innerText = "Reproducir";
        }
    }
    
    updateUI() {
        // App Switcher logic
        if (this.currentApp === 'redox') {
            this.viewDashboard.classList.add('hidden');
            this.viewDashboard.classList.remove('grid');
            this.viewSimulation.classList.add('hidden');
            this.viewSimulation.classList.remove('flex');
            this.btnHome.classList.add('hidden');
            
            this.viewRedox.classList.remove('hidden');
            this.viewRedox.classList.add('flex');
            return;
        } else {
            if (this.viewRedox) {
                this.viewRedox.classList.add('hidden');
                this.viewRedox.classList.remove('flex');
            }
        }

        if (this.currentModuleId === 0) {
            this.viewDashboard.classList.remove('hidden');
            this.viewDashboard.classList.add('grid');
            this.viewSimulation.classList.add('hidden');
            this.viewSimulation.classList.remove('flex');
            this.btnHome.classList.add('hidden');
        } else {
            this.viewDashboard.classList.add('hidden');
            this.viewDashboard.classList.remove('grid');
            this.viewSimulation.classList.remove('hidden');
            this.viewSimulation.classList.add('flex');
            this.btnHome.classList.remove('hidden');
            
            if (this.btnPrev) this.btnPrev.disabled = (this.currentSubmodule === 1);
            if (this.btnNext) this.btnNext.disabled = (this.currentSubmodule === 4);
        }
    }
}

// Inicializar la aplicación asegurando que el DOM esté listo
function initApp() {
    window.app = new App();
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
