// import { useTheme } from "next-themes"
import { Toaster as Sonner } from 'sonner'

import { useTheme } from '@/providers/theme-provider'
import { createPortal as yeetToDOM } from 'react-dom'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toasterize = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
            }}
            {...props}
        />
    )
}

const Toaster = (props: ToasterProps) => {
    return <>{yeetToDOM(<Toasterize {...props} />, document.body)}</>
}

export { Toaster }
