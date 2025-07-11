import Fuse from 'fuse.js'
import { forwardRef, useMemo, useState } from 'react'

import { cn } from '@/lib'

import { ChevronDownIcon, ShieldFillIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useAllPermissionTemplates } from '@/hooks/api-hooks/use-permission-template'
import { useInternalState } from '@/hooks/use-internal-state'
import { useModalState } from '@/hooks/use-modal-state'

import { IPermissionTemplate, IPickerBaseProps } from '@/types'

import { PermissionViewModal } from '../permission/permission-view'
import GenericPicker from './generic-picker'

interface Props extends IPickerBaseProps<IPermissionTemplate> {
    value?: IPermissionTemplate
    onSelect?: (selectedPermission: IPermissionTemplate) => void
    allowShorcutCommand?: boolean
}

const PermissionPicker = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            disabled,
            allowShorcutCommand = false,
            placeholder,
            modalState,
            triggerClassName,
            onSelect,
        },
        ref
    ) => {
        const [open, setOpen] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )
        const [searchValue, setSearchValue] = useState('')

        const {
            data = [],
            isPending,
            isLoading,
            isFetching,
        } = useAllPermissionTemplates({
            enabled: !disabled,
            showMessage: false,
        })

        const fuse = useMemo(() => {
            return new Fuse(data, {
                keys: ['name', 'description'],
                threshold: 0.3,
            })
        }, [data])

        const filteredItems = useMemo(() => {
            if (!searchValue) return data
            return fuse.search(searchValue).map((result) => result.item)
        }, [fuse, searchValue, data])

        return (
            <>
                <GenericPicker
                    items={filteredItems}
                    open={open}
                    listHeading={`Matched Results (${filteredItems.length})`}
                    searchPlaceHolder="Search template name or description"
                    isLoading={isPending || isLoading || isFetching}
                    onSelect={(permissionTemplate) => {
                        onSelect?.(permissionTemplate)
                        setOpen(false)
                    }}
                    onOpenChange={setOpen}
                    onSearchChange={setSearchValue}
                    renderItem={(permissionTemplate) => (
                        <PermissionItemDisplay
                            key={permissionTemplate.id}
                            permissionTemplate={permissionTemplate}
                        />
                    )}
                />
                <Button
                    ref={ref}
                    role="button"
                    type="button"
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => setOpen((prev) => !prev)}
                    className={cn(
                        'w-full items-center justify-between rounded-md border bg-background p-0 px-2',
                        triggerClassName
                    )}
                >
                    <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            {!value ? (
                                <span className="text-foreground/70">
                                    {value ||
                                        placeholder ||
                                        'Select permission template'}
                                </span>
                            ) : (
                                <span>{value?.name}</span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵ </span>
                        )}
                    </span>
                    <ChevronDownIcon />
                </Button>
            </>
        )
    }
)

const PermissionItemDisplay = ({
    permissionTemplate,
}: {
    permissionTemplate: IPermissionTemplate
}) => {
    const permissionView = useModalState()

    return (
        <div className="flex w-full rounded-2xl items-center justify-between py-1">
            <PermissionViewModal
                {...permissionView}
                permissions={permissionTemplate.permissions}
            />
            <div className="flex flex-col gap-y-1 max-w-full min-w-0">
                <p className="font-semibold text-foreground/80">
                    {permissionTemplate.name}
                </p>
                <p className="text-xs text-foreground/50 truncate max-w-full min-w-0">
                    {permissionTemplate.description}
                </p>
            </div>
            <div
                className="text-right"
                onClick={(e) => {
                    permissionView.onOpenChange(true)
                    e.stopPropagation()
                }}
            >
                <Badge
                    variant="success"
                    className="opacity-70 hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
                    onClick={(e) => {
                        permissionView.onOpenChange(true)
                        e.stopPropagation()
                    }}
                >
                    <ShieldFillIcon className="inline mr-1 !size-3" />{' '}
                    {permissionTemplate.permissions.length} permissions
                </Badge>
                <p className="text-xs underline text-muted-foreground/40 hover:text-foreground ease-out duration-200">
                    view permissions
                </p>
            </div>
        </div>
    )
}

PermissionPicker.displayName = 'PermissionPicker'

export default PermissionPicker
