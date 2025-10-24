import PageContainer from '@/components/containers/page-container'

import TimeDepositSchemeEditor from '../time-deposit-computation/time-deposit-scheme-editor'

const TimeDepositComputationPage = () => {
    return (
        <PageContainer className="!p-0">
            <TimeDepositSchemeEditor />
        </PageContainer>
    )
}

export default TimeDepositComputationPage
