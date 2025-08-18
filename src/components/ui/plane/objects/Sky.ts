import * as THREE from 'three'

import { Cloud } from './Cloud'

export class Sky {
    mesh: THREE.Object3D
    nClouds: number

    constructor() {
        this.mesh = new THREE.Object3D()
        this.nClouds = 20

        const stepAngle = (Math.PI * 2) / this.nClouds

        for (let i = 0; i < this.nClouds; i++) {
            const c = new Cloud()
            const a = stepAngle * i
            const h = 800 + Math.random() * 200

            c.mesh.position.y = Math.sin(a) * h
            c.mesh.position.x = Math.cos(a) * h
            c.mesh.rotation.z = a + Math.PI / 2
            c.mesh.position.z = -400 - Math.random() * 400

            const s = 1 + Math.random() * 2
            c.mesh.scale.set(s, s, s)

            this.mesh.add(c.mesh)
        }
    }
}
