const Game = {
    scene: null,
    renderer: null,
    clock: null,
    isRunning: false,

    init() {
        this.setupScene();
        this.setupRenderer();
        this.setupLights();
        this.setupUI();
        
        BlockManager.init();
        WorldManager.init();
        PlayerManager.init();

        this.scene.add(WorldManager.world);
        this.scene.add(PlayerManager.player);

        this.clock = new THREE.Clock();
        this.isRunning = true;
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    },

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);
    },

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    },

    setupLights() {
        // Svetlo oblohy
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Slnko
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 100, 100);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
    },

    setupUI() {
        const ui = document.createElement('div');
        ui.id = 'ui';
        ui.innerHTML = `
            <div class="stat-bar">
                <div class="label">Zdravie</div>
                <div class="bar">
                    <div id="health" class="fill"></div>
                </div>
            </div>
            <div class="stat-bar">
                <div class="label">Hlad</div>
                <div class="bar">
                    <div id="hunger" class="fill"></div>
                </div>
            </div>
            <div class="stat-bar">
                <div class="label">Skúsenosti</div>
                <div class="bar">
                    <div id="experience" class="fill"></div>
                </div>
            </div>
        `;
        document.body.appendChild(ui);
    },

    onWindowResize() {
        PlayerManager.camera.aspect = window.innerWidth / window.innerHeight;
        PlayerManager.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        
        PlayerManager.update(deltaTime);
        WorldManager.updateChunks(PlayerManager.player.position);

        this.renderer.render(this.scene, PlayerManager.camera);
    },

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    },

    stop() {
        this.isRunning = false;
    }
};

// Spustenie hry po načítaní stránky
window.addEventListener('load', () => {
    Game.init();
}); 