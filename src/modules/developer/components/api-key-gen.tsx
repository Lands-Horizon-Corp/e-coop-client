import { useState } from 'react'

import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import { EyeNoneIcon, EyeViewIcon, KeySharpIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { IClassProps } from '@/types'

import { useRefreshAPIKey } from '../developer.service'

interface Props extends IClassProps {}

const APIKeyGen = ({ className }: Props) => {
    const [canView, setCanView] = useState(false)
    const {
        data,
        mutate,
        isPending,
        error: rawError,
        reset,
    } = useRefreshAPIKey({
        options: {
            onSuccess: (data) => {
                try {
                    navigator.clipboard.writeText(data.developer_secret_key)
                    toast.success('API Secret Key Copied!')
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    toast.error('Failed to copy API Secret Key')
                }
            },
        },
    })

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                data?.developer_secret_key ?? ''
            )

            toast.success('API Key copied')
            return true
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error('Failed to copy')
            return false
        }
    }

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <div
            className={cn('rounded-xl min-w-0 max-w-full space-y-4', className)}
        >
            <div className="flex justify-between items-center gap-x-4">
                <p className="text-2xl text-foreground/80">
                    Developer API Key{' '}
                    <KeySharpIcon className="text-muted-foreground/80 ml-1 inline" />
                </p>
            </div>
            <p className="text-sm text-muted-foreground/70">
                You will not be able to copy your API Key again after closing
                this. Make sure to protect this API Key at all times. Please
                read our{' '}
                <Link
                    to={'/developers' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium hover:text-primary underline-offset-4 text-primary/70"
                >
                    Developer Policy.
                </Link>
            </p>
            <div className="flex items-center gap-x-4">
                <div
                    className={cn(
                        'flex-1 relative min-w-0 px-4 gap-x-2 bg-secondary text-muted-foreground text-nowrap rounded-lg border text-sm ',
                        data?.developer_secret_key &&
                            'bg-primary/20 border-primary/80 text-primary-foreground'
                    )}
                >
                    <div className="flex-1 p-2 overflow-auto max-w-full min-w-0 ecoop-scroll">
                        <p
                            className={cn(
                                'flex-1',
                                data?.developer_secret_key && 'tracking-wider'
                            )}
                        >
                            {!canView &&
                                data?.developer_secret_key
                                    .split('')
                                    .map(() => `•`)}
                            {data && canView && data.developer_secret_key}
                            {!data?.developer_secret_key && (
                                <span>Generate to get a new API key</span>
                            )}
                        </p>
                    </div>
                </div>
                <CopyWrapper
                    disabled={!data?.developer_secret_key}
                    onCopy={() => handleCopy()}
                />
                <Button
                    variant="ghost"
                    onClick={() => setCanView((prev) => !prev)}
                    className={cn(
                        'size-fit p-2 rounded-full text-muted-foreground/80 hover:text-foreground inline-flex items-center justify-center text-sm font-medium',
                        !data?.developer_secret_key && 'hidden'
                    )}
                >
                    {canView ? (
                        <span className="pointer-events-none flex items-center justify-center text-center">
                            <EyeNoneIcon
                                className="size-4"
                                aria-hidden="true"
                            />
                        </span>
                    ) : (
                        <span className="pointer-events-none flex items-center justify-center text-center">
                            <EyeViewIcon
                                className="size-4"
                                aria-hidden="true"
                            />
                        </span>
                    )}
                </Button>
            </div>
            <FormErrorMessage errorMessage={error} />
            <Button
                className="w-full"
                onClick={() => {
                    reset()
                    mutate()
                }}
                disabled={isPending}
            >
                Refresh and Copy
                {isPending && <LoadingSpinner className="ml-2" />}
            </Button>
        </div>
    )
}

export const APIKeyGenModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<Props, 'className'>
}) => {
    return (
        <Modal {...props} className={cn('min-w-0', className)}>
            <APIKeyGen {...formProps} />
        </Modal>
    )
}

export default APIKeyGen
