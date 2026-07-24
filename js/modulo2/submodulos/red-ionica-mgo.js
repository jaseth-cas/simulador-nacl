/**
 * Submódulo 4: Red Cristalina Iónica 3D (MgO)
 */
window.RedIonicaMgo = (function() {
    let latticeScene = null;
    let globalMgSpriteMat, globalOSpriteMat;

    function initSpriteMaterials(THREE) {
        if (globalMgSpriteMat) return;
        const cMg = document.createElement('canvas'); cMg.width = 128; cMg.height = 64;
        const ctxMg = cMg.getContext('2d');
        ctxMg.font = 'bold 44px sans-serif'; ctxMg.fillStyle = 'white'; ctxMg.textAlign = 'center'; ctxMg.textBaseline = 'middle';
        ctxMg.fillText('Mg²⁺', 64, 32);
        globalMgSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cMg), depthTest: false, transparent: true });

        const cO = document.createElement('canvas'); cO.width = 128; cO.height = 64;
        const ctxO = cO.getContext('2d');
        ctxO.font = 'bold 44px sans-serif'; ctxO.fillStyle = 'white'; ctxO.textAlign = 'center'; ctxO.textBaseline = 'middle';
        ctxO.fillText('O²⁻', 64, 32);
        globalOSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cO), depthTest: false, transparent: true });
    }

    function buildLattice1(THREE, scene) {
        const latticeGroup = new THREE.Group();
        const size = 4;
        const spacing = 1.3; // Mg and O are smaller/closer than NaCl
        const offset = (size * spacing) / 2 - (spacing / 2);
        
        const mgMaterial = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.2 }); // Orange
        const oMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.1 });  // Red
        
        // Mg²⁺ es más pequeño que Na⁺
        const mgGeo = new THREE.SphereGeometry(0.35, 32, 32);
        // O²⁻ es más grande que Mg²⁺, pero más pequeño que Cl⁻
        const oGeo = new THREE.SphereGeometry(0.65, 32, 32);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const isMg = (x + y + z) % 2 === 0;
                    const group = new THREE.Group();
                    group.position.set((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
                    group.userData.basePosition = group.position.clone();
                    
                    const mesh = new THREE.Mesh(isMg ? mgGeo : oGeo, isMg ? mgMaterial : oMaterial);
                    group.add(mesh);
                    
                    initSpriteMaterials(THREE);
                    const sprite = new THREE.Sprite(isMg ? globalMgSpriteMat : globalOSpriteMat);
                    sprite.scale.set(1.5, 0.75, 1);
                    sprite.position.set(0, 0, 0);
                    group.add(sprite);
                    
                    group.scale.set(0, 0, 0);
                    latticeGroup.add(group);
                }
            }
        }
        scene.add(latticeGroup);
        return latticeGroup;
    }

    function buildLattice2(THREE, scene) {
        const latticeGroup = new THREE.Group();
        const size = 4;
        const spacing = 1.3;
        const offset = (size * spacing) / 2 - (spacing / 2);
        
        const mgMaterial = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.2 });
        const oMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.1 });
        
        const mgGeo = new THREE.SphereGeometry(0.20, 32, 32);
        const oGeo = new THREE.SphereGeometry(0.30, 32, 32);
        
        const stickGeo = new THREE.CylinderGeometry(0.06, 0.06, spacing, 8); // Thicker sticks for stronger bond
        stickGeo.translate(0, spacing/2, 0);
        const stickMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const isMg = (x + y + z) % 2 === 0;
                    const group = new THREE.Group();
                    group.position.set((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
                    group.userData.basePosition = group.position.clone();
                    
                    const mesh = new THREE.Mesh(isMg ? mgGeo : oGeo, isMg ? mgMaterial : oMaterial);
                    group.add(mesh);
                    
                    initSpriteMaterials(THREE);
                    const sprite = new THREE.Sprite(isMg ? globalMgSpriteMat : globalOSpriteMat);
                    sprite.position.set(0, 0, 0);
                    sprite.scale.set(1.0, 0.5, 1);
                    group.add(sprite);

                    if (x < size - 1) {
                        const stickX = new THREE.Mesh(stickGeo, stickMaterial);
                        stickX.rotation.z = -Math.PI / 2;
                        group.add(stickX);
                    }
                    if (y < size - 1) {
                        const stickY = new THREE.Mesh(stickGeo, stickMaterial);
                        group.add(stickY);
                    }
                    if (z < size - 1) {
                        const stickZ = new THREE.Mesh(stickGeo, stickMaterial);
                        stickZ.rotation.x = Math.PI / 2;
                        group.add(stickZ);
                    }
                    
                    group.scale.set(0, 0, 0);
                    latticeGroup.add(group);
                }
            }
        }
        scene.add(latticeGroup);
        return latticeGroup;
    }

    function init() {
        if (!latticeScene) {
            latticeScene = new window.LatticeEngine.LatticeScene({
                appModuleId: 2,
                buildLattice1,
                buildLattice2
            });
        }
        latticeScene.init();
    }

    function play(appInstance) {
        if (latticeScene) latticeScene.play(appInstance);
    }

    function reset() {
        if (latticeScene) latticeScene.reset();
    }

    function dispose() {
        if (latticeScene) latticeScene.dispose();
        latticeScene = null;
    }

    return { init, play, reset, dispose };
})();
