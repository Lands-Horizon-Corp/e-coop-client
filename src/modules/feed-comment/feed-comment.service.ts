import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    deleteMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type { IFeedComment, IFeedCommentRequest } from '../feed-comment'
import { feedBaseKey } from '../feed/feed.service'

const {
    // apiCrudHooks,
    apiCrudService,
    baseQueryKey: feedCommentBaseKey,
} = createDataLayerFactory<IFeedComment, IFeedCommentRequest>({
    url: '/api/v1/feed-comment',
    baseKey: 'feed-comment',
})

// ⚙️🛠️ API SERVICE HERE
export const { deleteById: deleteFeedCommentById } = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { feedCommentBaseKey } // Exported in case it's needed outside
// export const { useDeleteById: useDeleteFeedCommentById } = apiCrudHooks

export const useDeleteFeedCommentById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteFeedCommentById({ id }),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [feedBaseKey],
        })
        deleteMutationInvalidationFn(feedCommentBaseKey, args)
    },
})

export const logger = Logger.getInstance('feed-comment')
// custom hooks can go here
