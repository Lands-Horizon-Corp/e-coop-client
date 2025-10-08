import { useState } from 'react'

import { softwareUpdates } from '@/constants'
import { cn } from '@/helpers/tw-utils'

import { ExpandLessIcon, ExpandMoreIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import FeedbackForm from './feedback-form'
import VersionUpdates from './version-updates'

export const VersionAndFeedBack = () => {
    const [isOpen, setIsOpen] = useState(false)

    const togglePopover = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="fixed bottom-3 right-3 z-50">
            <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                    <Badge
                        className={cn(
                            'cursor-pointer border-primary/50 dark:bg-background/80 dark:text-white'
                        )}
                        onClick={() => {
                            togglePopover()
                        }}
                        variant="outline"
                    >
                        <span className="mr-1 font-bold">
                            {softwareUpdates.name}
                        </span>
                        {'  ' + softwareUpdates.version}
                        {isOpen ? (
                            <ExpandLessIcon className="size-5" />
                        ) : (
                            <ExpandMoreIcon className="size-5" />
                        )}
                    </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-2 bg-background">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                            {softwareUpdates.name} - {softwareUpdates.version}
                        </h4>
                        <p className="pb-2 text-sm text-muted-foreground">
                            {softwareUpdates.description}
                        </p>
                    </div>
                    <VersionUpdates />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full cursor-pointer rounded-lg px-0 text-sm"
                                variant={'secondary'}
                            >
                                Send Feedback
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>
                                    We’d love to hear your feedback!
                                </DialogTitle>
                                <DialogDescription>
                                    Your feedback helps us pinpoint areas where
                                    we can improve.
                                </DialogDescription>
                            </DialogHeader>
                            <FeedbackForm />
                        </DialogContent>
                    </Dialog>
                </PopoverContent>
            </Popover>
        </div>
    )
}
