import * as THREE from 'three'

import { Colors } from '../constants'

export class Sun {
    mesh: THREE.Object3D

    constructor() {
        this.mesh = new THREE.Object3D()

        const sunGeom = new THREE.SphereGeometry(400, 20, 10)
        const sunMat = new THREE.MeshPhongMaterial({
            color: Colors.yellow,
            flatShading: true,
        })
        const sun = new THREE.Mesh(sunGeom, sunMat)
        sun.castShadow = false
        sun.receiveShadow = false
        this.mesh.add(sun)
    }
}
