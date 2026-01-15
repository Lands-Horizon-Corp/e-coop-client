import PageContainer from '@/components/containers/page-container'

import { TEntityId } from '@/types'

import BrowseReferenceSchemeEditor from '../browse-reference/browse-reference-editor'

const BrowseReferencePage = ({
    defaultExpandedMemberTypeId,
}: {
    defaultExpandedMemberTypeId?: TEntityId
}) => {
    return (
        <PageContainer className="!p-0">
            <BrowseReferenceSchemeEditor
                defaultExpandedMemberTypeId={defaultExpandedMemberTypeId}
            />
        </PageContainer>
    )
}

export default BrowseReferencePage
