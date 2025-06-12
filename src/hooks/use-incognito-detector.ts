import { useEffect, useState } from 'react'
import detectIncognito from 'detectincognitojs'

export const useIncognitoDetector = ({
    onAllowed,
    onNotAllowed,
}: {
    onAllowed?: () => void
    onNotAllowed?: () => void
} = {}) => {
    const [isAllowed, setIsAllowed] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        detectIncognito().then((result) => {
            try {
                const res = !result.isPrivate

                if (res) onAllowed?.()
                else onNotAllowed?.()

                setIsAllowed(res)

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                setIsChecking(false)
            } finally {
                setIsChecking(false)
            }
        })
    }, [onAllowed, onNotAllowed])

    return { isAllowed, isChecking }
}
