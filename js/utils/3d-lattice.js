/**
 * Motor 3D reutilizable para las redes cristalinas iónicas.
 */
window.LatticeEngine = (function() {
    let THREE, OrbitControls;

    async function loadThree() {
        if (window.THREE && window.THREE.OrbitControls) {
            return { THREE: window.THREE, OrbitControls: window.THREE.OrbitControls };
        }
        
        const loadScript = (src) => new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        if (!window.THREE) {
            await loadScript('https://unpkg.com/three@0.128.0/build/three.min.js');
        }
        if (!window.THREE.OrbitControls) {
            await loadScript('https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js');
        }
        
        return { THREE: window.THREE, OrbitControls: window.THREE.OrbitControls };
    }

    class LatticeScene {
        constructor(config) {
            this.config = config; // { buildLattice1, buildLattice2, appModuleId }
            this.isInitialized = false;
            this.latticeGroup1 = null;
            this.latticeGroup2 = null;
            this.animationFrameId = null;
        }

        async init() {
            if (this.isInitialized) return;
            const { THREE: t, OrbitControls: oc } = await loadThree();
            this.THREE = t;
            this.OrbitControls = oc;

            const c1 = document.getElementById('webgl-container-1');
            const c2 = document.getElementById('webgl-container-2');
            if (!c1 || !c2) return;
            
            // Clean up previous canvas if any
            c1.innerHTML = '';
            c2.innerHTML = '';

            this.scene1 = new this.THREE.Scene();
            this.camera1 = new this.THREE.PerspectiveCamera(45, c1.clientWidth / c1.clientHeight, 0.1, 1000);
            this.camera1.position.set(7, 7, 11);
            this.renderer1 = new this.THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer1.setSize(c1.clientWidth, c1.clientHeight);
            this.renderer1.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            c1.appendChild(this.renderer1.domElement);
            
            this.controls1 = new this.OrbitControls(this.camera1, this.renderer1.domElement);
            this.controls1.enableDamping = true;
            this.controls1.autoRotate = true;
            this.controls1.autoRotateSpeed = 1.0;
            this.scene1.add(new this.THREE.AmbientLight(0xffffff, 0.6));
            const dl1 = new this.THREE.DirectionalLight(0xffffff, 1);
            dl1.position.set(10, 20, 10);
            this.scene1.add(dl1);

            this.scene2 = new this.THREE.Scene();
            this.camera2 = new this.THREE.PerspectiveCamera(45, c2.clientWidth / c2.clientHeight, 0.1, 1000);
            this.camera2.position.set(7, 7, 11);
            this.renderer2 = new this.THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer2.setSize(c2.clientWidth, c2.clientHeight);
            this.renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            c2.appendChild(this.renderer2.domElement);
            
            this.controls2 = new this.OrbitControls(this.camera2, this.renderer2.domElement);
            this.controls2.enableDamping = true;
            this.controls2.autoRotate = false;
            this.scene2.add(new this.THREE.AmbientLight(0xffffff, 0.6));
            const dl2 = new this.THREE.DirectionalLight(0xffffff, 1);
            dl2.position.set(10, 20, 10);
            this.scene2.add(dl2);

            this.controls1.addEventListener('change', () => {
                this.camera2.position.copy(this.camera1.position);
                this.camera2.rotation.copy(this.camera1.rotation);
            });
            this.controls2.addEventListener('change', () => {
                this.camera1.position.copy(this.camera2.position);
                this.camera1.rotation.copy(this.camera2.rotation);
            });

            this.latticeGroup1 = this.config.buildLattice1(this.THREE, this.scene1);
            this.latticeGroup2 = this.config.buildLattice2(this.THREE, this.scene2);
            
            const v1 = document.getElementById('mod4-view-1');
            const e2 = document.getElementById('btn-expand-2');
            if (this.config.appModuleId === 3) {
                if (v1) v1.classList.add('hidden');
                if (e2) e2.classList.add('hidden');
            } else {
                if (v1) v1.classList.remove('hidden');
                if (e2) e2.classList.remove('hidden');
            }
            
            this.onWindowResize = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.onWindowResize);
            
            this.resizeObserver = new ResizeObserver(() => {
                this.onWindowResize();
            });
            this.resizeObserver.observe(c1);
            this.resizeObserver.observe(c2);
            
            this.isInitialized = true;
            this.animate = this.animate.bind(this);
            this.animate();

            // Set up global fullscreen toggles
            window.toggleFullscreenMod4 = (viewId) => this.toggleFullscreenMod4(viewId);
            window.exitFullscreenMod4 = () => this.exitFullscreenMod4();
        }

        animate() {
            if (!this.isInitialized) return;
            this.animationFrameId = requestAnimationFrame(this.animate);
            this.controls1.update();
            
            const time = Date.now() * 0.005;
            
            if (this.latticeGroup1) {
                this.latticeGroup1.children.forEach((child, i) => {
                    if(child.userData.basePosition) {
                        child.position.y = child.userData.basePosition.y + Math.sin(time + i) * 0.05;
                    }
                });
            }
            if (this.latticeGroup2) {
                this.latticeGroup2.children.forEach((child, i) => {
                    if(child.userData.basePosition) {
                        child.position.y = child.userData.basePosition.y + Math.sin(time + i) * 0.05;
                    }
                });
            }
            
            this.renderer1.render(this.scene1, this.camera1);
            this.renderer2.render(this.scene2, this.camera2);
        }

        play(appInstance) {
            if (!this.latticeGroup1 || !this.latticeGroup2) return;
            const children1 = this.latticeGroup1.children;
            const children2 = this.latticeGroup2.children;
            
            children1.forEach(child => child.scale.set(0, 0, 0));
            children2.forEach(child => child.scale.set(0, 0, 0));
            
            const animateGroup = (children) => {
                let localDelay = 0;
                const sortedIndices = Array.from(children.keys()).sort((a, b) => {
                    const posA = children[a].position.lengthSq();
                    const posB = children[b].position.lengthSq();
                    return posA - posB;
                });
                
                sortedIndices.forEach((i) => {
                    setTimeout(() => {
                        let scale = 0;
                        const popIn = setInterval(() => {
                            scale += 0.1;
                            if (scale >= 1) {
                                children[i].scale.set(1, 1, 1);
                                clearInterval(popIn);
                            } else {
                                children[i].scale.set(scale, scale, scale);
                            }
                        }, 16);
                    }, localDelay);
                    localDelay += 20; // 20ms per atom pop
                });
                return localDelay;
            };

            const delay1 = animateGroup(children1);
            const delay2 = animateGroup(children2);
            const maxDelay = Math.max(delay1, delay2);
            
            setTimeout(() => {
                // Terminar la reproducción
                if (appInstance) {
                    appInstance.setPlayState(false);
                }
            }, maxDelay + 500);
        }

        reset() {
            if (this.latticeGroup1) this.latticeGroup1.children.forEach(child => child.scale.set(0, 0, 0));
            if (this.latticeGroup2) this.latticeGroup2.children.forEach(child => child.scale.set(0, 0, 0));
        }

        dispose() {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            this.isInitialized = false;
            window.removeEventListener('resize', this.onWindowResize);
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
            if (this.renderer1) this.renderer1.dispose();
            if (this.renderer2) this.renderer2.dispose();
        }

        onWindowResize() {
            if (!this.isInitialized) return;
            setTimeout(() => {
                const c1 = document.getElementById('webgl-container-1');
                const c2 = document.getElementById('webgl-container-2');
                if (c1 && c1.clientWidth > 0 && this.camera1) {
                    this.camera1.aspect = c1.clientWidth / c1.clientHeight;
                    this.camera1.updateProjectionMatrix();
                    this.renderer1.setSize(c1.clientWidth, c1.clientHeight);
                }
                if (c2 && c2.clientWidth > 0 && this.camera2) {
                    this.camera2.aspect = c2.clientWidth / c2.clientHeight;
                    this.camera2.updateProjectionMatrix();
                    this.renderer2.setSize(c2.clientWidth, c2.clientHeight);
                }
            }, 50);
        }

        toggleFullscreenMod4(viewId) {
            const el = document.getElementById(viewId);
            if (!el || el.classList.contains('fixed')) return;
            
            el.classList.remove('relative', 'flex-1');
            el.classList.add('fixed', 'inset-0', 'z-[55]', 'bg-slate-900', 'p-4', 'flex', 'items-center', 'justify-center');
            const backBtn = document.getElementById('btn-mod4-back');
            if (backBtn) backBtn.classList.remove('hidden');
            
            const e1 = document.getElementById('btn-expand-1');
            const e2 = document.getElementById('btn-expand-2');
            if (e1) e1.classList.add('hidden');
            if (e2) e2.classList.add('hidden');
            
            this.onWindowResize();
        }

        exitFullscreenMod4() {
            const v1 = document.getElementById('mod4-view-1');
            const v2 = document.getElementById('mod4-view-2');
            [v1, v2].forEach(el => {
                if (el) {
                    el.classList.add('relative', 'flex-1');
                    el.classList.remove('fixed', 'inset-0', 'z-[55]', 'bg-slate-900', 'p-4', 'flex', 'items-center', 'justify-center');
                }
            });
            const backBtn = document.getElementById('btn-mod4-back');
            if (backBtn) backBtn.classList.add('hidden');
            
            const e1 = document.getElementById('btn-expand-1');
            const e2 = document.getElementById('btn-expand-2');
            if (e1) e1.classList.remove('hidden');
            if (e2) e2.classList.remove('hidden');
            
            if (this.camera1 && this.controls1) {
                this.camera1.position.set(7, 7, 11);
                this.controls1.target.set(0, 0, 0);
                this.controls1.update();
            }
            if (this.camera2 && this.controls2) {
                this.camera2.position.set(7, 7, 11);
                this.controls2.target.set(0, 0, 0);
                this.controls2.update();
            }
            
            this.onWindowResize();
        }
    }

    return { LatticeScene };
})();
