import { useState } from 'react'

import { cn } from '@/helpers'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { IClassProps } from '@/types'

import { IChargesRateScheme } from '../../charges-rate-scheme.types'
import ChargesRateSchemeCreateUpdateForm from '../forms/charges-rate-scheme-create-update-form'
import ChargesRateSchemesSidebar from './charges-rate-schemes-sidebar'

interface Props extends IClassProps {}

const ChargesRateSchemeEditor = ({ className }: Props) => {
    const [chargesRateScheme, setChargesRateScheme] = useState<
        IChargesRateScheme | undefined
    >()

    const {
        currentAuth: {
            user_organization: {
                branch: {
                    branch_setting: { currency_id },
                },
            },
        },
    } = useAuthUserWithOrgBranch()

    return (
        <div
            className={cn(
                'py-2 w-full min-h-[90vh] max-w-full min-w-0 flex items-ceter gap-x-2',
                className
            )}
        >
            <ChargesRateSchemesSidebar
                className="sticky top-0"
                defaultCurrencyId={currency_id}
                onDeletedScheme={(scheme) => {
                    if (chargesRateScheme?.id === scheme.id)
                        setChargesRateScheme(undefined)
                }}
                onSelect={(selectedScheme) =>
                    setChargesRateScheme(selectedScheme)
                }
                selectedId={chargesRateScheme?.id}
            />
            {chargesRateScheme === undefined ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <p className="text-center text-xs text-muted-foreground/70">
                        No scheme selected or invalid scheme id
                    </p>
                </div>
            ) : (
                <>
                    <ChargesRateSchemeCreateUpdateForm className="w-64" />
                </>
            )}
        </div>
    )
}

export default ChargesRateSchemeEditor
