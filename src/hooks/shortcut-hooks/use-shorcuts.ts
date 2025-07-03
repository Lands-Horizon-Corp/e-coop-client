import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'

interface ShortcutOptions {
    disableTextInputs?: boolean
    disableActiveButton?: boolean
}

export const useShortcut = (
    shortcut: string,
    callback: (event: KeyboardEvent) => void,
    options: ShortcutOptions = {
        disableTextInputs: true,
        disableActiveButton: true,
    }
) => {
    const callbackRef = useRef(callback)
    const [keyCombo, setKeyCombo] = useState<string[]>([])

    useLayoutEffect(() => {
        callbackRef.current = callback
    })

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const isTextInput =
                event.target instanceof HTMLTextAreaElement ||
                (event.target instanceof HTMLInputElement &&
                    (!event.target.type || event.target.type === 'text')) ||
                (event.target as HTMLElement).isContentEditable

            const modifierMap: Record<string, boolean> = {
                Control: event.ctrlKey,
                Alt: event.altKey,
                Command: event.metaKey || event.ctrlKey,
                Shift: event.shiftKey,
            }

            if (event.repeat) return

            if (options.disableTextInputs && isTextInput)
                return event.stopPropagation()

            const pressedKey = event.key.toLowerCase()
            const shortcutKeys = shortcut.toLowerCase().split('+')

            if (Object.keys(modifierMap).includes(shortcutKeys[0])) {
                const finalKey = shortcutKeys.pop()

                if (
                    shortcutKeys.every((k) => modifierMap[k]) &&
                    finalKey === pressedKey
                ) {
                    event.preventDefault()
                    return callbackRef.current(event)
                }
            } else if (shortcutKeys.length > 1) {
                if (shortcutKeys[keyCombo.length] === pressedKey) {
                    if (keyCombo.length === shortcutKeys.length - 1) {
                        event.preventDefault()
                        callbackRef.current(event)
                        setKeyCombo([])
                    } else {
                        setKeyCombo((prevCombo) => [...prevCombo, pressedKey])
                    }
                    return
                }
                setKeyCombo([])
            } else if (
                shortcutKeys.length === 1 &&
                shortcutKeys[0] === pressedKey
            ) {
                event.preventDefault()
                return callbackRef.current(event)
            }
        },
        [keyCombo, shortcut, options.disableTextInputs]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])
}
