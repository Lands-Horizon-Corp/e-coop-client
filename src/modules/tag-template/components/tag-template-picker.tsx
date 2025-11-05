import { forwardRef } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook'

import { ChevronDownIcon, RenderIcon, ScanLineIcon } from '@/components/icons'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useModalState } from '@/hooks/use-modal-state'

import { useGetAllTagTemplate } from '..'
import { ITagTemplate } from '../tag-template.types'

interface Props extends IPickerBaseProps<ITagTemplate> {
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
}

const TagTemplatePicker = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            disabled,
            modalState,
            placeholder,
            allowShorcutCommand = false,
            triggerClassName,
            onSelect,
            triggerVariant = 'secondary',
        },
        ref
    ) => {
        const queryClient = useQueryClient()
        const qrScannerModal = useModalState()
        const [state, setState] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )

        const { finalFilterPayloadBase64, bulkSetFilter } = useFilterState({
            defaultFilterMode: 'OR',
        })

        const {
            data = [],
            isPending,
            isLoading,
            isFetching,
        } = useGetAllTagTemplate({
            query: {
                filter: finalFilterPayloadBase64,
            },
            options: {
                enabled: !disabled,
            },
        })

        useHotkeys(
            'Enter',
            (event) => {
                event?.preventDefault()
                if (
                    !value &&
                    !disabled &&
                    !isPending &&
                    !isLoading &&
                    !isFetching &&
                    allowShorcutCommand
                ) {
                    setState(true)
                }
            },
            [
                value,
                disabled,
                isPending,
                isLoading,
                isFetching,
                allowShorcutCommand,
            ]
        )

        return (
            <>
                <HotkeysProvider
                    initiallyActiveScopes={['tag-template-picker']}
                >
                    <GenericPicker
                        isLoading={isPending || isLoading || isFetching}
                        items={data}
                        listHeading={`Matched Results (${data.length})`}
                        onOpenChange={setState}
                        onSearchChange={(searchValue) => {
                            bulkSetFilter(
                                [
                                    {
                                        displayText: 'Tag Name',
                                        field: 'name',
                                    },
                                    {
                                        displayText: 'Tag Description',
                                        field: 'description',
                                    },
                                ],
                                {
                                    displayText: '',
                                    mode: 'equal',
                                    dataType: 'text',
                                    value: searchValue,
                                }
                            )
                        }}
                        onSelect={(member) => {
                            queryClient.setQueryData(['member', value], member)
                            onSelect?.(member)
                            setState(false)
                        }}
                        open={state}
                        otherSearchInputChild={
                            <Button
                                className="size-fit p-2 text-muted-foreground "
                                onClick={() =>
                                    qrScannerModal.onOpenChange(true)
                                }
                                size="icon"
                                variant="ghost"
                            >
                                <ScanLineIcon />
                            </Button>
                        }
                        renderItem={(tagTemplate) => (
                            <div className="w-full py-1">
                                <div className="flex items-center gap-x-2">
                                    <RenderIcon
                                        className="inline mr-1"
                                        icon={tagTemplate.icon}
                                    />
                                    <span className="text-ellipsis text-foreground/80">
                                        {tagTemplate.name}{' '}
                                    </span>
                                </div>
                            </div>
                        )}
                        searchPlaceHolder="Search name or PB no."
                    ></GenericPicker>
                    <Button
                        className={cn(
                            'w-full items-center justify-between rounded-md border p-0 px-2',
                            triggerClassName
                        )}
                        disabled={disabled}
                        onClick={() => setState(true)}
                        ref={ref}
                        type="button"
                        variant={triggerVariant}
                    >
                        <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                            <span className="inline-flex w-full items-center gap-x-2">
                                <div>
                                    {isFetching ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <span>
                                            {value?.icon && (
                                                <RenderIcon
                                                    icon={value?.icon}
                                                />
                                            )}
                                            <span>{value?.name}</span>
                                        </span>
                                    )}
                                </div>
                                {!value ? (
                                    <span className="text-foreground/70">
                                        {value || placeholder || 'Select Tag'}
                                    </span>
                                ) : (
                                    <span>{value.name}</span>
                                )}
                            </span>
                            {allowShorcutCommand && (
                                <span className="mr-2 text-sm">⌘ ↵ </span>
                            )}
                            <span className="mr-1 font-mono text-sm text-muted-foreground">
                                {value?.name || ''}
                            </span>
                        </span>
                        <ChevronDownIcon />
                    </Button>
                </HotkeysProvider>
            </>
        )
    }
)

TagTemplatePicker.displayName = 'Member Picker'

export default TagTemplatePicker
