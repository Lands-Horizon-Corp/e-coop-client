import { forwardRef } from 'react'

import { cn } from '@/lib'

import { BrowseExcludeIncludeAccountsCreateUpdateFormModal } from '@/components/forms/loan/browse-exclude-include-account-create-update-form'
import { IncludeNegativeAccountCreateUpdateFormModal } from '@/components/forms/loan/include-negative-account-create-update-form'
import BrowseExcludeIncludeAccountTable from '@/components/tables/loan-tables/browse-exclude-include-accounts-table'
import BrowseExcludeIncludeAccountAction from '@/components/tables/loan-tables/browse-exclude-include-accounts-table/action'
import IncludeNegativeAccountTable from '@/components/tables/loan-tables/include-negative-accounts-table'
import IncludeNegativeAccountAction from '@/components/tables/loan-tables/include-negative-accounts-table/action'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

interface Props extends IClassProps {
    computationSheetId: TEntityId
}

const NegativeIncludeExclude = forwardRef<HTMLDivElement, Props>(
    ({ className, computationSheetId }, ref) => {
        const includeNegativeAccountCreateModal = useModalState()
        const browseExcludeIncludeAccountsCreateModal = useModalState()

        return (
            <div className={cn(' min-h-[70vh]', className)} ref={ref}>
                <div className="grid grid-cols-2 gap-x-4">
                    <div className="space-y-2 bg-popover rounded-xl p-4 ">
                        <p>Include Negative Accounts</p>
                        <IncludeNegativeAccountCreateUpdateFormModal
                            {...includeNegativeAccountCreateModal}
                            formProps={{
                                defaultValues: {
                                    computation_sheet_id: computationSheetId,
                                },
                            }}
                        />
                        <IncludeNegativeAccountTable
                            actionComponent={(props) => (
                                <IncludeNegativeAccountAction {...props} />
                            )}
                            toolbarProps={{
                                createActionProps: {
                                    onClick: () =>
                                        includeNegativeAccountCreateModal.onOpenChange(
                                            true
                                        ),
                                },
                            }}
                            computationSheetId={computationSheetId}
                            className="max-h-[70vh] max-w-full min-w-0 min-h-[70vh]"
                        />
                    </div>
                    <div className="space-y-2 bg-popover rounded-xl p-4 ">
                        <p>Browse Excluded/Included Accounts</p>
                        <BrowseExcludeIncludeAccountsCreateUpdateFormModal
                            {...browseExcludeIncludeAccountsCreateModal}
                            formProps={{
                                defaultValues: {
                                    computation_sheet_id: computationSheetId,
                                },
                            }}
                        />
                        <BrowseExcludeIncludeAccountTable
                            actionComponent={(props) => (
                                <BrowseExcludeIncludeAccountAction {...props} />
                            )}
                            toolbarProps={{
                                createActionProps: {
                                    onClick: () =>
                                        browseExcludeIncludeAccountsCreateModal.onOpenChange(
                                            true
                                        ),
                                },
                            }}
                            computationSheetId={computationSheetId}
                            className="max-h-[70vh] max-w-full min-w-0 min-h-[70vh]"
                        />
                    </div>
                </div>
            </div>
        )
    }
)

NegativeIncludeExclude.displayName = 'NegativeIncludeExclude'

export default NegativeIncludeExclude
