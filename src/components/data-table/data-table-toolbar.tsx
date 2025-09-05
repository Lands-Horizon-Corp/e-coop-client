import { ReactNode } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Table } from '@tanstack/react-table'

import DataTableActiveFilters from '@/components/data-table/data-table-actions/data-table-active-filters'
import DataTableDeleteSelected from '@/components/data-table/data-table-actions/data-table-delete-selected'
import { type IDataTableDeleteSelectedProps } from '@/components/data-table/data-table-actions/data-table-delete-selected'
import DataTableExportButton from '@/components/data-table/data-table-actions/data-table-export'
import { type IDataTableExportProps } from '@/components/data-table/data-table-actions/data-table-export'
import DataTableOptionsMenu from '@/components/data-table/data-table-actions/data-table-options-menu'
import { type IDataTableScrollableOptionProps } from '@/components/data-table/data-table-actions/data-table-options-menu/scroll-option'
import { Separator } from '@/components/ui/separator'

import { IClassProps } from '@/types'

import RefreshButton, { IRefreshButtonProps } from '../buttons/refresh-button'
import DatatableColumnVisibility from './data-table-actions/data-table-column-visibility'
import DataTableCreateAction, {
    IDataTableCreateActionProps,
} from './data-table-actions/data-table-create-action'
import { IDataTableFilterLogicOptionProps } from './data-table-actions/data-table-options-menu/filter-logic-option'
import DataTableUnselect from './data-table-actions/data-table-unselect'
import DataTableGlobalSearch, {
    IGlobalSearchProps,
} from './data-table-filters/data-table-global-search'

export interface IDataTableToolbarProps<TData = unknown> extends IClassProps {
    table: Table<TData>
    refreshActionProps: IRefreshButtonProps
    globalSearchProps?: IGlobalSearchProps<TData>
    scrollableProps?: IDataTableScrollableOptionProps
    filterLogicProps?: IDataTableFilterLogicOptionProps
    exportActionProps?: Omit<IDataTableExportProps<TData>, 'table'>
    deleteActionProps?: Omit<IDataTableDeleteSelectedProps<TData>, 'table'>
    createActionProps?: IDataTableCreateActionProps
    otherActionRight?: ReactNode
    hideRefreshButton?: boolean
    hideDeleteButton?: boolean
    hideCreateButton?: boolean
    hideExportButton?: boolean
    otherActionLeft?: ReactNode
}

const DataTableToolbar = <TData,>({
    table,
    scrollableProps,
    hideCreateButton,
    hideDeleteButton,
    hideExportButton,
    hideRefreshButton,
    otherActionRight,
    filterLogicProps,
    globalSearchProps,
    deleteActionProps,
    exportActionProps,
    createActionProps,
    refreshActionProps,
    otherActionLeft,
}: IDataTableToolbarProps<TData>) => {
    return (
        <div className="ecoop-scroll flex w-full max-w-full shrink-0 items-center justify-between gap-x-2 overflow-auto">
            <div className="flex items-center gap-x-2">
                {globalSearchProps ? (
                    <DataTableGlobalSearch {...globalSearchProps} />
                ) : null}
                <DataTableActiveFilters />
                {otherActionLeft}
            </div>
            <div className="flex items-center gap-x-2">
                <div className="flex items-center">
                    <DataTableUnselect
                        className="rounded-none border first:rounded-l-md last:rounded-r-md"
                        table={table}
                    />
                    {deleteActionProps && !hideDeleteButton && (
                        <DataTableDeleteSelected
                            table={table}
                            {...{
                                ...deleteActionProps,
                                className: cn(
                                    'rounded-none border first:rounded-l-md last:rounded-r-md',
                                    deleteActionProps.className
                                ),
                            }}
                        />
                    )}
                    {!hideRefreshButton && (
                        <RefreshButton
                            {...{
                                ...refreshActionProps,
                                className: cn(
                                    'rounded-none border first:rounded-l-md last:rounded-r-md',
                                    refreshActionProps.className
                                ),
                            }}
                        />
                    )}
                    <DatatableColumnVisibility
                        table={table}
                        className="rounded-none border first:rounded-l-md last:rounded-r-md"
                    />
                    <DataTableOptionsMenu
                        table={table}
                        scrollOption={scrollableProps}
                        filterLogicOption={filterLogicProps}
                        className="rounded-none border first:rounded-l-md last:rounded-r-md"
                    />
                </div>

                {exportActionProps && !hideExportButton && (
                    <>
                        <Separator
                            orientation="vertical"
                            className="h-full min-h-7"
                        />
                        <DataTableExportButton
                            table={table}
                            {...exportActionProps}
                        />
                    </>
                )}
                {createActionProps && !hideCreateButton && (
                    <DataTableCreateAction {...createActionProps} />
                )}
                {otherActionRight}
            </div>
        </div>
    )
}

export default DataTableToolbar
