import React from 'react'

import { useThreeScene } from './hooks/useThreeScene'

const AirplaneScene: React.FC = () => {
    const { mountRef, handleMouseMove } = useThreeScene()

    return (
        <div>
            <div
                ref={mountRef}
                onMouseMove={handleMouseMove}
                className="fixed inset-0 -z-10 bg-background"
            />
            <div className="fixed inset-0 -z-10 bg-gradient-to-t from-white/90 to-transparent" />{' '}
        </div>
    )
}

export default AirplaneScene
