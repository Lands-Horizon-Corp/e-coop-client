import PageContainer from '@/components/containers/page-container'

import EmployeesTable from '../employees-table'
import EmployeesAction from '../employees-table/row-action-context'

const ViewEmployeePage = () => {
    // const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            {/* <MemberProfileQuickCreateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {
                        // TODO: Once org was established, and branch id exist, put it here
                    },
                    onSuccess: () => {},
                }}
            /> */}
            <EmployeesTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                actionComponent={(props) => <EmployeesAction {...props} />}
            />
        </PageContainer>
    )
}

export default ViewEmployeePage
