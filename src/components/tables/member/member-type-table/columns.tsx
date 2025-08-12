import { useQueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { MemberTypeReferenceCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-reference-create-update-form'
import { PushPinSlashIcon, ReferencesIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IMemberType } from '@/types'

import { createUpdateColumns } from '../../common-columns'
import MemberTypeReferenceTable from './member-type-references-table'
import MemberTypeReferenceAction from './member-type-references-table/row-action-context'

export const memberTypeGlobalSearchTargets: IGlobalSearchTargets<IMemberType>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'prefix', displayText: 'Prefix' },
    ]

export interface IMemberTypeTableActionComponentProp {
    row: Row<IMemberType>
}

export interface IMemberTypeTableColumnProps {
    actionComponent?: (props: IMemberTypeTableActionComponentProp) => ReactNode
}

const MemberTypeReferenceTableView = ({
    memberType,
}: {
    memberType: IMemberType
}) => {
    const createModal = useModalState()

    const queryClient = useQueryClient()

    useSubscribe(
        `member_type_reference.create.member_type.${memberType.id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: [
                    'member-type-reference',
                    'member-type-id',
                    memberType.id,
                ],
            })
        }
    )

    useSubscribe(
        `member_type_reference.update.member_type.${memberType.id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: [
                    'member-type-reference',
                    'member-type-id',
                    memberType.id,
                ],
            })
        }
    )

    useSubscribe(
        `member_type_reference.delete.member_type.${memberType.id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: [
                    'member-type-reference',
                    'member-type-id',
                    memberType.id,
                ],
            })
        }
    )

    return (
        <div className="max-w-full min-w-full">
            <MemberTypeReferenceCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        member_type_id: memberType.id,
                    },
                }}
            />
            <MemberTypeReferenceTable
                mode="specific"
                memberTypeId={memberType.id}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberTypeReferenceAction {...prop} />
                )}
                className="max-h-[85vh] min-h-[85vh] w-full"
            />
        </div>
    )
}

const MemberTypeReferenceColumn = ({
    memberType,
}: {
    memberType: IMemberType
}) => {
    const memberTypeReferenceModal = useModalState()

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="min-w-0 max-w-full"
        >
            <Modal
                {...memberTypeReferenceModal}
                className="max-w-[95vw]"
                title={`Member Type Reference for ${memberType.name}`}
            >
                <MemberTypeReferenceTableView memberType={memberType} />
            </Modal>
            <Button
                size="sm"
                variant="secondary"
                className="size-fit px-2 py-1 text-xs text-secondary-foreground/70 hover:text-secondary-foreground"
                onClick={() => {
                    memberTypeReferenceModal.onOpenChange(true)
                }}
            >
                <ReferencesIcon className="mr-2" /> <span>References</span>
            </Button>
        </div>
    )
}

const memberTypeTableColumns = (
    opts?: IMemberTypeTableColumnProps
): ColumnDef<IMemberType>[] => {
    return [
        {
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <HeaderToggleSelect table={table} />
                    {!column.getIsPinned() && (
                        <PushPinSlashIcon
                            onClick={() => column.pin('left')}
                            className="mr-2 size-3.5 cursor-pointer"
                        />
                    )}
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex w-fit items-center gap-x-1 px-0">
                    {opts?.actionComponent?.({ row })}
                    <Checkbox
                        aria-label="Select row"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                </div>
            ),
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: 80,
            minSize: 80,
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Name">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberType>
                            displayText="Name"
                            field="name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { name },
                },
            }) => <div>{name}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 180,
            minSize: 180,
        },
        {
            id: 'prefix',
            accessorKey: 'prefix',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Prefix">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberType>
                            displayText="Prefix"
                            field="prefix"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { prefix },
                },
            }) => <Badge variant="secondary">{prefix}</Badge>,
            enableMultiSort: true,
            enableResizing: true,
            maxSize: 150,
            minSize: 90,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberType>
                            displayText="Description"
                            field="description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { description },
                },
            }) => <div>{description}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 300,
            maxSize: 500,
        },
        {
            id: 'reference',
            header: (props) => (
                <DataTableColumnHeader {...props} title="References" />
            ),
            cell: ({ row: { original } }) => (
                <MemberTypeReferenceColumn memberType={original} />
            ),
            enableMultiSort: true,
            enableResizing: true,
            size: 200,
        },
        ...createUpdateColumns<IMemberType>(),
    ]
}

export default memberTypeTableColumns
