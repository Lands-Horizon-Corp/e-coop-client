import * as THREE from 'three'

import { Flower } from './Flower'
import { Tree } from './Tree'

export class Forest {
    mesh: THREE.Object3D
    nTrees: number
    nFlowers: number

    constructor() {
        this.mesh = new THREE.Object3D()
        this.nTrees = 150
        this.nFlowers = 200

        // Create trees
        const stepAngleTree = (Math.PI * 2) / this.nTrees
        for (let i = 0; i < this.nTrees; i++) {
            const t = new Tree()
            const a = stepAngleTree * i
            const h = 605

            t.mesh.position.y = Math.sin(a) * h
            t.mesh.position.x = Math.cos(a) * h
            t.mesh.rotation.z = a + (Math.PI / 2) * 3
            t.mesh.position.z = 0 - Math.random() * 600

            const s = 0.3 + Math.random() * 0.75
            t.mesh.scale.set(s, s, s)

            this.mesh.add(t.mesh)
        }

        // Create flowers
        const stepAngleFlower = (Math.PI * 2) / this.nFlowers
        for (let i = 0; i < this.nFlowers; i++) {
            const f = new Flower()
            const a = stepAngleFlower * i
            const h = 605

            f.mesh.position.y = Math.sin(a) * h
            f.mesh.position.x = Math.cos(a) * h
            f.mesh.rotation.z = a + (Math.PI / 2) * 3
            f.mesh.position.z = 0 - Math.random() * 600

            const s = 0.1 + Math.random() * 0.3
            f.mesh.scale.set(s, s, s)

            this.mesh.add(f.mesh)
        }
    }
}
