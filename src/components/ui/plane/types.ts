export interface MousePosition {
    x: number
    y: number
}

export interface SceneObjects {
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    airplane?: AirplaneObject
    land?: THREE.Mesh
    sky?: THREE.Object3D
    forest?: THREE.Object3D
    orbit?: THREE.Object3D
    sun?: THREE.Object3D
}

export interface AirplaneObject {
    mesh: THREE.Object3D
    propeller: THREE.Mesh
}
