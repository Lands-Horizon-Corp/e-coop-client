import { forwardRef } from 'react'

import { cn } from '@/helpers'
import BrowseExcludeIncludeAccountTable from '@/modules/browse-exclude-include-accounts/components/browse-exclude-include-accounts-table'
import { BrowseExcludeIncludeAccountsCreateUpdateFormModal } from '@/modules/browse-exclude-include-accounts/components/forms/browse-exclude-include-account-create-update-form'
import { IncludeNegativeAccountCreateUpdateFormModal } from '@/modules/include-negative-accounts/components/forms/include-negative-account-create-update-form'
import IncludeNegativeAccountTable from '@/modules/include-negative-accounts/components/include-negative-accounts-table'

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
            <div className={cn(' min-h-[70vh] space-y-4', className)} ref={ref}>
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
                        className="max-h-[40vh] max-w-full min-w-0 min-h-[40vh]"
                        computationSheetId={computationSheetId}
                        toolbarProps={{
                            createActionProps: {
                                onClick: () =>
                                    includeNegativeAccountCreateModal.onOpenChange(
                                        true
                                    ),
                            },
                        }}
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
                        className="max-h-[45vh] max-w-full min-w-0 min-h-[45vh]"
                        computationSheetId={computationSheetId}
                        toolbarProps={{
                            createActionProps: {
                                onClick: () =>
                                    browseExcludeIncludeAccountsCreateModal.onOpenChange(
                                        true
                                    ),
                            },
                        }}
                    />
                </div>
            </div>
        )
    }
)

NegativeIncludeExclude.displayName = 'NegativeIncludeExclude'

export default NegativeIncludeExclude
