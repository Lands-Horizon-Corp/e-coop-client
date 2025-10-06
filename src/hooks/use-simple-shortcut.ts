import { useEffect, useRef } from 'react'

export type KeyboardKey =
    // Modifier keys
    | 'Alt'
    | 'AltGraph'
    | 'CapsLock'
    | 'Control'
    | 'Fn'
    | 'FnLock'
    | 'Meta'
    | 'NumLock'
    | 'ScrollLock'
    | 'Shift'
    | 'Symbol'
    | 'SymbolLock'

    // Whitespace
    | 'Enter'
    | 'Tab'
    | ' ' // Spacebar as ' '

    // Navigation keys
    | 'ArrowDown'
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'ArrowUp'
    | 'End'
    | 'Home'
    | 'PageDown'
    | 'PageUp'

    // Editing keys
    | 'Backspace'
    | 'Clear'
    | 'Copy'
    | 'CrSel'
    | 'Cut'
    | 'Delete'
    | 'EraseEof'
    | 'ExSel'
    | 'Insert'
    | 'Paste'
    | 'Redo'
    | 'Undo'

    // UI keys
    | 'Accept'
    | 'Again'
    | 'Attn'
    | 'Cancel'
    | 'ContextMenu'
    | 'Escape'
    | 'Execute'
    | 'Find'
    | 'Finish'
    | 'Help'
    | 'Pause'
    | 'Play'
    | 'Props'
    | 'Select'
    | 'ZoomIn'
    | 'ZoomOut'

    // Device keys
    | 'BrightnessDown'
    | 'BrightnessUp'
    | 'Eject'
    | 'LogOff'
    | 'Power'
    | 'PowerOff'
    | 'PrintScreen'
    | 'Hibernate'
    | 'Standby'
    | 'WakeUp'

    // IME composition
    | 'AllCandidates'
    | 'Alphanumeric'
    | 'CodeInput'
    | 'Compose'
    | 'Convert'
    | 'FinalMode'
    | 'GroupFirst'
    | 'GroupLast'
    | 'GroupNext'
    | 'GroupPrevious'
    | 'ModeChange'
    | 'NextCandidate'
    | 'NonConvert'
    | 'PreviousCandidate'
    | 'Process'
    | 'SingleCandidate'

    // Function keys
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12'
    | 'F13'
    | 'F14'
    | 'F15'
    | 'F16'
    | 'F17'
    | 'F18'
    | 'F19'
    | 'F20'
    | 'F21'
    | 'F22'
    | 'F23'
    | 'F24'

    // Media keys
    | 'MediaFastForward'
    | 'MediaPause'
    | 'MediaPlay'
    | 'MediaPlayPause'
    | 'MediaRecord'
    | 'MediaRewind'
    | 'MediaStop'
    | 'MediaTrackNext'
    | 'MediaTrackPrevious'

    // Multimedia
    | 'AudioVolumeDown'
    | 'AudioVolumeUp'
    | 'AudioVolumeMute'
    | 'MicrophoneToggle'
    | 'MicrophoneVolumeUp'
    | 'MicrophoneVolumeDown'
    | 'MicrophoneMute'

    // Character keys
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z'
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'

    // Punctuation and symbols
    | '`'
    | '-'
    | '='
    | '['
    | ']'
    | '\\'
    | ';'
    | "'"
    | ','
    | '.'
    | '/'
    | '~'
    | '!'
    | '@'
    | '#'
    | '$'
    | '%'
    | '^'
    | '&'
    | '*'
    | '('
    | ')'

export type Keys = KeyboardKey

type UseShortcutOptions = {
    passive?: boolean
    disabled?: boolean
    element?: HTMLElement | null
    disableTextInputs?: boolean
    disableActiveButton?: boolean
}

export const useSimpleShortcut = (
    keys: KeyboardKey[],
    callback: (e: KeyboardEvent) => void,
    options: UseShortcutOptions = {}
) => {
    const pressedKeysRef = useRef<Set<string>>(new Set())
    const {
        passive = false,
        disabled = false,
        element = window,
        disableTextInputs = true,
        disableActiveButton = false,
    } = options

    useEffect(() => {
        if (disabled) return

        const handleKeyDown = (e: Event) => {
            const keyboardEvent = e as KeyboardEvent

            const isTextInput =
                keyboardEvent.target instanceof HTMLTextAreaElement ||
                (keyboardEvent.target instanceof HTMLInputElement &&
                    (!keyboardEvent.target.type ||
                        keyboardEvent.target.type === 'text' ||
                        keyboardEvent.target.type === 'password' ||
                        keyboardEvent.target.type === 'email' ||
                        keyboardEvent.target.type === 'number' ||
                        keyboardEvent.target.type === 'search' ||
                        keyboardEvent.target.type === 'tel' ||
                        keyboardEvent.target.type === 'url')) ||
                (keyboardEvent.target as HTMLElement)?.isContentEditable ||
                (keyboardEvent.target as HTMLElement)?.contentEditable ===
                    'true'

            const isButtonActive =
                disableActiveButton &&
                ((document.activeElement instanceof HTMLButtonElement &&
                    document.activeElement.disabled) ||
                    (keyboardEvent.target instanceof HTMLButtonElement &&
                        (keyboardEvent.target as HTMLButtonElement).disabled))

            if (keyboardEvent.repeat) return

            if ((disableTextInputs && isTextInput) || isButtonActive) {
                return keyboardEvent.stopPropagation()
            }

            pressedKeysRef.current.add(keyboardEvent.key)

            const allPressed = keys.every((key) =>
                pressedKeysRef.current.has(key)
            )

            if (allPressed && keyboardEvent.key === keys[keys.length - 1]) {
                keyboardEvent.preventDefault()
                keyboardEvent.stopPropagation()
                callback(keyboardEvent)
            }
        }

        const handleKeyUp = (_e: Event) => {
            pressedKeysRef.current.clear()
        }

        element?.addEventListener('keydown', handleKeyDown, { passive })
        element?.addEventListener('keyup', handleKeyUp, { passive })

        return () => {
            element?.removeEventListener('keydown', handleKeyDown)
            element?.removeEventListener('keyup', handleKeyUp)
        }
    }, [
        keys,
        callback,
        passive,
        disabled,
        element,
        disableTextInputs,
        disableActiveButton,
    ])
}
