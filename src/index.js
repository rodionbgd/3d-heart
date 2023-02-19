import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class BaseHeart {
    constructor() {
        this.startAnimation = true;
        this.scaleThreshold = false;
        this.beatingIncrement = 0.001;
    }

    createScene() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
        let z = 30;
        camera.position.z = z;
        camera.position.y = 15;
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const color = 0xffffff;
        const intensity = 1;
        [...Array(2)].forEach(() => {
            const light = new THREE.SpotLight(color, intensity);
            light.position.set(5, 10, z); //default; light shining from top
            scene.add(light);
            z = -z;
        });

        return {
            scene,
            camera,
            renderer,
        };
    }

    createHeartMesh(coordinatesList, trianglesIndexes) {
        const geo = new THREE.BufferGeometry();
        const vertices = [];
        trianglesIndexes.forEach((triangle) => {
            vertices.push(coordinatesList[triangle[0]], coordinatesList[triangle[1]], coordinatesList[triangle[2]]);
        });

        geo.setFromPoints(vertices);
        geo.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial({ color: 0xff00ff, emissive: 0x00ff });
        const heartMesh = new THREE.Mesh(geo, material);

        return {
            geo,
            material,
            heartMesh,
        };
    }

    addWireFrameToMesh(mesh, geometry) {
        const wireframe = new THREE.WireframeGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
        const line = new THREE.LineSegments(wireframe, lineMat);
        mesh.add(line);
    }

    handleMouseInteraction(camera, scene, meshUuid) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseInteraction(e) {
            const coordinatesObject = e.changedTouches ? e.changedTouches[0] : e;
            mouse.x = (coordinatesObject.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(coordinatesObject.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects?.length && intersects[0].object?.uuid === meshUuid) {
                this.startAnimation = true;
            }
        }
        mouse.x = 1;
        mouse.y = 1;

        return {
            onMouseInteraction,
        };
    }

    beatingAnimation(mesh) {
        if (mesh.scale.x < 1.1 && !this.scaleThreshold) {
            mesh.scale.x += this.beatingIncrement;
            mesh.scale.y += this.beatingIncrement;
            mesh.scale.z += this.beatingIncrement;
            if (mesh.scale.x >= 1.1) {
                this.scaleThreshold = true;
            }
        } else if (this.scaleThreshold) {
            mesh.scale.x -= this.beatingIncrement;
            mesh.scale.y -= this.beatingIncrement;
            mesh.scale.z -= this.beatingIncrement;
            if (mesh.scale.x <= 1) {
                this.scaleThreshold = false;
            }
        }
    }

    setControls(camera, domElement) {
        if (!camera || !domElement) {
            return;
        }
        const controls = new OrbitControls(camera, domElement);
        controls.update();
        return {
            controls,
        };
    }
    useCoordinates() {
        const vertices = [
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
        const trianglesIndexes = [
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
        return {
            vertices,
            trianglesIndexes,
        };
    }
}

function init() {
    const baseHeart = new BaseHeart();
    const { scene, camera, renderer } = baseHeart.createScene();
    const { vertices, trianglesIndexes } = baseHeart.useCoordinates();
    const { geo, heartMesh } = baseHeart.createHeartMesh(vertices, trianglesIndexes);
    scene.add(heartMesh);
    baseHeart.addWireFrameToMesh(heartMesh, geo);

    const { onMouseInteraction } = baseHeart.handleMouseInteraction(camera, scene, heartMesh.uuid);
    const { controls } = baseHeart.setControls(camera, renderer.domElement);
    document.body.addEventListener("click", onMouseInteraction, false);
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        // heartMesh.rotation.y -= 0.010;
        if (baseHeart.startAnimation) {
            baseHeart.beatingAnimation(heartMesh);
        }
        controls.update();
    };
    animate();
}

init();
