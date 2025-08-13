import * as THREE from 'three'

import { Colors } from '../constants'

export class Land {
    mesh: THREE.Mesh

    constructor() {
        const geom = new THREE.CylinderGeometry(600, 600, 1700, 40, 10)
        geom.rotateX(-Math.PI / 2)

        const mat = new THREE.MeshPhongMaterial({
            color: Colors.lightgreen,
            flatShading: true,
        })

        this.mesh = new THREE.Mesh(geom, mat)
        this.mesh.receiveShadow = true
    }
}
