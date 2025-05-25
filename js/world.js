const WorldManager = {
    chunks: new Map(),
    chunkSize: 16,
    renderDistance: 8,
    world: new THREE.Group(),

    init() {
        this.generateInitialChunks();
    },

    generateInitialChunks() {
        for (let x = -this.renderDistance; x < this.renderDistance; x++) {
            for (let z = -this.renderDistance; z < this.renderDistance; z++) {
                this.generateChunk(x, z);
            }
        }
    },

    generateChunk(chunkX, chunkZ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        if (this.chunks.has(chunkKey)) return;

        const chunk = new THREE.Group();
        const noise = this.generateNoise(chunkX, chunkZ);

        for (let x = 0; x < this.chunkSize; x++) {
            for (let z = 0; z < this.chunkSize; z++) {
                const worldX = chunkX * this.chunkSize + x;
                const worldZ = chunkZ * this.chunkSize + z;
                const height = Math.floor(noise[x][z] * 10) + 5;

                // Generovanie blokov od základu po výšku
                for (let y = 0; y <= height; y++) {
                    let blockType;
                    if (y === height) {
                        blockType = 'grass';
                    } else if (y > height - 3) {
                        blockType = 'dirt';
                    } else {
                        blockType = 'stone';
                    }

                    const block = BlockManager.createBlock(blockType, worldX, y, worldZ);
                    if (block) chunk.add(block);
                }

                // Generovanie vody
                if (height < 4) {
                    for (let y = height + 1; y <= 4; y++) {
                        const water = BlockManager.createBlock('water', worldX, y, worldZ);
                        if (water) chunk.add(water);
                    }
                }
            }
        }

        this.chunks.set(chunkKey, chunk);
        this.world.add(chunk);
    },

    generateNoise(chunkX, chunkZ) {
        const noise = [];
        for (let x = 0; x < this.chunkSize; x++) {
            noise[x] = [];
            for (let z = 0; z < this.chunkSize; z++) {
                const worldX = chunkX * this.chunkSize + x;
                const worldZ = chunkZ * this.chunkSize + z;
                noise[x][z] = this.simplex2(worldX * 0.1, worldZ * 0.1);
            }
        }
        return noise;
    },

    simplex2(x, z) {
        // Jednoduchá implementácia Simplex noise
        return (Math.sin(x) * Math.cos(z) + Math.sin(x * 0.5) * Math.cos(z * 0.5)) * 0.5 + 0.5;
    },

    updateChunks(playerPosition) {
        const playerChunkX = Math.floor(playerPosition.x / this.chunkSize);
        const playerChunkZ = Math.floor(playerPosition.z / this.chunkSize);

        // Odstránenie vzdialených chunkov
        for (const [key, chunk] of this.chunks) {
            const [x, z] = key.split(',').map(Number);
            if (Math.abs(x - playerChunkX) > this.renderDistance ||
                Math.abs(z - playerChunkZ) > this.renderDistance) {
                this.world.remove(chunk);
                this.chunks.delete(key);
            }
        }

        // Generovanie nových chunkov
        for (let x = -this.renderDistance; x < this.renderDistance; x++) {
            for (let z = -this.renderDistance; z < this.renderDistance; z++) {
                const chunkX = playerChunkX + x;
                const chunkZ = playerChunkZ + z;
                this.generateChunk(chunkX, chunkZ);
            }
        }
    },

    getBlockAt(x, y, z) {
        const chunkX = Math.floor(x / this.chunkSize);
        const chunkZ = Math.floor(z / this.chunkSize);
        const chunkKey = `${chunkX},${chunkZ}`;
        const chunk = this.chunks.get(chunkKey);

        if (!chunk) return null;

        const localX = ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
        const localZ = ((z % this.chunkSize) + this.chunkSize) % this.chunkSize;

        for (const block of chunk.children) {
            if (block.position.x === x && block.position.y === y && block.position.z === z) {
                return block;
            }
        }

        return null;
    },

    setBlock(x, y, z, type) {
        const existingBlock = this.getBlockAt(x, y, z);
        if (existingBlock) {
            existingBlock.parent.remove(existingBlock);
        }

        const newBlock = BlockManager.createBlock(type, x, y, z);
        if (newBlock) {
            const chunkX = Math.floor(x / this.chunkSize);
            const chunkZ = Math.floor(z / this.chunkSize);
            const chunkKey = `${chunkX},${chunkZ}`;
            const chunk = this.chunks.get(chunkKey);
            if (chunk) {
                chunk.add(newBlock);
            }
        }
    }
}; 