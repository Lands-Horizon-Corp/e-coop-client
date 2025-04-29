import { ColumnDef, Row } from '@tanstack/react-table'
import { Link, ReactNode } from '@tanstack/react-router'

import { Checkbox } from '@/components/ui/checkbox'
import { PushPinSlashIcon } from '@/components/icons'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IFeedback } from '@/types'

export const FeedbackGlobalSearchTargets: IGlobalSearchTargets<IFeedback>[] = [
    { field: 'email', displayText: 'email' },
    { field: 'feedbackType', displayText: 'feedbackType' },
    { field: 'description', displayText: 'description' },
]

export interface IFeedBackTableActionComponentProp {
    row: Row<IFeedback>
}

export interface IFeedbackTableColumnProps {
    actionComponent?: (props: IFeedBackTableActionComponentProp) => ReactNode
}

const AdminCompaniesFeedbackTableColumns = (
    opts: IFeedbackTableColumnProps
): ColumnDef<IFeedback>[] => {
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
            id: 'email',
            accessorKey: 'email',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="email"
                            displayText="email"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { id, email },
                },
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Link
                        params={{ companyId: id }}
                        to="/admin"
                        className="hover:underline"
                    >
                        {email}
                    </Link>
                </div>
            ),
            enablePinning: false,
            size: 200,
            minSize: 200,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { description },
                },
            }) => <div>{description}</div>,
            enablePinning: false,
            minSize: 500,
            maxSize: 800,
        },
        {
            id: 'feedbackType',
            accessorKey: 'feedbackType',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Feedback Type">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="feedbackType"
                            displayText="feedbackType"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { feedbackType },
                },
            }) => <div>{feedbackType}</div>,
            enablePinning: false,
            size: 200,
            minSize: 200,
            maxSize: 300,
        },
    ]
}

export default AdminCompaniesFeedbackTableColumns
