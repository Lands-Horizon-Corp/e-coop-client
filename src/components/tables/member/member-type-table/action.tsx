import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

// import { ArrowTrendUpIcon } from '@/components/icons'
import { IMemberTypeTableActionComponentProp } from './columns'
// import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberTypeCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-create-update-form'

// import { MemberTypeReferencesTableModal } from '../../member-type-references'
// import MemberTypeReferenceTableOwnerAction from '../../member-type-references/row-actions/member-type-reference-owner-action'
// import { MemberTypeReferenceCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-reference-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberType } from '@/hooks/api-hooks/member/use-member-type'

interface IMemberTypeTableActionProps
    extends IMemberTypeTableActionComponentProp {
    onMemberTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberTypeTableAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeTableActionProps) => {
    const queryClient = useQueryClient()
    const [updateModalForm, setUpdateModalForm] = useState(false)
    // const [createModalForm, setCreateModalForm] = useState(false)
    // const [viewReferencesTable, setViewReferencesTable] = useState(false)
    const memberType = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberType, mutate: deleteMemberType } =
        useDeleteMemberType({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberTypeCreateUpdateFormModal
                    formProps={{
                        memberTypeId: memberType.id,
                        defaultValues: memberType,
                        onSuccess: () => {
                            setUpdateModalForm(false)
                        },
                    }}
                    title="Update Member Type"
                    description="Modify/Update members type..."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
                {/* <MemberTypeReferenceCreateUpdateFormModal
                    formProps={{
                        defaultValues: {
                            memberTypeId: memberType.id,
                        },
                        disabledFields: ['memberTypeId'],
                    }}
                    open={createModalForm}
                    onOpenChange={setCreateModalForm}
                />
                <MemberTypeReferencesTableModal
                    open={viewReferencesTable}
                    onOpenChange={setViewReferencesTable}
                    tableProps={{
                        actionComponent: (props) => (
                            <MemberTypeReferenceTableOwnerAction {...props} />
                        ),
                        memberTypeId: memberType.id,
                        toolbarProps: {
                            createActionProps: {
                                onClick: () => setCreateModalForm(true),
                            },
                        },
                    }}
                /> */}
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberType,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Member Type',
                            description:
                                'Are you sure to delete this Member Type?',
                            onConfirm: () => deleteMemberType(memberType.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={
                    <>
                        {/* <DropdownMenuItem
                            onClick={() => setViewReferencesTable(true)}
                        >
                            <ArrowTrendUpIcon className="mr-2" />
                            Browse References
                        </DropdownMenuItem> */}
                        {/* Additional actions can be added here */}
                    </>
                }
            />
        </>
    )
}

export default MemberTypeTableAction
