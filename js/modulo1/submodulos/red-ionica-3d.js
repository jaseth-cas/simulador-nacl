/**
 * Submódulo 4: Red Cristalina Iónica 3D (NaCl)
 */
window.RedIonica3D = (function() {
    let latticeScene = null;
    let globalNaSpriteMat, globalClSpriteMat;

    function initSpriteMaterials(THREE) {
        if (globalNaSpriteMat) return;
        const cNa = document.createElement('canvas'); cNa.width = 128; cNa.height = 64;
        const ctxNa = cNa.getContext('2d');
        ctxNa.font = 'bold 44px sans-serif'; ctxNa.fillStyle = 'white'; ctxNa.textAlign = 'center'; ctxNa.textBaseline = 'middle';
        ctxNa.fillText('Na⁺', 64, 32);
        globalNaSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cNa), depthTest: false, transparent: true });

        const cCl = document.createElement('canvas'); cCl.width = 128; cCl.height = 64;
        const ctxCl = cCl.getContext('2d');
        ctxCl.font = 'bold 44px sans-serif'; ctxCl.fillStyle = 'white'; ctxCl.textAlign = 'center'; ctxCl.textBaseline = 'middle';
        ctxCl.fillText('Cl⁻', 64, 32);
        globalClSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cCl), depthTest: false, transparent: true });
    }

    function buildLattice1(THREE, scene) {
        const latticeGroup = new THREE.Group();
        const size = 4;
        const spacing = 1.5;
        const offset = (size * spacing) / 2 - (spacing / 2);
        
        const naMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.1 }); // Blue
        const clMaterial = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.1 });  // Green
        
        const naGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const clGeo = new THREE.SphereGeometry(0.7, 32, 32);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const isNa = (x + y + z) % 2 === 0;
                    const group = new THREE.Group();
                    group.position.set((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
                    group.userData.basePosition = group.position.clone();
                    
                    const mesh = new THREE.Mesh(isNa ? naGeo : clGeo, isNa ? naMaterial : clMaterial);
                    group.add(mesh);
                    
                    initSpriteMaterials(THREE);
                    const sprite = new THREE.Sprite(isNa ? globalNaSpriteMat : globalClSpriteMat);
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
        const spacing = 1.5;
        const offset = (size * spacing) / 2 - (spacing / 2);
        
        const naMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.1 });
        const clMaterial = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.1 });
        
        const naGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const clGeo = new THREE.SphereGeometry(0.35, 32, 32);
        
        const stickGeo = new THREE.CylinderGeometry(0.05, 0.05, spacing, 8);
        stickGeo.translate(0, spacing/2, 0);
        const stickMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const isNa = (x + y + z) % 2 === 0;
                    const group = new THREE.Group();
                    group.position.set((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
                    group.userData.basePosition = group.position.clone();
                    
                    const mesh = new THREE.Mesh(isNa ? naGeo : clGeo, isNa ? naMaterial : clMaterial);
                    group.add(mesh);
                    
                    initSpriteMaterials(THREE);
                    const sprite = new THREE.Sprite(isNa ? globalNaSpriteMat : globalClSpriteMat);
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
                appModuleId: 1,
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
