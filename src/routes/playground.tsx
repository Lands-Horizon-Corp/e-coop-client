import { createFileRoute } from '@tanstack/react-router'

import PlaygroundPage from '@/modules/playground/pages'

export const Route = createFileRoute('/playground')({
    component: PlaygroundPage,
})
