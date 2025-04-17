import { useState } from 'react'
import { cn } from '@/lib/utils'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'

import { MdExpandMore } from 'react-icons/md'
import { MdOutlineExpandLess } from 'react-icons/md'

import FeedbackForm from './feedback-form'
import { softwareUpdates } from '@/constants'
import VersionUpdates from './version-updates'

export const VersionAndFeedBack = () => {
    const [isOpen, setIsOpen] = useState(false)

    const togglePopover = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="fixed bottom-3 right-3 z-50">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Badge
                        onClick={() => {
                            togglePopover()
                        }}
                        variant="outline"
                        className={cn(
                            'cursor-pointer border-primary/50 dark:bg-background/80 dark:text-white'
                        )}
                    >
                        <span className="mr-1 font-bold">
                            {softwareUpdates.name}
                        </span>
                        {'  ' + softwareUpdates.version}
                        {isOpen ? (
                            <MdOutlineExpandLess className="size-5" />
                        ) : (
                            <MdExpandMore className="size-5" />
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
                                variant={'secondary'}
                                className="w-full cursor-pointer rounded-lg px-0 text-sm"
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
