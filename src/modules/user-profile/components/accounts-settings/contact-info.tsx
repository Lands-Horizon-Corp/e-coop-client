import { Link } from '@tanstack/react-router'

import {
    ChatBubbleIcon,
    EmailIcon,
    LocationPinIcon,
    PhoneIcon,
    TelephoneIcon,
} from '@/components/icons'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

export const ContactInfo = () => {
    return (
        <div className="space-y-1">
            <p className="font-medium text-muted-foreground uppercase tracking-wide mb-1">
                <PhoneIcon className="size-4 inline mr-2" /> Contact
            </p>

            <div className="space-y-0.5">
                <Link
                    className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent"
                    rel="noopener noreferrer"
                    target="_blank"
                    to="/contact"
                >
                    <ChatBubbleIcon className="size-4 inline" />
                    Support
                </Link>

                <CopyWrapper iconClassName="size-2 text-xs">
                    <EmailIcon className="size-4 inline mr-2" />
                    <span className="truncate text-xs">
                        lands.horizon.corp@gmail.com
                    </span>
                </CopyWrapper>

                <CopyWrapper iconClassName="size-2 text-xs">
                    <TelephoneIcon className="size-4 inline mr-2" />
                    <span className="text-xs">+63 991 617 1081</span>
                </CopyWrapper>

                <CopyWrapper iconClassName="size-2">
                    <LocationPinIcon className="size-4 mt-0.5 shrink-0 inline mr-2" />
                    <span className="text-wrap leading-tight text-xs">
                        BLK 5 LOT 49, MAKADIYOS STREET VILLA MUZON SUBD, MUZON
                        EAST
                    </span>
                </CopyWrapper>
            </div>
        </div>
    )
}
