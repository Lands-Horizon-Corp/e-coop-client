import * as THREE from 'three'

import { Colors, petalColors } from '../constants'

export class Flower {
    mesh: THREE.Object3D

    constructor() {
        this.mesh = new THREE.Object3D()

        // Stem
        const geomStem = new THREE.BoxGeometry(5, 50, 5, 1, 1, 1)
        const matStem = new THREE.MeshPhongMaterial({
            color: Colors.green,
            flatShading: true,
        })
        const stem = new THREE.Mesh(geomStem, matStem)
        stem.castShadow = false
        stem.receiveShadow = true
        this.mesh.add(stem)

        // Petal core
        const geomPetalCore = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1)
        const matPetalCore = new THREE.MeshPhongMaterial({
            color: Colors.yellow,
            flatShading: true,
        })
        const petalCore = new THREE.Mesh(geomPetalCore, matPetalCore)
        petalCore.castShadow = false
        petalCore.receiveShadow = true

        const petalColor = petalColors[Math.floor(Math.random() * 3)]

        // Petals
        const geomPetal = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1)
        const matPetal = new THREE.MeshBasicMaterial({ color: petalColor })

        geomPetal.translate(12.5, 0, 3)

        const petals = []
        for (let i = 0; i < 4; i++) {
            petals[i] = new THREE.Mesh(geomPetal.clone(), matPetal)
            petals[i].rotation.z = (i * Math.PI) / 2
            petals[i].castShadow = true
            petals[i].receiveShadow = true
            petalCore.add(petals[i])
        }

        petalCore.position.y = 25
        petalCore.position.z = 3
        this.mesh.add(petalCore)
    }
}
