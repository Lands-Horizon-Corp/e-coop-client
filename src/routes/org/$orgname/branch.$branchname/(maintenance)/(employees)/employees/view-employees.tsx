import PageContainer from '@/components/containers/page-container'
import EmployeesTable from '@/components/tables/employees-table'
import EmployeesAction from '@/components/tables/employees-table/action'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/employees/view-employees'
)({
    component: RouteComponent,
})

function RouteComponent() {
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
                actionComponent={(props) => <EmployeesAction {...props} />}
                toolbarProps={{}}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
