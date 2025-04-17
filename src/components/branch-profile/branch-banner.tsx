import BannerBgImage from '@/assets/images/banner-bg-element-1.png'

import BranchLogo from './branch-logo'
import BranchBadge from './branch-badge'
import {
    CalendarIcon,
    EmailIcon,
    LocationPinIcon,
    TelephoneIcon,
} from '../icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IClassProps } from '@/types'
import { IBranchResource } from '@/server'

interface Props extends IClassProps {
    branch: IBranchResource
}

const InfoItem = ({
    icon: Icon,
    text,
}: {
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    text: string
}) => (
    <span className="inline-flex items-center gap-x-2">
        <Icon />
        {text}
    </span>
)

const BranchBanner = ({ className, branch }: Props) => {
    const { name, contactNumber, createdAt, address, email } = branch

    return (
        <div
            className={cn('bg-cover bg-center bg-no-repeat', className)}
            style={{
                backgroundImage: `url(${BannerBgImage})`,
            }}
        >
            <div className="flex flex-col items-center justify-center gap-y-2">
                <BranchLogo
                    branch={branch}
                    className="size-32"
                    imageDisplayClassName="border-4 border-secondary"
                />
                <p className="text-lg font-medium">
                    {name} <BranchBadge className="inline" branch={branch} />
                </p>
                <div className="pointer-events-auto flex max-w-lg flex-wrap justify-center gap-x-4 text-sm text-foreground/50">
                    {contactNumber && (
                        <InfoItem icon={TelephoneIcon} text={contactNumber} />
                    )}
                    {email && <InfoItem icon={EmailIcon} text={email} />}
                    {createdAt && (
                        <InfoItem
                            icon={CalendarIcon}
                            text={toReadableDate(createdAt)}
                        />
                    )}
                    {address && (
                        <InfoItem icon={LocationPinIcon} text={address} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BranchBanner
