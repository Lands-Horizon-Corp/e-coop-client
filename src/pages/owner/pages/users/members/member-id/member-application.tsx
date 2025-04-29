import { useParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import PageContainer from '@/components/containers/page-container'

import { memberLoader } from '@/hooks/api-hooks/member/use-member'
import MemberProfileCreateUpdateForm from '@/components/forms/member-forms/member-application-form/member-profile-create-update-form'

const MemberApplication = () => {
    const { memberId } = useParams({
        from: '/owner/users/members/$memberId/member-application',
    })

    const { data: member } = useSuspenseQuery(memberLoader(memberId))

    return (
        <PageContainer>
            <p className="mb-4 self-start text-lg">Member Application Form</p>
            <MemberProfileCreateUpdateForm
                defaultValues={{
                    memberId: member.id,
                }}
                className="max-w-7xl"
                branchPickerCreateProps={{
                    // TODO: Must have default company id provided
                    disabledFields: ['companyId'],
                }}
                memberGenderCreateProps={{}}
                memberTypeOptionsFilter={{}}
                disabledFields={['memberId']}
                memberClassificationCreateProps={{}}
                memberOccupationComboboxCreateProps={{}}
                educationalAttainmentComboboxCreateProps={{}}
            />
        </PageContainer>
    )
}

export default MemberApplication
