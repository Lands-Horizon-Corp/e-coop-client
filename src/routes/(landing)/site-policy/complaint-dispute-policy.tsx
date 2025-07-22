import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(landing)/site-policy/complaint-dispute-policy',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/(landing)/(policies)/complaint-handling-and-dispute-resolution-policy"!
    </div>
  )
}
