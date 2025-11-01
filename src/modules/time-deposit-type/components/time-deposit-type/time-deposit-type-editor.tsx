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

import { ITimeDepositType } from '../../time-deposit-type.types'
import TimeDepositTypeUpdateForm from '../forms/time-deposit-type-update-form/time-deposit-type-update-form'
import TimeDepositTypesSidebar from './time-deposit-type-sidebar'

interface Props extends IClassProps {}

const TimeDepositSchemeEditor = ({ className }: Props) => {
    const [timeDepositType, setTimeDepositType] = useState<
        ITimeDepositType | undefined
    >()

    const {
        currentAuth: {
            user_organization: {
                branch: {
                    branch_setting: { currency },
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
            <TimeDepositTypesSidebar
                className="sticky top-0"
                defaultCurrency={currency}
                onDeletedType={(selectedTimeDepositType) => {
                    if (timeDepositType?.id === selectedTimeDepositType.id)
                        setTimeDepositType(undefined)
                }}
                onSelect={(selectedTimeDepositType) =>
                    setTimeDepositType(selectedTimeDepositType)
                }
                selectedId={timeDepositType?.id}
            />
            {timeDepositType === undefined ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiIdentificationBadgeFill />
                            </EmptyMedia>
                            <EmptyTitle>No Time Deposit Type</EmptyTitle>
                            <EmptyDescription>
                                No time deposit type yet, please select or
                                create.
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
                <TimeDepositTypeUpdateForm
                    defaultValues={timeDepositType}
                    timeDepositTypeId={timeDepositType.id}
                />
            )}
        </div>
    )
}

export default TimeDepositSchemeEditor
