import z from "zod"

export const entityIdSchema = z.uuidv4()

export type TEntityId = z.infer<typeof entityIdSchema>
