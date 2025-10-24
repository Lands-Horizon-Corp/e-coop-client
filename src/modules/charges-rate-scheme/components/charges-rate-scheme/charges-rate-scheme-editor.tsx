import { useState } from 'react';



import { cn } from '@/helpers';
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { GridFillIcon } from '@/components/icons'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

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
                <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <GridFillIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Charges Rate Scheme Selected</EmptyTitle>
                        <EmptyDescription>
                            Select or Create a Charges Rate Scheme to view or
                            edit
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <>
                    <ChargesRateSchemeCreateUpdateForm className="w-64" />
                </>
            )}
        </div>
    )
}

export default ChargesRateSchemeEditor
