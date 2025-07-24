import * as THREE from 'three'

import { Colors } from '../constants'

export class Tree {
    mesh: THREE.Object3D
    static geometries: {
        trunk: THREE.BoxGeometry
        leaves1: THREE.CylinderGeometry
        leaves2: THREE.CylinderGeometry
        leaves3: THREE.CylinderGeometry
    }
    static materials: {
        trunk: THREE.MeshBasicMaterial
        leaves: THREE.MeshPhongMaterial
    }

    static initializeSharedResources() {
        if (!Tree.geometries) {
            Tree.geometries = {
                trunk: new THREE.BoxGeometry(10, 20, 10),
                leaves1: new THREE.CylinderGeometry(1, 12 * 3, 12 * 3, 4),
                leaves2: new THREE.CylinderGeometry(1, 9 * 3, 9 * 3, 4),
                leaves3: new THREE.CylinderGeometry(1, 6 * 3, 6 * 3, 4),
            }
            Tree.materials = {
                trunk: new THREE.MeshBasicMaterial({ color: Colors.brown }),
                leaves: new THREE.MeshPhongMaterial({
                    color: Colors.green,
                    flatShading: true,
                }),
            }
        }
    }

    constructor() {
        Tree.initializeSharedResources()
        this.mesh = new THREE.Object3D()

        // Tree trunk
        const treeBase = new THREE.Mesh(
            Tree.geometries.trunk,
            Tree.materials.trunk
        )
        treeBase.castShadow = true
        treeBase.receiveShadow = true
        treeBase.matrixAutoUpdate = false
        this.mesh.add(treeBase)

        // Tree leaves layers
        const treeLeaves1 = new THREE.Mesh(
            Tree.geometries.leaves1,
            Tree.materials.leaves
        )
        treeLeaves1.castShadow = true
        treeLeaves1.receiveShadow = true
        treeLeaves1.position.y = 20
        treeLeaves1.matrixAutoUpdate = false
        treeLeaves1.updateMatrix()
        this.mesh.add(treeLeaves1)

        const treeLeaves2 = new THREE.Mesh(
            Tree.geometries.leaves2,
            Tree.materials.leaves
        )
        treeLeaves2.castShadow = true
        treeLeaves2.position.y = 40
        treeLeaves2.receiveShadow = true
        treeLeaves2.matrixAutoUpdate = false
        treeLeaves2.updateMatrix()
        this.mesh.add(treeLeaves2)

        const treeLeaves3 = new THREE.Mesh(
            Tree.geometries.leaves3,
            Tree.materials.leaves
        )
        treeLeaves3.castShadow = true
        treeLeaves3.position.y = 55
        treeLeaves3.receiveShadow = true
        treeLeaves3.matrixAutoUpdate = false
        treeLeaves3.updateMatrix()
        this.mesh.add(treeLeaves3)
    }
}
