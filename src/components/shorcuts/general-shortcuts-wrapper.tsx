import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

import { SHORTCUT_SCOPES } from '@/constants'
import { useHotkeysContext } from 'react-hotkeys-hook'

interface ShortcutContextType {
    activeScope: SHORTCUT_SCOPES
    setActiveScope: (scope: SHORTCUT_SCOPES) => void
}

const ShortcutContext = createContext<ShortcutContextType | null>(null)

interface ShortcutProviderProps {
    children: ReactNode
}

export const ShortcutProvider = ({ children }: ShortcutProviderProps) => {
    const [activeScope, setActiveScope] = useState<SHORTCUT_SCOPES>(
        SHORTCUT_SCOPES.GLOBAL
    )
    const { enableScope, disableScope } = useHotkeysContext()
    useEffect(() => {
        Object.values(SHORTCUT_SCOPES).forEach((scope) => {
            if (scope === activeScope) {
                enableScope(scope)
            } else {
                disableScope(scope)
            }
        })
    }, [activeScope, enableScope, disableScope])

    const contextValue: ShortcutContextType = {
        activeScope,
        setActiveScope,
    }

    return (
        <ShortcutContext.Provider value={contextValue}>
            {children}
        </ShortcutContext.Provider>
    )
}

export const useShortcutContext = (): ShortcutContextType => {
    const context = useContext(ShortcutContext)
    if (!context) {
        throw new Error(
            'useShortcutContext must be used within a ShortcutProvider'
        )
    }
    return context
}

interface GeneralShortcutsWrapperProps {
    mode: SHORTCUT_SCOPES
    children?: ReactNode
}

export const GeneralShortcutsWrapper: FC<GeneralShortcutsWrapperProps> = ({
    mode,
    children,
}) => {
    const { enableScope, disableScope } = useHotkeysContext()
    useEffect(() => {
        enableScope(mode)

        return () => {
            disableScope(mode)
        }
    }, [mode, enableScope, disableScope])

    return children
}

export default GeneralShortcutsWrapper
