import { createFileRoute } from '@tanstack/react-router'

// ACCOUNT SETTINGS NOT TIED TO COOP
export const Route = createFileRoute('/account')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/account"!</div>
}
