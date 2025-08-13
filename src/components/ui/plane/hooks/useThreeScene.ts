import { useEffect, useRef, useState } from 'react'

import * as THREE from 'three'

import { Forest } from '../objects/Forest'
import { Land } from '../objects/Land'
import { Sky } from '../objects/Sky'
import { Sun } from '../objects/Sun'
import { MousePosition, SceneObjects } from '../types'

export const useThreeScene = () => {
    const mountRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<SceneObjects>({})
    const animationRef = useRef<number>()
    const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })

    useEffect(() => {
        if (!mountRef.current) return

        const localMountRef = mountRef.current // Store the ref value
        const width = window.innerWidth
        const height = window.innerHeight
        const offSet = -600

        // Create scene
        const scene = new THREE.Scene()
        scene.fog = new THREE.Fog(0xffffff, 100, 950)

        // Create camera
        const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
        camera.position.set(0, 150, 100)

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        })
        renderer.setSize(width, height)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        // Create lights
        const hemisphereLight = new THREE.HemisphereLight(0x81c784, 0x81c784, 1)
        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9)
        shadowLight.position.set(0, 350, 350)
        shadowLight.castShadow = true
        shadowLight.shadow.camera.left = -650
        shadowLight.shadow.camera.right = 650
        shadowLight.shadow.camera.top = 650
        shadowLight.shadow.camera.bottom = -650
        shadowLight.shadow.camera.near = 1
        shadowLight.shadow.camera.far = 1000
        shadowLight.shadow.mapSize.width = 2048
        shadowLight.shadow.mapSize.height = 2048

        scene.add(hemisphereLight)
        scene.add(shadowLight)

        // Create objects
        const land = new Land()
        land.mesh.position.y = offSet
        scene.add(land.mesh)

        const sky = new Sky()
        sky.mesh.position.y = offSet
        scene.add(sky.mesh)

        const forest = new Forest()
        forest.mesh.position.y = offSet
        scene.add(forest.mesh)

        const orbit = new THREE.Object3D()
        orbit.position.y = offSet
        orbit.rotation.z = -Math.PI / 6
        scene.add(orbit)

        const sun = new Sun()
        sun.mesh.scale.set(1, 1, 0.3)
        sun.mesh.position.set(0, -30, -850)
        scene.add(sun.mesh)

        // Store references
        sceneRef.current = {
            scene,
            camera,
            renderer,
            land: land.mesh,
            sky: sky.mesh,
            forest: forest.mesh,
            orbit,
            sun: sun.mesh,
        }

        // Add to DOM
        localMountRef.appendChild(renderer.domElement)

        // Handle resize
        const handleResize = () => {
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight
            camera.aspect = newWidth / newHeight
            camera.updateProjectionMatrix()
            renderer.setSize(newWidth, newHeight)
        }

        window.addEventListener('resize', handleResize)

        // Animation loop
        const animate = () => {
            const { land, sky, forest, orbit, scene, camera, renderer } =
                sceneRef.current

            if (land && sky && forest && orbit && scene && camera && renderer) {
                // Rotate objects
                land.rotation.z += 0.000005
                orbit.rotation.z += 0.00001
                sky.rotation.z += 0.0003
                forest.rotation.z += 0.0005

                renderer.render(scene, camera)
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (localMountRef && renderer.domElement) {
                localMountRef.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [mousePos])

    const handleMouseMove = (event: React.MouseEvent) => {
        const tx = -1 + (event.clientX / window.innerWidth) * 2
        const ty = 1 - (event.clientY / window.innerHeight) * 2
        setMousePos({ x: tx, y: ty })
    }

    return { mountRef, handleMouseMove }
}
