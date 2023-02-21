import * as THREE from "three";

export default class Room {
    constructor({ width, height, depth }) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    createRoom(scene) {
        const planeMaterial = new THREE.MeshPhongMaterial({
            color: 0x241b61,
            side: THREE.DoubleSide,
        });
        for (let i = 0; i < 6; i++) {
            const geo = new THREE.PlaneGeometry(this.width, this.height, 2);
            const rotationAngle = {
                axis: "X",
                radiant: 0,
            };
            const translation = {
                x: 0,
                y: 0,
                z: 0,
            };
            switch (i) {
                case 0:
                    translation.z = -this.depth / 2;
                    break;
                case 1:
                    rotationAngle.radiant = -Math.PI * 0.5;
                    rotationAngle.axis = "X";
                    translation.y = -this.height / 2;
                    break;
                case 2:
                    rotationAngle.radiant = -Math.PI * 0.5;
                    rotationAngle.axis = "X";
                    translation.y = this.height / 2;
                    break;
                case 3:
                    rotationAngle.radiant = -Math.PI * 0.5;
                    rotationAngle.axis = "Y";
                    translation.x = -this.width / 2;
                    break;
                case 4:
                    rotationAngle.radiant = -Math.PI * 0.5;
                    rotationAngle.axis = "Y";
                    translation.x = this.width / 2;
                    break;
                case 5:
                    translation.z = this.depth / 2;
                    break;
                default:
                    break;
            }
            const plane = new THREE.Mesh(
                geo[`rotate${rotationAngle.axis}`](rotationAngle.radiant).translate(
                    translation.x,
                    translation.y,
                    translation.z
                ),
                planeMaterial
            );
            scene.add(plane);
        }
    }
}
