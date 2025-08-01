import { MdError } from 'react-icons/md'

import { cn } from '@/lib/utils'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    errorMessage?: string | null
}

const FormErrorMessage = ({ className, errorMessage }: Props) => {
    if (!errorMessage || errorMessage === null) return null

    return (
        <span
            className={cn(
                'flex items-start gap-x-2 rounded-md border border-red-400/20 bg-destructive/10 p-2 py-2 text-sm text-red-500 dark:bg-rose-400/10 dark:text-red-400',
                className
            )}
        >
            <MdError className="my-1 size-4" />
            <p className="w-full">{errorMessage}</p>
        </span>
    )
}

export default FormErrorMessage
