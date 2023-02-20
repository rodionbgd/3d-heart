import * as THREE from "three";

export default class Scene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
        let z = 30;
        this.camera.position.z = z;
        this.camera.position.y = 15;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const color = 0xffffff;
        const intensity = 1;
        [...Array(2)].forEach(() => {
            const light = new THREE.SpotLight(color, intensity);
            light.position.set(5, 10, z); //default; light shining from top
            this.scene.add(light);
            z = -z;
        });
    }
}
