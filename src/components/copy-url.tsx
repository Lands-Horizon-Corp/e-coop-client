import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { Check, Copy } from 'lucide-react'

type Props = {
    url: string
    displayText?: string
    className?: string
    duration?: number
}

const CopyURL = ({
    url,
    displayText = 'Copy URL',
    className,
    duration = 3,
}: Props) => {
    const [coppied, setCoppied] = useState(false)

    const handleCopy = () => {
        if (coppied) return
        try {
            navigator.clipboard.writeText(url)
            toast.success('Coppied')
            setCoppied(true)
            setTimeout(() => setCoppied(false), duration * 1000)
        } catch {
            toast.error("Sorry, Couldn't copy link")
        }
    }

    return (
        <div
            onClick={handleCopy}
            className={cn(
                'group flex cursor-pointer gap-x-4 rounded-md bg-secondary px-3 py-2 text-xs text-foreground/70 duration-200 hover:text-foreground',
                className,
                coppied && 'bg-primary/30'
            )}
        >
            <p>{displayText}</p>
            {coppied ? (
                <Check className="size-4 text-primary/80" strokeWidth={1} />
            ) : (
                <Copy className="h-4 w-4" strokeWidth={1} />
            )}
        </div>
    )
}

export default CopyURL
