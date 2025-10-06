import { useMemo, useState } from 'react'

import {
    AccountTagFormModal,
    IAccountTag,
    useDeleteById,
    useGetAll,
} from '@/modules/account-tag'

import CopyTextButton from '@/components/copy-text-button'
import { IconContainer } from '@/components/icon-container'
import { EditPencilIcon, TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import useDebounce from '@/hooks/use-debounce'

const AccountTag = () => {
    const [onOpenCreateUpdateAccountTag, setOnOpenCreateUpdateAccountTag] =
        useState(false)
    const [selectedTag, setSelectedTag] = useState<IAccountTag | null>(null)
    const [search, setSearch] = useState('')

    const debouncedSearch = useDebounce(search, 200)

    const { data: accountTags, refetch } = useGetAll()
    const { mutate: removeAccountTag } = useDeleteById()

    const handleRemveAccountTag = (tagId: string) => {
        removeAccountTag(tagId, {
            onSuccess: () => {
                setSelectedTag(null)
                setOnOpenCreateUpdateAccountTag(false)
            },
        })
    }

    const hasAccountTag = accountTags && accountTags.length > 0

    const filteredTags = useMemo(() => {
        return accountTags?.filter((tag) =>
            tag.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    }, [accountTags, debouncedSearch])

    return (
        <div>
            <AccountTagFormModal
                open={onOpenCreateUpdateAccountTag}
                onOpenChange={setOnOpenCreateUpdateAccountTag}
                title={
                    selectedTag ? 'Update Account Tag' : 'Create Account Tag'
                }
                description={
                    selectedTag
                        ? 'Update the account tag details'
                        : 'Create a new account tag'
                }
                className="!max-w-fit min-w-[45vw] !w-fit"
                formProps={{
                    defaultValues: selectedTag || {},
                    accountTagId: selectedTag?.id,
                    onSuccess: () => {
                        refetch()
                        setSelectedTag(null)
                    },
                }}
            />

            <Popover modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="text-sm font-semibold"
                    >
                        Tags
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-64">
                    {!hasAccountTag ? (
                        <div className="flex items-center flex-col border-2 border-dashed border-primary  dark:border-primary/70 rounded-xl justify-center p-5">
                            <span className="text-muted-foreground text-xs">
                                No account tags available
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setOnOpenCreateUpdateAccountTag(true)
                                }}
                                className="mt-2 w-full"
                                variant={'ghost'}
                                size={'sm'}
                            >
                                Add Tag
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold">
                                        Account Tags
                                    </label>
                                    <span className="text-xs text-muted-foreground">
                                        {filteredTags?.length || 0} result
                                        {filteredTags?.length === 1 ? '' : 's'}
                                    </span>
                                </div>

                                <Input
                                    placeholder="Search tags..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>

                            <ScrollArea className="flex w-full flex-col py-2 max-h-[16rem]">
                                {filteredTags?.length ? (
                                    filteredTags.map((tag) => (
                                        <div className="mt-1" key={tag.id}>
                                            <ContextMenu>
                                                <ContextMenuTrigger asChild>
                                                    <Button
                                                        style={{
                                                            backgroundColor:
                                                                tag.color,
                                                        }}
                                                        size={'sm'}
                                                        key={tag.id}
                                                        variant="ghost"
                                                        className="flex truncate max-w-52 items-center w-full text-start justify-between hover:scale-102 transition-transform duration-200 ease-in-out"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <div className="truncate gap-x-2 flex items-center">
                                                            <CopyTextButton
                                                                textContent={
                                                                    tag.name
                                                                }
                                                            />
                                                            <p className="truncate">
                                                                {tag.name}
                                                            </p>
                                                        </div>
                                                        <IconContainer
                                                            name={tag.icon}
                                                            className=""
                                                        />
                                                    </Button>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent>
                                                    <ContextMenuItem
                                                        className="cursor-pointer hover:bg-secondary"
                                                        onClick={() => {
                                                            setSelectedTag(tag)
                                                            setOnOpenCreateUpdateAccountTag(
                                                                true
                                                            )
                                                        }}
                                                    >
                                                        <EditPencilIcon className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </ContextMenuItem>
                                                    <ContextMenuItem
                                                        onClick={() =>
                                                            handleRemveAccountTag(
                                                                tag.id
                                                            )
                                                        }
                                                        className="cursor-pointer hover:bg-secondary"
                                                    >
                                                        <TrashIcon className="mr-2 h-4 w-4 text-destructive" />
                                                        Delete
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-muted-foreground p-4 text-center">
                                        No tags match your search.
                                    </div>
                                )}
                            </ScrollArea>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setOnOpenCreateUpdateAccountTag(true)
                                }}
                                size={'sm'}
                                className="w-full"
                            >
                                Add Tag
                            </Button>
                        </>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default AccountTag
