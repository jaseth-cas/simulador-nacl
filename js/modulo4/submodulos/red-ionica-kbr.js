/**
 * Submódulo 4: Red Cristalina Iónica 3D (KBr)
 */
window.RedIonicaKbr = (function() {
    let latticeScene = null;
    let globalKSpriteMat, globalBrSpriteMat;

    function initSpriteMaterials(THREE) {
        if (globalKSpriteMat) return;
        const cK = document.createElement('canvas'); cK.width = 128; cK.height = 64;
        const ctxK = cK.getContext('2d');
        ctxK.font = 'bold 44px sans-serif'; ctxK.fillStyle = 'white'; ctxK.textAlign = 'center'; ctxK.textBaseline = 'middle';
        ctxK.fillText('K⁺', 64, 32);
        globalKSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cK), depthTest: false, transparent: true });

        const cBr = document.createElement('canvas'); cBr.width = 128; cBr.height = 64;
        const ctxBr = cBr.getContext('2d');
        ctxBr.font = 'bold 44px sans-serif'; ctxBr.fillStyle = 'white'; ctxBr.textAlign = 'center'; ctxBr.textBaseline = 'middle';
        ctxBr.fillText('Br⁻', 64, 32);
        globalBrSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cBr), depthTest: false, transparent: true });
    }

    function buildLattice1(THREE, scene) {
        const latticeGroup = new THREE.Group();
        const size = 4; 
        const spacing = 1.5; 
        const offset = (size * spacing) / 2 - (spacing / 2);
        
        const kMaterial = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.1 }); // Yellow
        const brMaterial = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.3, metalness: 0.1 }); // Stone
        
        const kGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const brGeo = new THREE.SphereGeometry(0.7, 32, 32);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const isK = (x + y + z) % 2 === 0;
                    const group = new THREE.Group();
                    group.position.set((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
                    group.userData.basePosition = group.position.clone();
                    
                    const mesh = new THREE.Mesh(isK ? kGeo : brGeo, isK ? kMaterial : brMaterial);
                    group.add(mesh);
                    
                    initSpriteMaterials(THREE);
                    const sprite = new THREE.Sprite(isK ? globalKSpriteMat : globalBrSpriteMat);
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
        
        const kMaterial = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.1 });
        const brMaterial = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.3, metalness: 0.1 });
        
        const kGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const brGeo = new THREE.SphereGeometry(0.35, 32, 32);
        
        const stickGeo = new THREE.CylinderGeometry(0.05, 0.05, spacing, 8);
        stickGeo.translate(0, spacing/2, 0);
        const stickMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const isK = (x + y + z) % 2 === 0;
                    const group = new THREE.Group();
                    group.position.set((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
                    group.userData.basePosition = group.position.clone();
                    
                    const mesh = new THREE.Mesh(isK ? kGeo : brGeo, isK ? kMaterial : brMaterial);
                    group.add(mesh);
                    
                    initSpriteMaterials(THREE);
                    const sprite = new THREE.Sprite(isK ? globalKSpriteMat : globalBrSpriteMat);
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
                appModuleId: 4,
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
