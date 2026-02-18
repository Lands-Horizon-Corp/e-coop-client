import { useCallback } from 'react'

import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn, compressImage } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { UserTypeBadge } from '@/modules/authentication/components/user-type-badge'
import { formatBytes, useUploadMedia } from '@/modules/media'
import { FileRejection, useDropzone } from 'react-dropzone'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { ImageIcon, UploadIcon, XIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateFeed, useUpdateFeedById } from '../..'
import { IFeed, IFeedRequest } from '../../feed.types'
import { FeedSchema, TFeedSchema } from '../../feed.validation'
import TextLimitIndicatorProgfress from '../text-limit-indicator-progress'

export interface ICreateFeedPostFormProps
    extends
        IClassProps,
        IForm<Partial<IFeedRequest>, IFeed, Error, TFeedSchema> {
    feedId?: TEntityId
}

const CreateFeedPostForm = ({
    feedId,
    className,
    ...formProps
}: ICreateFeedPostFormProps) => {
    const {
        currentAuth: { user, user_organization },
    } = useAuthStore()

    const form = useForm<TFeedSchema>({
        resolver: standardSchemaResolver(FeedSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            description: '',
            media_ids: [],
            media: [],
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateFeed({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Post Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateFeedById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Post Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFeedSchema>({ form, ...formProps })

    const uploadMediaMutation = useUploadMedia()

    const onSubmit = form.handleSubmit(async (payload) => {
        try {
            const mediaArray = payload.media || []

            const filesToUpload = mediaArray.filter((m) => !m.media_id)

            await Promise.all(
                filesToUpload.map(async (m, i) => {
                    try {
                        if (!m.file) return

                        const compressedFile = await compressImage(m.file!)

                        const uploaded = await uploadMediaMutation.mutateAsync(
                            {
                                file: compressedFile,
                            },
                            {
                                onSuccess(data) {
                                    form.setValue(`media.${i}.media`, data)
                                    form.setValue(
                                        `media.${i}.media_id`,
                                        data.id
                                    )
                                },
                            }
                        )

                        m.media = uploaded
                        m.media_id = uploaded.id
                    } catch (err) {
                        toast.error(
                            `Failed to upload file "${m.file?.name}". Please try again.`
                        )
                        throw err
                    }
                })
            )

            const media_ids = (payload.media || [])
                .map((m) => m.media?.id)
                .filter(Boolean) as TEntityId[]

            const finalPayload: IFeedRequest = {
                description: payload.description,
                media_ids,
            }

            if (feedId) {
                updateMutation.mutate({ id: feedId, payload: finalPayload })
            } else {
                createMutation.mutate(finalPayload)
            }
        } catch (err) {
            console.error(err)
            toast.error('Failed to upload one or more files. Please try again.')
        }
    }, handleFocusError)

    const { error: rawError, isPending } = feedId
        ? updateMutation
        : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="flex items-center gap-x-2">
                    <ImageDisplay
                        className="size-8"
                        src={user?.media?.download_url}
                    />
                    <div>
                        <p>{user?.user_name || 'Unknown User'}</p>
                        {user_organization?.user_type && (
                            <UserTypeBadge
                                className="!bg-transparent p-0 !text-muted-foreground !border-transparent"
                                size="sm"
                                userType={user_organization?.user_type}
                            />
                        )}
                    </div>
                </div>
                <fieldset
                    className="grid gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        // label="Description"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                autoComplete="off"
                                className="resize-none !min-h-9 max-h-96 p-1 max-w-full ecoop-scroll border-none w-full break-all !ring-0 !bg-transparent"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="What's on your mind?"
                                rows={4}
                            />
                        )}
                    />
                    <MediaSection form={form} />
                </fieldset>

                <div className="flex items-center gap-x-2">
                    <TextLimitIndicatorProgfress
                        limit={255}
                        textValue={form.watch('description')}
                    />
                    <FormFooterResetSubmit
                        className="w-full"
                        disableSubmit={!form.formState.isDirty || isPending}
                        error={error}
                        hideReset
                        isLoading={isPending}
                        readOnly={formProps.readOnly}
                        submitClassName="flex-1"
                        submitText={feedId ? 'Update Post' : 'Create Post'}
                    />
                </div>
            </form>
        </Form>
    )
}

interface MediaSectionProps {
    form: UseFormReturn<TFeedSchema>
    readOnly?: boolean
}

const MAX_IMAGES = 4
const MAX_SIZE = 3 * 1024 * 1024 // 3MB

const MediaSection = ({ form, readOnly }: MediaSectionProps) => {
    const { append, remove } = useFieldArray({
        control: form.control,
        name: 'media',
    })

    const media = form.watch('media') || []

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const remainingSlots = MAX_IMAGES - media.length

            if (remainingSlots <= 0) {
                toast.warning(`Maximum of ${MAX_IMAGES} images allowed`)
                return
            }

            if (acceptedFiles.length > remainingSlots) {
                toast.warning(
                    `You can only add ${remainingSlots} more image(s)`
                )
            }

            const filesToAdd = acceptedFiles.slice(0, remainingSlots)

            append(filesToAdd.map((file) => ({ file })))
        },
        [append, media.length]
    )

    const onDropRejected = useCallback((rejections: FileRejection[]) => {
        const hasTooMany = rejections.some((r) =>
            r.errors.some((e) => e.code === 'too-many-files')
        )

        const hasLarge = rejections.some((r) =>
            r.errors.some((e) => e.code === 'file-too-large')
        )

        const hasInvalid = rejections.some((r) =>
            r.errors.some((e) => e.code === 'file-invalid-type')
        )

        if (hasTooMany) toast.warning(`Maximum of ${MAX_IMAGES} images allowed`)

        if (hasLarge) toast.error('Some files exceed 3MB limit')

        if (hasInvalid) toast.error('Only image files are allowed')
    }, [])

    const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone(
        {
            onDrop,
            onDropRejected,
            accept: { 'image/*': [] },
            maxSize: MAX_SIZE,
            maxFiles: MAX_IMAGES,
            disabled: readOnly,
            multiple: true,
        }
    )

    const handleOpenFileDialog = () => {
        inputRef.current?.click()
    }

    return (
        <>
            {media.length > 0 && (
                <div>
                    <div className="grid grid-cols-2 gap-2">
                        {media.map((item, i) => {
                            const previewSrc = item.file
                                ? URL.createObjectURL(item.file)
                                : item.media?.url

                            return (
                                <div className="relative group" key={i}>
                                    <img
                                        className="rounded-lg object-cover aspect-video w-full"
                                        src={previewSrc}
                                    />

                                    {!readOnly && (
                                        <Button
                                            className="absolute cursor-pointer top-1 right-1 h-6 w-6 bg-black/60 text-white rounded-full"
                                            onClick={() => remove(i)}
                                            size="icon"
                                            type="button"
                                            variant="ghost"
                                        >
                                            <XIcon className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                        Max {MAX_IMAGES} images
                    </p>
                </div>
            )}

            {!readOnly && (
                <div className="py-2xxx px-2xxx flex items-center">
                    <p className="text-sm ml-1 text-muted-foreground hidden">
                        Add to your post
                    </p>
                    <div
                        {...getRootProps()}
                        className={cn(
                            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors border-secondary bg-secondary/30 hover:border-primary/50 hover:bg-muted/50',
                            isDragActive && 'border-primary bg-primary/5',
                            'hidden'
                        )}
                    >
                        <input {...getInputProps()} />

                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="rounded-full border border-border/50 p-4">
                                <UploadIcon className="size-8 text-muted-foreground" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    Upload files
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    All files · Max {MAX_IMAGES} file
                                    {MAX_IMAGES > 1 ? 's' : ''} · Up to{' '}
                                    {formatBytes(MAX_SIZE)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ADD PHOTOS BUTTON */}
                    <Button
                        className="ml-auto p-2 text-muted-foreground/40"
                        disabled={MAX_IMAGES === media.length}
                        onClick={handleOpenFileDialog}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                    >
                        <ImageIcon className="size-4" />
                    </Button>
                </div>
            )}
        </>
    )
}

export const CreateFeedPostFormModal = ({
    title = 'Create Post',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICreateFeedPostFormProps, 'className'>
}) => {
    return (
        <Dialog {...props}>
            <DialogContent
                className={cn(
                    '!max-w-xl rounded-xl p-0 gap-0 overflow-hidden bg-card border-border/60 shadow-2xl',
                    className
                )}
            >
                <DialogHeader className="px-6 py-4 border-b border-border/60">
                    <DialogTitle className="text-center text-sm font-semibold text-card-foreground">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <CreateFeedPostForm
                        {...formProps}
                        onSuccess={(data) => {
                            formProps?.onSuccess?.(data)
                            props.onOpenChange?.(false)
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFeedPostForm
