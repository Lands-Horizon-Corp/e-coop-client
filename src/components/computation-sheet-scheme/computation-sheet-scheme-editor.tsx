import { useState } from 'react'

import { cn } from '@/lib'

import { IClassProps, IComputationSheet } from '@/types'

import LoanSchemeSidebar from './computation-schemes-sidebar'
import LoanSchemeDisplay from './computation-sheet-scheme-display'

interface Props extends IClassProps {}

const LoanSchemeEditor = ({ className }: Props) => {
    const [computationSheet, setComputationSheet] = useState<
        IComputationSheet | undefined
    >()

    return (
        <div
            className={cn(
                'py-2 w-full min-h-[90vh] max-w-full min-w-0 flex items-ceter gap-x-2',
                className
            )}
        >
            <LoanSchemeSidebar
                selectedId={computationSheet?.id}
                onDeletedScheme={(scheme) => {
                    if (computationSheet?.id === scheme.id)
                        setComputationSheet(undefined)
                }}
                onSelect={(selectedScheme) =>
                    setComputationSheet(selectedScheme)
                }
            />
            {computationSheet === undefined ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <p className="text-center text-xs text-muted-foreground/70">
                        No scheme selected or invalid scheme id
                    </p>
                </div>
            ) : (
                <LoanSchemeDisplay selectedId={computationSheet.id} />
            )}
        </div>
    )
}

export default LoanSchemeEditor
