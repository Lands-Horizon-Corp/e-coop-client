import {
    ComponentPropsWithoutRef,
    forwardRef,
    useEffect,
    useState,
} from 'react'

import { cn } from '@/helpers/tw-utils'
import { useGetMemberProfileByAreaId } from '@/modules/member-profile'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TEntityId } from '@/types'

import { TUserLocation, dummyUserLocations } from '../../area.types'

interface Props extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: TUserLocation) => void
    areaId: TEntityId
    onSave?: () => void
    multipleSelection?: boolean
}

type TSelectedMember = TUserLocation & { selected: boolean }

const MemberAreaPicker = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select Member...',
            areaId,
            onChange,
            onSave,
            multipleSelection = true,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = useState(false)

        const { data, isLoading } = useGetMemberProfileByAreaId({ areaId })

        const selected = data?.find((m) => m.id === value)

        const [modifiedData, setModifiedData] = useState<
            TSelectedMember[] | null | undefined
        >(
            data?.map((member) => ({
                ...member,
                selected: false,
            }))
        )

        useEffect(() => {
            if (dummyUserLocations) {
                const modified = dummyUserLocations.map((member) => ({
                    ...member,
                    selected: false,
                }))
                setModifiedData(modified)
            }
        }, [dummyUserLocations])

        const handleMutipleSelect = (member: TUserLocation) => {
            if (!multipleSelection) {
                onChange?.(member)
                setOpen(false)
                return
            }

            const isAlreadySelected = modifiedData?.some(
                (m) => m.id === member.id && m.selected
            )

            setModifiedData((prev) => {
                if (!prev) return [{ ...member, selected: true }]
                if (isAlreadySelected) {
                    return [
                        ...prev.map((m) =>
                            m.id === member.id ? { ...m, selected: false } : m
                        ),
                    ]
                } else {
                    return [...prev, { ...member, selected: true }]
                }
            })
            onChange?.(member)
        }

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        ref={ref}
                        role="combobox"
                        variant="outline"
                    >
                        {isLoading && <LoadingSpinner />}
                        {selected ? (
                            <span className="truncate">
                                {selected.full_name}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        <ChevronDownIcon className="opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        {/* 🔥 Sticky Header */}
                        <div className="sticky top-0 z-10 bg-background border-b p-2 flex gap-2">
                            <CommandInput
                                className="h-9"
                                placeholder="Search member..."
                            />
                            {onSave && (
                                <Button onClick={onSave} size="sm">
                                    Save
                                </Button>
                            )}
                        </div>

                        {/* 🔥 Content */}
                        {isLoading ? (
                            <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                                <LoadingSpinner className="mr-2" />
                                Loading members...
                            </div>
                        ) : (
                            <CommandList className="max-h-64 ecoop-scroll">
                                <CommandEmpty>No members found.</CommandEmpty>

                                <CommandGroup>
                                    {/* {data?.map((member) => {
                                        const isSelected = member.id === value

                                        return (
                                            <CommandItem
                                                className="flex items-center justify-between gap-2 px-3 py-2"
                                                key={member.id}
                                                onSelect={() => {
                                                    onChange?.(member)
                                                    setOpen(false)
                                                }}
                                                value={member.full_name}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                        {member.full_name?.charAt(
                                                            0
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-sm font-medium">
                                                            {member.full_name}
                                                        </span>
                                                     
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <CheckIcon className="h-4 w-4 text-primary" />
                                                )}
                                            </CommandItem>
                                        )
                                    })} */}

                                    {modifiedData?.map((member) => {
                                        const isSelected = member.id === value

                                        return (
                                            <CommandItem
                                                className="flex items-center justify-between gap-2 px-3 py-2"
                                                key={member.id}
                                                onSelect={() => {
                                                    if (multipleSelection) {
                                                        handleMutipleSelect(
                                                            member
                                                        )
                                                        return
                                                    }
                                                    // setOpen(false)
                                                }}
                                                value={member.full_name}
                                            >
                                                {/* 🔥 Left: Avatar + Info */}
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                        {member.full_name?.charAt(
                                                            0
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-sm font-medium">
                                                            {member.full_name}
                                                        </span>
                                                        {/* optional secondary info */}
                                                        {/* {member.email && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {member.email}
                                                            </span>
                                                        )} */}
                                                    </div>
                                                </div>

                                                {/* 🔥 Right: Selected indicator */}
                                                {isSelected && (
                                                    <CheckIcon className="h-4 w-4 text-primary" />
                                                )}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </CommandList>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

export default MemberAreaPicker
