import { useCallback, useEffect, useState } from 'react'

interface Props {
    counterInterval?: number
    cooldownDuration: number
}

const UseCooldown = ({
    cooldownDuration = 5,
    counterInterval = 1000,
}: Props) => {
    const [count, setCount] = useState(0)

    const startCooldown = useCallback(() => {
        setCount(cooldownDuration)
    }, [cooldownDuration])

    useEffect(() => {
        if (count <= 0) return

        const cooldownInterval = setInterval(() => {
            setCount((previousCount) => previousCount - 1)
        }, counterInterval)

        return () => {
            clearInterval(cooldownInterval)
        }
    }, [count, counterInterval])

    return { cooldownCount: count, startCooldown }
}

export default UseCooldown
