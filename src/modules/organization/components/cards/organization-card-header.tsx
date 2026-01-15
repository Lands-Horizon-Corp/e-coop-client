import { cn } from '@/helpers'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { IOrganization } from '../../organization.types'

type TSearchTermProps = {
    searchTerm: string
    name: string
}

type THandleSearchTerm = ({
    searchTerm,
    name,
}: TSearchTermProps) => string | React.ReactNode

type CustomOrganizationCardHeaderProps = {
    organization: IOrganization
    organizationName: string
    searchTerm?: string
    handleSearchTerm: THandleSearchTerm
}

type HeaderProps = {
    searchTerm?: string
    organizationName: string
    handleSearchTerm: THandleSearchTerm
    className?: string
}

const Header = ({ ...props }: HeaderProps) => {
    const {
        handleSearchTerm: handleSearchTerm,
        organizationName,
        className,
    } = props
    return (
        <TooltipProvider>
            <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>
                    <h3
                        className={cn(
                            'truncate font-semibold text-sm text-foreground leading-tight'
                        )}
                    >
                        {handleSearchTerm({
                            searchTerm: props.searchTerm || '',
                            name: organizationName,
                        })}
                    </h3>
                </TooltipTrigger>
                <TooltipContent className={cn('', className)}>
                    <p>{organizationName}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export const CustomOrganizationCardContent = () => {}

export const CustomOrganizationCardHeader = ({
    ...props
}: CustomOrganizationCardHeaderProps) => {
    const { searchTerm, handleSearchTerm, organizationName } = props

    return (
        <div className="flex">
            <Header
                handleSearchTerm={handleSearchTerm}
                organizationName={organizationName}
                searchTerm={searchTerm}
            />
        </div>
    )
    // return variant === 'default' ? (
    //     <div>
    //         <Header
    //             variant={variant}
    //             organizationName={organizationName}
    //             searchTerm={searchTerm}
    //             handleSearchTerm={handleSearchTerm}
    //         />
    //     </div>
    // ) : (
    //     <div className="space-y-3 !h-full">
    //         <Header
    //             variant={variant}
    //             organizationName={organizationName}
    //             searchTerm={searchTerm}
    //             handleSearchTerm={handleSearchTerm}
    //         />

    //         <div className="flex">
    //             <TagIcon className="" size={30} />
    //             {showCategories &&
    //                 organization.organization_categories &&
    //                 organization.organization_categories.length > 0 && (
    //                     <div className="grow flex h-fit px-2 overflow-x-auto ecoop-scroll gap-1">
    //                         {organization.organization_categories
    //                             .slice(0, 3)
    //                             .map((orgCat, index) => (
    //                                 <Badge
    //                                     className="text-xs min-w-fit"
    //                                     key={index}
    //                                     variant="outline"
    //                                 >
    //                                     {orgCat.category?.name}
    //                                 </Badge>
    //                             ))}
    //                         {organization.organization_categories.length >
    //                             3 && (
    //                             <Badge className="text-xs" variant="outline">
    //                                 +
    //                                 {organization.organization_categories
    //                                     .length - 3}
    //                             </Badge>
    //                         )}
    //                     </div>
    //                 )}
    //         </div>
    //         {showContact && variant !== 'compact' && (
    //             <div className="space-y-1.5 text-xs text-muted-foreground">
    //                 {/* Email */}
    //                 {organization.email && (
    //                     <div className="flex items-center gap-2">
    //                         <EmailIcon className="h-3 w-3 flex-shrink-0" />
    //                         <Tooltip>
    //                             <TooltipTrigger asChild>
    //                                 <a
    //                                     className="truncate hover:text-primary transition-colors"
    //                                     href={`mailto:${organization.email}`}
    //                                     onClick={(e) => e.stopPropagation()}
    //                                 >
    //                                     {handleSearchTerm({
    //                                         searchTerm: searchTerm || '',
    //                                         name: organization.email,
    //                                     })}
    //                                 </a>
    //                             </TooltipTrigger>
    //                             <TooltipContent>
    //                                 <p>{organization.email}</p>
    //                             </TooltipContent>
    //                         </Tooltip>
    //                     </div>
    //                 )}
    //                 {organization.contact_number && (
    //                     <div className="flex items-center gap-2">
    //                         <PhoneIcon className="h-3 w-3 flex-shrink-0" />
    //                         <a
    //                             className="hover:text-primary transition-colors"
    //                             href={`tel:${organization.contact_number}`}
    //                             onClick={(e) => e.stopPropagation()}
    //                         >
    //                             {organization.contact_number}
    //                         </a>
    //                     </div>
    //                 )}

    //                 {organization.address && (
    //                     <div className="flex items-start gap-2">
    //                         <BuildingIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
    //                         <Tooltip>
    //                             <TooltipTrigger asChild>
    //                                 <span className="line-clamp-2 cursor-pointer hover:text-foreground transition-colors">
    //                                     {organization.address}
    //                                 </span>
    //                             </TooltipTrigger>
    //                             <TooltipContent className="max-w-xs">
    //                                 <p>{organization.address}</p>
    //                             </TooltipContent>
    //                         </Tooltip>
    //                     </div>
    //                 )}
    //             </div>
    //         )}
    //         {showSubscription &&
    //             organization.subscription_plan &&
    //             variant !== 'compact' && (
    //                 <div className="text-xs text-muted-foreground">
    //                     <div className="flex items-center gap-2">
    //                         <CalendarIcon className="h-3 w-3 flex-shrink-0" />
    //                         <span>
    //                             {new Date(
    //                                 organization.subscription_start_date
    //                             ).toLocaleDateString()}{' '}
    //                             -{' '}
    //                             {new Date(
    //                                 organization.subscription_end_date
    //                             ).toLocaleDateString()}
    //                         </span>
    //                     </div>
    //                 </div>
    //             )}
    //         <div className="space-y-1.5 text-xs text-muted-foreground h-full">
    //             <div className="flex items-start gap-2  h-full">
    //                 <Tooltip delayDuration={700}>
    //                     <TooltipTrigger asChild>
    //                         <span className="line-clamp-4 cursor-pointer  transition-colors">
    //                             {handleSearchTerm({
    //                                 searchTerm: searchTerm || '',
    //                                 name: organizationDescription,
    //                             })}
    //                         </span>
    //                     </TooltipTrigger>
    //                     <TooltipContent className="max-w-xs text-sm text-primary bg-card border py-2">
    //                         <p>{organizationDescription}</p>
    //                     </TooltipContent>
    //                 </Tooltip>
    //             </div>
    //         </div>
    //     </div>
    // )
}
