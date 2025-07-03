import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(landing)/test')({
    component: RouteComponent,
})

function RouteComponent() {
    return <></>
}
