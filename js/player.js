const PlayerManager = {
    player: null,
    camera: null,
    moveSpeed: 5,
    jumpForce: 10,
    gravity: 20,
    velocity: new THREE.Vector3(),
    onGround: false,
    health: 20,
    hunger: 20,
    experience: 0,

    init() {
        this.createPlayer();
        this.setupCamera();
        this.setupControls();
    },

    createPlayer() {
        const geometry = new THREE.BoxGeometry(0.6, 1.8, 0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 10, 0);
        this.player.castShadow = true;
    },

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0);
        this.player.add(this.camera);
    },

    setupControls() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        };

        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('click', () => this.onClick());
    },

    onKeyDown(event) {
        switch(event.code) {
            case 'KeyW': this.keys.forward = true; break;
            case 'KeyS': this.keys.backward = true; break;
            case 'KeyA': this.keys.left = true; break;
            case 'KeyD': this.keys.right = true; break;
            case 'Space': this.keys.jump = true; break;
        }
    },

    onKeyUp(event) {
        switch(event.code) {
            case 'KeyW': this.keys.forward = false; break;
            case 'KeyS': this.keys.backward = false; break;
            case 'KeyA': this.keys.left = false; break;
            case 'KeyD': this.keys.right = false; break;
            case 'Space': this.keys.jump = false; break;
        }
    },

    onMouseMove(event) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.player.rotation.y -= movementX * 0.002;
        this.camera.rotation.x -= movementY * 0.002;
        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
    },

    onClick() {
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        raycaster.set(this.camera.position, direction);
        const intersects = raycaster.intersectObjects(WorldManager.world.children, true);

        if (intersects.length > 0) {
            const block = intersects[0].object;
            if (block.userData.type) {
                WorldManager.setBlock(
                    Math.floor(block.position.x),
                    Math.floor(block.position.y),
                    Math.floor(block.position.z),
                    null
                );
            }
        }
    },

    update(deltaTime) {
        this.updateMovement(deltaTime);
        this.updateCollision();
        this.updateStats();
    },

    updateMovement(deltaTime) {
        const moveDirection = new THREE.Vector3();
        
        if (this.keys.forward) moveDirection.z -= 1;
        if (this.keys.backward) moveDirection.z += 1;
        if (this.keys.left) moveDirection.x -= 1;
        if (this.keys.right) moveDirection.x += 1;

        moveDirection.normalize();
        moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.rotation.y);
        
        this.velocity.x = moveDirection.x * this.moveSpeed;
        this.velocity.z = moveDirection.z * this.moveSpeed;

        if (this.keys.jump && this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
        }

        this.velocity.y -= this.gravity * deltaTime;
        
        this.player.position.x += this.velocity.x * deltaTime;
        this.player.position.y += this.velocity.y * deltaTime;
        this.player.position.z += this.velocity.z * deltaTime;
    },

    updateCollision() {
        const playerBox = new THREE.Box3().setFromObject(this.player);
        const playerPos = this.player.position.clone();

        // Kontrola kolízie s blokmi
        for (const chunk of WorldManager.chunks.values()) {
            for (const block of chunk.children) {
                if (!BlockManager.isSolid(block)) continue;

                const blockBox = new THREE.Box3().setFromObject(block);
                if (playerBox.intersectsBox(blockBox)) {
                    // Kolízia zhora
                    if (this.velocity.y < 0 && playerPos.y > block.position.y) {
                        this.player.position.y = block.position.y + 1;
                        this.velocity.y = 0;
                        this.onGround = true;
                    }
                    // Kolízia zdola
                    else if (this.velocity.y > 0 && playerPos.y < block.position.y) {
                        this.player.position.y = block.position.y - 1.8;
                        this.velocity.y = 0;
                    }
                    // Kolízia zo strany
                    else {
                        const dx = playerPos.x - block.position.x;
                        const dz = playerPos.z - block.position.z;
                        
                        if (Math.abs(dx) > Math.abs(dz)) {
                            this.player.position.x = block.position.x + (dx > 0 ? 1 : -1);
                        } else {
                            this.player.position.z = block.position.z + (dz > 0 ? 1 : -1);
                        }
                    }
                }
            }
        }
    },

    updateStats() {
        // Aktualizácia zdravia, hladu a skúseností
        if (this.hunger > 0) {
            this.hunger -= 0.01;
            if (this.hunger < 5 && this.health > 0) {
                this.health -= 0.01;
            }
        }

        // Aktualizácia UI
        document.getElementById('health').style.width = `${(this.health / 20) * 100}%`;
        document.getElementById('hunger').style.width = `${(this.hunger / 20) * 100}%`;
        document.getElementById('experience').style.width = `${(this.experience / 100) * 100}%`;
    },

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.die();
        }
    },

    die() {
        // Implementácia smrti hráča
        this.health = 20;
        this.hunger = 20;
        this.player.position.set(0, 10, 0);
        this.velocity.set(0, 0, 0);
    }
}; 