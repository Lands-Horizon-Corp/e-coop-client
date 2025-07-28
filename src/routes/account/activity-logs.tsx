import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/activity-logs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/activity-log"!</div>
}
