import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    ILoanTag,
    useCreateLoanTag,
    useDeleteLoanTagById,
    useGetAllLoanTag,
} from '@/modules/loan-tag'
import TagTemplatePicker from '@/modules/tag-template/components/tag-template-picker'

import { RenderIcon, TIcon, TagIcon, XIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

export function LoanTagsManager({
    loanTransactionId,
    defaultLoanTags,
}: {
    loanTransactionId: TEntityId
    defaultLoanTags?: ILoanTag[]
    onSuccess?: () => void
}) {
    const tagPickerModal = useModalState()

    const {
        data: loanTags = [],
        isPending,
        refetch,
    } = useGetAllLoanTag({
        mode: 'loan-transaction',
        loanTransactionId,
        options: { initialData: defaultLoanTags, retry: 0 },
    })

    const createLoanTagMutation = useCreateLoanTag()

    return (
        <div className="flex flex-wrap gap-2">
            <TagTemplatePicker
                modalState={tagPickerModal}
                triggerClassName="hidden"
                onSelect={({ color, name, description, icon }) => {
                    toast.promise(
                        createLoanTagMutation.mutateAsync({
                            name,
                            icon,
                            color,
                            description,
                            loan_transaction_id: loanTransactionId,
                        }),
                        {
                            loading: 'Adding tag...',
                            success: 'Tag Added',
                            error: (error) =>
                                serverRequestErrExtractor({ error }),
                        }
                    )
                }}
            />
            {loanTags.map((tag) => (
                <LoanTagChip key={tag.id} tag={tag} onRemove={refetch} />
            ))}
            {isPending && (
                <LoadingSpinner className="size-3 mt-2 text-muted-foreground/70 inline" />
            )}
            <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-dashed px-3 py-1 rounded-full"
                onClick={() => tagPickerModal.onOpenChange(true)}
            >
                <TagIcon className="inline text-accent/40" /> Add Tag
            </Button>
        </div>
    )
}

const LoanTagChip = ({
    tag,
    onRemove,
}: {
    tag: ILoanTag
    onRemove?: () => void
}) => {
    const deleteMutation = useDeleteLoanTagById({
        options: { onSuccess: onRemove },
    })

    return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full border bg-accent/30 text-accent-foreground">
            {tag.icon && <RenderIcon icon={tag.icon as TIcon} />}
            <span>{tag.name}</span>
            <Button
                disabled
                size="icon"
                type="button"
                onClick={() =>
                    toast.promise(deleteMutation.mutateAsync(tag.id), {
                        loading: 'Deleting tag...',
                        success: 'Tag deleted',
                        error: (error) => serverRequestErrExtractor({ error }),
                    })
                }
                className="ml-1 size-fit p-0.5 text-xs hover:text-red-600 disabled:opacity-50"
            >
                <XIcon className="size-2" />
            </Button>
        </div>
    )
}
