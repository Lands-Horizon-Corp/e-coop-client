import { z } from 'zod'

export const TBankSchema = z.object({
    mediaId: z.string().min(1, 'media id. is required'),
    name: z.string().min(1, 'Bank name is required'),
    description: z.string().min(15, 'Bank Description is required'),
})
