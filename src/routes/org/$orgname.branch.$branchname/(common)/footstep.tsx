import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/org/$orgname/branch/$branchname/(common)/footstep',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/org/$orgname/branch/$branchname/(common)/footstep"!</div>
}
