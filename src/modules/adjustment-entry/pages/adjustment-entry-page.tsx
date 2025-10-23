import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { CurrencyCombobox, ICurrency } from '@/modules/currency'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { IEmployee } from '@/modules/user'
import { IUserOrganization } from '@/modules/user-organization'

import PageContainer from '@/components/containers/page-container'
import { XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { AdjustmentEntryTotal } from '../components/adjustment-entry-total'
import { AdjustmentEntryCreateUpdateFormModal } from '../components/forms/adjustment-entry-form-modal'
import AdjustmentEntryTable from '../components/tables'

const AdjustmentEntryPage = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const [userOrganization, setUserOrganization] = useState<
        IUserOrganization<IEmployee> | undefined
    >(user_organization as IUserOrganization<IEmployee>)
    const [currency, setCurrency] = useState<ICurrency>(
        user_organization?.branch?.branch_setting?.currency
    )

    return (
        <PageContainer>
            <AdjustmentEntryCreateUpdateFormModal
                {...createModal}
                description="Enter the details for the new adjustment entry."
                formProps={{
                    baseCurrency: currency,
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ['adjustment-entry', 'total'],
                        })
                    },
                }}
                title="Create Adjustment Entry"
            />
            <AdjustmentEntryTotal
                className="selft-start w-full"
                currencyId={currency?.id as TEntityId}
                mode={userOrganization ? 'currency-employee' : 'currency'}
                userOrganizationId={userOrganization?.id as TEntityId}
            >
                <div className="flex flex-1 items-center gap-x-2">
                    <CurrencyCombobox
                        className="w-fit"
                        onChange={(currency) => setCurrency(currency)}
                        value={currency?.id}
                    />
                    <Separator className="!h-8" orientation="vertical" />
                    <div className="w-fit flex items-center gap-x-2">
                        <EmployeePicker
                            onSelect={(employee) =>
                                setUserOrganization(
                                    employee as IUserOrganization<IEmployee>
                                )
                            }
                            triggerClassName="flex-1"
                            value={
                                userOrganization as IUserOrganization<IEmployee>
                            }
                        />
                        {userOrganization && (
                            <Button
                                className="size-fit p-2"
                                hoverVariant="destructive"
                                onClick={() => setUserOrganization(undefined)}
                                size="icon"
                                variant="outline"
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>
                </div>
            </AdjustmentEntryTotal>

            <AdjustmentEntryTable
                className="max-h-[90vh] min-h-[80vh] w-full py-2"
                currencyId={currency?.id as TEntityId}
                mode={userOrganization ? 'currency-employee' : 'currency'}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                userOrganizationId={userOrganization?.id as TEntityId}
            />
        </PageContainer>
    )
}

export default AdjustmentEntryPage
