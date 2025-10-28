import { useState } from 'react'

import { cn } from '@/helpers'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
// import ChargesRateSchemeCreateUpdateForm from '@/modules/charges-rate-scheme/components/forms/charges-rate-scheme-update-form'
import { RefreshCcwIcon } from 'lucide-react'
import { PiIdentificationBadgeFill } from 'react-icons/pi'

import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

import { IClassProps } from '@/types'

import { ITimeDepositComputation } from '../../time-deposit-computation.types'
import ChargesRateSchemesSidebar from './time-deposit-scheme-sidebar'

interface Props extends IClassProps {}

const TimeDepositSchemeEditor = ({ className }: Props) => {
    const [chargesRateScheme, setChargesRateScheme] = useState<
        ITimeDepositComputation | undefined
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
                onDeletedComputation={(scheme) => {
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
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiIdentificationBadgeFill />
                            </EmptyMedia>
                            <EmptyTitle>No Notifications</EmptyTitle>
                            <EmptyDescription>
                                You&apos;re all caught up. New notifications
                                will appear here.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button size="sm" variant="outline">
                                <RefreshCcwIcon />
                                Refresh
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            ) : (
                <>
                    {/* <ChargesRateSchemeCreateUpdateFormModal className="w-64" /> */}
                </>
            )}
        </div>
    )
}

export default TimeDepositSchemeEditor
