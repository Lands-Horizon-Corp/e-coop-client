import { WarningFillIcon } from '@/components/icons'
import { Alert, AlertDescription } from '@/components/ui/alert'

const ProfileClosureContent = () => {
    return (
        <div className="space-y-4">
            <ul className="list-disc space-y-2 pl-6 text-sm">
                <li>
                    Loss of access to cooperative services, including loans,
                    savings, and other financial benefits.
                </li>
                <li>
                    Removal from all member-related activities, voting rights,
                    and dividends (if applicable).
                </li>
                <li>
                    Any outstanding obligations, such as unpaid loans or fees,
                    must be settled before closure.
                </li>
                <li>
                    Funds from the member’s account will be processed according
                    to cooperative policies.
                </li>
            </ul>
            <Alert
                variant="default"
                className="bg-rose-400/40 text-foreground dark:bg-rose-400"
            >
                <WarningFillIcon />
                <AlertDescription>
                    This action is irreversible. Please confirm that all
                    necessary checks have been completed before proceeding.
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default ProfileClosureContent
