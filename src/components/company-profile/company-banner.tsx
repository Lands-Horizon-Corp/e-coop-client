import BannerBgImage from '@/assets/images/banner-bg-element-1.png'

import CompanyLogo from './company-logo'
import CompanyBadge from './company-badge'
import { CalendarIcon, LocationPinIcon, TelephoneIcon } from '../icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IClassProps } from '@/types'
import { ICompanyResource } from '@/types'

interface Props extends IClassProps {
    company: ICompanyResource
}

const CompanyBanner = ({ className, company }: Props) => {
    return (
        <div
            className={cn('bg-cover bg-center bg-no-repeat', className)}
            style={{
                backgroundImage: `url(${BannerBgImage})`,
            }}
        >
            <div className="flex flex-col items-center justify-center gap-y-2">
                <CompanyLogo
                    company={company}
                    className="size-32"
                    imageDisplayClassName="border-4 border-secondary"
                />
                <p className="text-lg font-medium">
                    {company.name}{' '}
                    <CompanyBadge className="inline" company={company} />
                </p>
                <div className="pointer-events-auto flex flex-wrap gap-x-4 text-sm text-foreground/50">
                    <span className="inline-flex items-center gap-x-2">
                        <TelephoneIcon />
                        {company.contactNumber}
                    </span>
                    <span className="inline-flex items-center gap-x-2">
                        <CalendarIcon />
                        {toReadableDate(company.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-x-2">
                        <LocationPinIcon /> {company.address}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CompanyBanner
