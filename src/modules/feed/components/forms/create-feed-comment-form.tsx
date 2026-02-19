import { useCallback } from 'react'

import { UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn, compressImage } from '@/helpers'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import {
    FeedCommentSchema,
    IFeedComment,
    TFeedCommentSchema,
} from '@/modules/feed-comment'
import { useUploadMedia } from '@/modules/media'
import { FileRejection, useDropzone } from 'react-dropzone'

import { ImageIcon, PaperPlaneIcon, XIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm } from '@/types'

import { useFeedCreateComment } from '../../feed.service'
import TextLimitIndicatorProgfress from '../text-limit-indicator-progress'

const MAX_SIZE = 3 * 1024 * 1024 // 3MB

export interface IFeedCommentFormProps
    extends
        IClassProps,
        IForm<
            Partial<TFeedCommentSchema>,
            IFeedComment,
            Error,
            TFeedCommentSchema
        > {
    feedId: string
    readOnly?: boolean
}

export const FeedCommentForm = ({
    feedId,
    className,
    defaultValues,
    readOnly,
    onSuccess,
    onError,
}: IFeedCommentFormProps) => {
    const {
        currentAuth: { user },
    } = useAuthStore()
    const uploadMediaMutation = useUploadMedia()
    const createCommentMutation = useFeedCreateComment()

    const isPending =
        uploadMediaMutation.isPending || createCommentMutation.isPending

    const form: UseFormReturn<TFeedCommentSchema> = useForm<TFeedCommentSchema>(
        {
            resolver: standardSchemaResolver(FeedCommentSchema),
            defaultValues: {
                comment: '',
                media: undefined,
                media_id: undefined,
                ...defaultValues,
            },
            mode: 'onSubmit',
        }
    )

    const commentValue = form.watch('comment')
    const media = form.watch('media')
    const filePreview = form.watch('filePreview')

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (!acceptedFiles.length) return
            form.setValue('file', acceptedFiles[0])

            const existingFilePreview = form.getValues('filePreview')
            if (existingFilePreview) URL.revokeObjectURL(existingFilePreview)

            form.setValue('filePreview', URL.createObjectURL(acceptedFiles[0]))
        },
        [form]
    )

    const onDropRejected = useCallback((rejections: FileRejection[]) => {
        const hasLarge = rejections.some((r) =>
            r.errors.some((e) => e.code === 'file-too-large')
        )
        const hasInvalid = rejections.some((r) =>
            r.errors.some((e) => e.code === 'file-invalid-type')
        )

        if (hasLarge) toast.error('File exceeds 3MB limit')
        if (hasInvalid) toast.error('Only image files are allowed')
    }, [])

    const { getRootProps, getInputProps, inputRef } = useDropzone({
        onDrop,
        onDropRejected,
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: MAX_SIZE,
        multiple: false,
        disabled: readOnly,
    })

    const handleOpenFileDialog = () => inputRef.current?.click()

    const handleSubmit = form.handleSubmit(async (payload) => {
        if (isPending) return

        try {
            let media_id = payload.media_id

            if (!payload.media_id && payload.file instanceof File) {
                const compressedFile = await compressImage(payload.file)

                const uploaded = await uploadMediaMutation.mutateAsync({
                    file: compressedFile,
                })

                media_id = uploaded.id
            }

            const data = await createCommentMutation.mutateAsync({
                feedId,
                payload: { comment: payload.comment, media_id: media_id },
            })

            const existingFilePreview = form.getValues('filePreview')
            if (existingFilePreview) URL.revokeObjectURL(existingFilePreview)

            form.reset()
            onSuccess?.(data)
        } catch (err) {
            toast.error('Failed to create comment')
            onError?.(err as Error)
        }
    })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-2 p-2', className)}
                onSubmit={handleSubmit}
            >
                <div className="flex items-start gap-3">
                    <ImageDisplay
                        className="size-8 ring"
                        src={user?.media?.download_url}
                    />

                    {!createCommentMutation.isPending ? (
                        <div className="max-w-full w-full px-4 pt-4 pb-2 space-y-1 bg-muted/75 dark:bg-input/5 rounded-xl">
                            <FormFieldWrapper
                                className="space-y-0 flex-1 max-w-full"
                                control={form.control}
                                messageClassName="bg-muted text-muted-foreground hidden"
                                name="comment"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        className="flex-1 w-full max-w-full resize-none break-all box-border !min-h-9 !ring-none !bg-transparent focus-visible:ring-0 border-none outline-none ecoop-scroll p-0"
                                        disabled={readOnly}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault()
                                                handleSubmit()
                                            }
                                        }}
                                        placeholder="Write a comment..."
                                    />
                                )}
                            />

                            <div {...getRootProps()} className="hidden">
                                <input {...getInputProps()} />
                            </div>

                            <div className="flex items-center justify-end gap-x-2">
                                <div className="flex items-center gap-x-2 mr-auto">
                                    {(commentValue || '').length > 0 &&
                                        (commentValue || '').length !== 255 && (
                                            <TextLimitIndicatorProgfress
                                                limit={255}
                                                svgCircleClassName="size-7"
                                                textClassName="text-[8px]"
                                                textValue={commentValue}
                                            />
                                        )}
                                    {filePreview && (
                                        <p className="text-xs text-muted-foreground">
                                            +1 Media
                                        </p>
                                    )}
                                </div>
                                <Button
                                    className="size-2 p-3 text-muted-foreground/20"
                                    disabled={!!media || readOnly}
                                    onClick={handleOpenFileDialog}
                                    size="icon-sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <ImageIcon />
                                </Button>

                                <Button
                                    className="size-2 p-3"
                                    disabled={!commentValue && !media}
                                    onClick={handleSubmit}
                                    size="icon-sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <PaperPlaneIcon className="rotate-12" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground p-2 animate-pulse">
                            Posting comment...
                        </p>
                    )}
                </div>

                {filePreview && !createCommentMutation.isPending && (
                    <div className="relative ml-10 w-48">
                        <img
                            className="rounded-lg object-cover aspect-video w-full"
                            src={media ? media?.download_url : filePreview}
                        />
                        {!readOnly && (
                            <Button
                                className="absolute top-1 right-1 size-6 bg-black/60 text-white rounded-full"
                                onClick={() => {
                                    form.setValue('media', undefined)
                                    form.setValue('filePreview', undefined)
                                    form.setValue('file', undefined)
                                }}
                                size="icon"
                                type="button"
                                variant="ghost"
                            >
                                <XIcon className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}
            </form>
        </Form>
    )
}
