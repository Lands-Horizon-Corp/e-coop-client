import { useState } from 'react'

import { cn } from '@/helpers'

// import { PiIdentificationBadgeFill } from 'react-icons/pi'

// import {
//     Empty,
//     EmptyDescription,
//     EmptyHeader,
//     EmptyMedia,
//     EmptyTitle,
// } from '@/components/ui/empty'

import { IClassProps, TEntityId } from '@/types'

import { useGetMemberTypeReferenceById } from '../../member-type-reference.service'
import MemberTypeReferenceUpdateForm from '../forms/member-type-reference-update-form/member-type-reference-update-form'
// import MemberTypeReferenceCreateUpdateForm from '../forms/member-type-reference-create-update-form'
import BrowseReferenceSidebar from './browse-reference-sidebar'

interface Props extends IClassProps {}

const BrowseReferenceSchemeEditor = ({ className }: Props) => {
    const [selectedReferenceId, setSelectedReferenceId] = useState<
        TEntityId | undefined
    >()

    const {
        data,
        // isLoading, error
    } = useGetMemberTypeReferenceById({
        id: selectedReferenceId!,
        options: { enabled: !!selectedReferenceId },
    })

    return (
        <div
            className={cn(
                'py-2 w-full min-h-[90vh] max-w-full min-w-0 flex items-start gap-x-2',
                className
            )}
        >
            <BrowseReferenceSidebar
                className="sticky top-0"
                onDeleteReference={(referenceId) => {
                    if (selectedReferenceId === referenceId)
                        setSelectedReferenceId(undefined)
                }}
                onSelectReference={(referenceId) =>
                    setSelectedReferenceId(referenceId)
                }
                selectedReferenceId={selectedReferenceId}
            />
            {/* {selectedReferenceId === undefined ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiIdentificationBadgeFill />
                            </EmptyMedia>
                            <EmptyTitle>No Member Type Reference</EmptyTitle>
                            <EmptyDescription>
                                No member type reference selected, please select
                                or create.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : isLoading ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            ) : error ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyTitle>Error</EmptyTitle>
                            <EmptyDescription>{error.message}</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : (
                <MemberTypeReferenceCreateUpdateForm
                    defaultValues={data}
                    memberTypeReferenceId={selectedReferenceId}
                />
            )} */}
            <MemberTypeReferenceUpdateForm
                className="flex-1 p-4 rounded-xl bg-popover/70"
                defaultValues={data}
                memberTypeReferenceId={selectedReferenceId!}
            />
            <div className="bg-popover border border-border rounded-md p-4 w-[200px] top-0"></div>
        </div>
    )
}

export default BrowseReferenceSchemeEditor
