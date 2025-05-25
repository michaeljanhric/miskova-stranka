const BlockManager = {
    blockTypes: {
        grass: {
            texture: 'grass',
            solid: true,
            transparent: false
        },
        dirt: {
            texture: 'dirt',
            solid: true,
            transparent: false
        },
        stone: {
            texture: 'stone',
            solid: true,
            transparent: false
        },
        water: {
            texture: 'water',
            solid: false,
            transparent: true
        },
        wood: {
            texture: 'wood',
            solid: true,
            transparent: false
        },
        leaves: {
            texture: 'leaves',
            solid: true,
            transparent: true
        }
    },

    textures: {},

    init() {
        this.loadTextures();
    },

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        const textureNames = ['grass', 'dirt', 'stone', 'water', 'wood', 'leaves'];
        
        textureNames.forEach(name => {
            this.textures[name] = textureLoader.load(`textures/${name}.png`);
        });
    },

    createBlock(type, x, y, z) {
        if (!this.blockTypes[type]) return null;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            map: this.textures[type],
            transparent: this.blockTypes[type].transparent,
            opacity: this.blockTypes[type].transparent ? 0.6 : 1
        });

        const block = new THREE.Mesh(geometry, material);
        block.position.set(x, y, z);
        block.userData = {
            type: type,
            solid: this.blockTypes[type].solid
        };

        return block;
    },

    isSolid(block) {
        return block && block.userData.solid;
    },

    isTransparent(block) {
        return block && this.blockTypes[block.userData.type].transparent;
    }
}; 