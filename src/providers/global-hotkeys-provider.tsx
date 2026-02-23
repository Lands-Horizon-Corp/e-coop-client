import { ReactNode } from 'react'

import { useRouter } from '@tanstack/react-router'

import { router } from '@/app'
import { useHotkeys } from 'react-hotkeys-hook'

interface HotkeysProviderProps {
    children?: ReactNode
}

const GlobalHotkeysProvider = ({ children }: HotkeysProviderProps) => {
    const router = useRouter()

    // F2 → Member Profile Page
    useHotkeys(
        'f2',
        (e) => {
            e.preventDefault()

            router.navigate({
                to: `${getBaseUrl()}/view-members`,
            })
        },
        {
            enableOnFormTags: true, // allow even when focused on inputs
            preventDefault: true,
        }
    )

    return <>{children}</>
}

export function getBaseUrl(): string {
    const matches = router.state.matches

    const lastMatch = matches[matches.length - 1]

    const { orgname, branchname } =
        (lastMatch?.params as {
            orgname?: string
            branchname?: string
        }) ?? {}

    return `/org/${orgname}/branch/${branchname}`
}

export default GlobalHotkeysProvider
