import { ReactNode } from 'react'

import { SHORTCUT_SCOPES } from '@/constants'
import { cn } from '@/helpers/tw-utils'
import { Table } from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

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
import { useShortcutContext } from '../shorcuts/general-shortcuts-wrapper'
import DatatableColumnVisibility from './data-table-actions/data-table-column-visibility'
import DataTableCreateAction, {
    IDataTableCreateActionProps,
} from './data-table-actions/data-table-create-action'
import { IDataTableFilterLogicOptionProps } from './data-table-actions/data-table-options-menu/filter-logic-option'
import DataTableUnselect from './data-table-actions/data-table-unselect'
import DataTableGlobalSearch, {
    IGlobalSearchProps,
} from './data-table-filters/data-table-global-search'

export interface IDataTableToolbarProps<TData> extends IClassProps {
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
    const { setActiveScope, activeScope } = useShortcutContext()

    useHotkeys(
        'Enter',
        (e) => {
            e.preventDefault()
            if (createActionProps && !hideCreateButton) {
                createActionProps.onClick()
            }
        },
        {
            scopes: [SHORTCUT_SCOPES.DATA_TABLE],
        },
        [createActionProps, hideCreateButton]
    )

    const hanldeSetScope = () => {
        if (activeScope !== SHORTCUT_SCOPES.DATA_TABLE) {
            setActiveScope(SHORTCUT_SCOPES.DATA_TABLE)
        }
    }

    return (
        <div
            className="ecoop-scroll flex w-full max-w-full shrink-0 items-center justify-between gap-x-2 overflow-auto"
            onClick={hanldeSetScope}
            onFocus={hanldeSetScope}
            onMouseOver={hanldeSetScope}
        >
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
                        className="rounded-none border first:rounded-l-md last:rounded-r-md"
                        table={table}
                    />
                    <DataTableOptionsMenu
                        className="rounded-none border first:rounded-l-md last:rounded-r-md"
                        filterLogicOption={filterLogicProps}
                        scrollOption={scrollableProps}
                        table={table}
                    />
                </div>

                {exportActionProps && !hideExportButton && (
                    <>
                        <Separator
                            className="h-full min-h-7"
                            orientation="vertical"
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
