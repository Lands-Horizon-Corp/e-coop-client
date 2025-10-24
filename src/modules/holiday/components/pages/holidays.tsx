import PageContainer from '@/components/containers/page-container'

import HolidayEditor from '../holiday-editor'

const HolidayPage = () => {
    return (
        <PageContainer>
            <HolidayEditor className="w-full max-w-2xl" />
        </PageContainer>
    )
}

export default HolidayPage
