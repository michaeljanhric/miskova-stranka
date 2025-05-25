const TextureManager = {
    textures: {},
    textureLoader: new THREE.TextureLoader(),

    init() {
        // Načítanie textúr
        this.textures = {
            grass: this.loadTexture('grass', 'top', 'side', 'bottom'),
            dirt: this.loadTexture('dirt', 'all'),
            stone: this.loadTexture('stone', 'all'),
            wood: this.loadTexture('wood', 'top', 'side'),
            leaves: this.loadTexture('leaves', 'all'),
            water: this.loadTexture('water', 'all'),
            sand: this.loadTexture('sand', 'all'),
            glass: this.loadTexture('glass', 'all'),
            torch: this.loadTexture('torch', 'all')
        };
    },

    loadTexture(name, ...sides) {
        const materials = [];
        const baseUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/minecraft/';

        sides.forEach(side => {
            let textureUrl;
            if (side === 'all') {
                textureUrl = `${baseUrl}${name}.jpg`;
            } else {
                textureUrl = `${baseUrl}${name}_${side}.jpg`;
            }
            materials.push(new THREE.MeshLambertMaterial({
                map: this.textureLoader.load(textureUrl)
            }));
        });

        return materials;
    },

    getMaterial(blockType, side = 0) {
        if (!this.textures[blockType]) {
            console.warn(`Textúra pre blok ${blockType} nebola nájdená`);
            return new THREE.MeshLambertMaterial({ color: 0xff0000 });
        }
        return this.textures[blockType][side];
    }
}; 