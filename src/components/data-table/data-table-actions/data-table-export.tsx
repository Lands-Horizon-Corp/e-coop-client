import { toReadableDate } from '@/helpers/date-utils'
import { TModelName } from '@/modules/generated-report'
import GeneratedReportCreateFormModal from '@/modules/generated-report/components/forms/generate-create-modal'
import { Table } from '@tanstack/react-table'

import { ExportIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

export interface IDataTableExportProps<TData> {
    table: Table<TData>
    disabled?: boolean
    isLoading?: boolean

    filters: string
    url: string
    model?: TModelName
}

const DataTableExport = <TData,>({
    filters,
    url,
    model,
    disabled = false,
    isLoading = false,
}: IDataTableExportProps<TData>) => {
    const modalState = useModalState(false)

    return (
        <>
            <GeneratedReportCreateFormModal
                formProps={{
                    disabledFields: ['url'],
                    defaultValues: {
                        filter_search: filters,
                        name: `${model}'s-report-${toReadableDate(
                            new Date(),
                            'MM-dd-yyyy'
                        )}`.toLowerCase(),
                        description: `${model} ${new Date()}`,
                        url,
                        model,
                    },
                }}
                {...modalState}
            />
            <Button
                className="gap-x-1 rounded-md"
                disabled={disabled || isLoading}
                onClick={() => {
                    modalState.onOpenChange(true)
                }}
                size="sm"
                variant={'secondary'}
            >
                <ExportIcon className="mr-1 size-4" />
                {isLoading ? <LoadingSpinner /> : 'Export'}
            </Button>
        </>
    )
}

export default DataTableExport
