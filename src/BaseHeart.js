import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Scene from "./Scene";

export default class BaseHeart extends Scene {
    constructor() {
        super();
        this.startAnimation = true;
        this.scaleThreshold = false;
        this.beatingIncrement = 0.001;
        this.vertices = [];
        this.trianglesIndexes = [];
        this.geo = null;
        this.heartMesh = null;
        this.controls = null;
    }

    createHeartMesh() {
        this.geo = new THREE.BufferGeometry();
        const vertices = [];
        this.trianglesIndexes.forEach((triangle) => {
            vertices.push(this.vertices[triangle[0]], this.vertices[triangle[1]], this.vertices[triangle[2]]);
        });

        this.geo.setFromPoints(vertices);
        this.geo.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial({ color: 0xff00ff, emissive: 0x00ff });
        this.heartMesh = new THREE.Mesh(this.geo, material);
    }

    addWireFrameToMesh() {
        const wireframe = new THREE.WireframeGeometry(this.geo);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
        const line = new THREE.LineSegments(wireframe, lineMat);
        this.heartMesh.add(line);
    }

    handleMouseInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseInteraction(e) {
            const coordinatesObject = e.changedTouches ? e.changedTouches[0] : e;
            mouse.x = (coordinatesObject.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(coordinatesObject.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects?.length && intersects[0].object?.uuid === this.heartMesh.uuid) {
                this.startAnimation = true;
            }
        }

        mouse.x = 1;
        mouse.y = 1;

        document.body.addEventListener("click", (e) => onMouseInteraction.call(this, e), false);
    }

    beatingAnimation() {
        if (this.heartMesh.scale.x < 1.1 && !this.scaleThreshold) {
            Object.keys(this.heartMesh.scale).forEach((key) => {
                this.heartMesh.scale[key] += this.beatingIncrement;
            });
            if (this.heartMesh.scale.x >= 1.1) {
                this.scaleThreshold = true;
            }
        } else if (this.scaleThreshold) {
            Object.keys(this.heartMesh.scale).forEach((key) => {
                this.heartMesh.scale[key] -= this.beatingIncrement;
            });
            if (this.heartMesh.scale.x <= 1) {
                this.scaleThreshold = false;
            }
        }
    }

    setControls() {
        const { domElement } = this.renderer;
        if (!this.camera || !domElement) {
            return;
        }
        this.controls = new OrbitControls(this.camera, domElement);
        this.controls.update();
    }
    useCoordinates() {
        this.vertices = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 5, -1.5),
            new THREE.Vector3(5, 5, 0),
            new THREE.Vector3(9, 9, 0),
            new THREE.Vector3(5, 9, 2),
            new THREE.Vector3(7, 13, 0),
            new THREE.Vector3(3, 13, 0),
            new THREE.Vector3(0, 11, 0),
            new THREE.Vector3(5, 9, -2),
            new THREE.Vector3(0, 8, -3),
            new THREE.Vector3(0, 8, 3),
            new THREE.Vector3(0, 5, 1.5),
            new THREE.Vector3(-9, 9, 0),
            new THREE.Vector3(-5, 5, 0),
            new THREE.Vector3(-5, 9, -2),
            new THREE.Vector3(-5, 9, 2),
            new THREE.Vector3(-7, 13, 0),
            new THREE.Vector3(-3, 13, 0),
        ];
        this.trianglesIndexes = [
            // face 1
            [2, 11, 0],
            [2, 3, 4],
            [5, 4, 3],
            [4, 5, 6],
            [4, 6, 7],
            [4, 7, 10],
            [4, 10, 11],
            [4, 11, 2],
            [0, 11, 13],
            [12, 13, 15],
            [12, 15, 16],
            [16, 15, 17],
            [17, 15, 7],
            [7, 15, 10],
            [11, 10, 15],
            [13, 11, 15],
            // face 2
            [0, 1, 2],
            [1, 9, 2],
            [9, 8, 2],
            [5, 3, 8],
            [8, 3, 2],
            [6, 5, 8],
            [7, 6, 8],
            [9, 7, 8],
            [14, 17, 7],
            [14, 7, 9],
            [14, 9, 1],
            [9, 1, 13],
            [1, 0, 13],
            [14, 1, 13],
            [16, 14, 12],
            [16, 17, 14],
            [12, 14, 13],
        ];
    }

    animate() {
        const animationCb = () => {
            this.renderer.render(this.scene, this.camera);
            this.heartMesh.rotation.y -= 0.01;
            if (this.startAnimation) {
                this.beatingAnimation(this.heartMesh);
            }
            this.controls.update();
            requestAnimationFrame(animationCb);
        };
        requestAnimationFrame(animationCb);
    }

    init() {
        this.createScene();
        this.useCoordinates();
        this.createHeartMesh();
        this.scene.add(this.heartMesh);
        this.addWireFrameToMesh();
        this.handleMouseInteraction.call(this);
        this.setControls();
        this.animate();
    }
}
