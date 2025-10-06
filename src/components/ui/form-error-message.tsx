import { cn } from '@/helpers/tw-utils'

import { IClassProps } from '@/types'

import { ErrorExclamationIcon } from '../icons'

interface Props extends IClassProps {
    errorMessage?: string
}

const FormErrorMessage = ({ className, errorMessage }: Props) => {
    if (!errorMessage || errorMessage === null) return null

    return (
        <span
            className={cn(
                'flex items-start gap-x-2 rounded-md border border-destructive/70 bg-destructive/50 p-2 py-2 text-sm text-destructive-foreground dark:bg-destructive/80 dark:text-destructive-foreground',
                className
            )}
        >
            <ErrorExclamationIcon className="my-1 size-4" />
            <p className="w-full">{errorMessage}</p>
        </span>
    )
}

export default FormErrorMessage
