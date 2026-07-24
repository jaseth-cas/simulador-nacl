/**
 * Submódulo 4: Red Cristalina Iónica 3D (AlF3 - Octaédrica)
 */
window.RedIonicaAlf3 = (function() {
    let latticeScene = null;
    let globalAlSpriteMat, globalFSpriteMat;

    function initSpriteMaterials(THREE) {
        if (globalAlSpriteMat) return;
        const cAl = document.createElement('canvas'); cAl.width = 128; cAl.height = 64;
        const ctxAl = cAl.getContext('2d');
        ctxAl.font = 'bold 44px sans-serif'; ctxAl.fillStyle = 'white'; ctxAl.textAlign = 'center'; ctxAl.textBaseline = 'middle';
        ctxAl.fillText('Al³⁺', 64, 32);
        globalAlSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cAl), depthTest: false, transparent: true });

        const cF = document.createElement('canvas'); cF.width = 128; cF.height = 64;
        const ctxF = cF.getContext('2d');
        ctxF.font = 'bold 44px sans-serif'; ctxF.fillStyle = 'white'; ctxF.textAlign = 'center'; ctxF.textBaseline = 'middle';
        ctxF.fillText('F⁻', 64, 32);
        globalFSpriteMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cF), depthTest: false, transparent: true });
    }

    // Helper para añadir un átomo al grupo
    function addAtom(THREE, group, type, x, y, z, alGeo, fGeo, alMat, fMat) {
        const atomGroup = new THREE.Group();
        atomGroup.position.set(x, y, z);
        atomGroup.userData.basePosition = atomGroup.position.clone();
        
        const isAl = type === 'Al';
        const mesh = new THREE.Mesh(isAl ? alGeo : fGeo, isAl ? alMat : fMat);
        atomGroup.add(mesh);
        
        const sprite = new THREE.Sprite(isAl ? globalAlSpriteMat : globalFSpriteMat);
        // Sprite text scaling fixed: make Al text same size or slightly smaller than F text
        sprite.scale.set(isAl ? 0.9 : 1.0, isAl ? 0.45 : 0.5, 1);
        sprite.position.set(0, 0, 0);
        atomGroup.add(sprite);
        
        atomGroup.scale.set(0, 0, 0);
        group.add(atomGroup);
    }

    function buildCubicLattice(THREE, scene, isModel2) {
        const latticeGroup = new THREE.Group();
        const spacing = 2.4;
        const half = spacing / 2;
        
        const alMaterial = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3, metalness: 0.2 }); // Purple
        const fMaterial = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.1 });  // Cyan
        
        const alScale = isModel2 ? 0.2 : 0.35;
        const fScale = isModel2 ? 0.35 : 0.55;
        const alGeo = new THREE.SphereGeometry(alScale, 32, 32);
        const fGeo = new THREE.SphereGeometry(fScale, 32, 32);
        
        initSpriteMaterials(THREE);

        const corners = [];
        const edges = [];

        // Corners (Al)
        for (let x of [-1, 1]) {
            for (let y of [-1, 1]) {
                for (let z of [-1, 1]) {
                    const pos = new THREE.Vector3(x * half, y * half, z * half);
                    corners.push(pos);
                    addAtom(THREE, latticeGroup, 'Al', pos.x, pos.y, pos.z, alGeo, fGeo, alMaterial, fMaterial);
                }
            }
        }

        // Edges (F)
        for (let i of [-1, 1]) {
            for (let j of [-1, 1]) {
                edges.push(new THREE.Vector3(0, i * half, j * half));
                edges.push(new THREE.Vector3(i * half, 0, j * half));
                edges.push(new THREE.Vector3(i * half, j * half, 0));
            }
        }
        
        edges.forEach(pos => {
            addAtom(THREE, latticeGroup, 'F', pos.x, pos.y, pos.z, alGeo, fGeo, alMaterial, fMaterial);
        });

        if (isModel2) {
            const stickMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
            const addStick = (p1, p2) => {
                const distance = p1.distanceTo(p2);
                const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, distance, 8), stickMaterial);
                const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
                stick.position.copy(midPoint);
                stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
                
                const stickGroup = new THREE.Group();
                stickGroup.position.copy(midPoint);
                stickGroup.userData.basePosition = stickGroup.position.clone();
                stick.position.set(0,0,0);
                stickGroup.add(stick);
                stickGroup.scale.set(0,0,0);
                latticeGroup.add(stickGroup);
            };

            // Each corner Al connects to its 3 adjacent edge Fs
            corners.forEach(c => {
                addStick(c, new THREE.Vector3(0, c.y, c.z));
                addStick(c, new THREE.Vector3(c.x, 0, c.z));
                addStick(c, new THREE.Vector3(c.x, c.y, 0));
            });
        }

        scene.add(latticeGroup);
        return latticeGroup;
    }

    function buildLattice1(THREE, scene) {
        return buildCubicLattice(THREE, scene, false);
    }

    function buildLattice2(THREE, scene) {
        return buildCubicLattice(THREE, scene, true);
    }

    function init() {
        if (!latticeScene) {
            latticeScene = new window.LatticeEngine.LatticeScene({
                appModuleId: 3,
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
