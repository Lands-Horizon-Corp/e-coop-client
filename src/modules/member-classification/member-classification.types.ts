import z from "zod";
import {
  ITimeStamps,
  IAuditable,
  TEntityId,
  IPaginatedResult,
  descriptionSchema,
  descriptionTransformerSanitizer,
} from "../common";

export interface IMemberClassification extends ITimeStamps, IAuditable {
  id: TEntityId;

  name: string;
  icon: string;
  description: string;

  // history?: IMemberClassificationHistory[]
}

export interface IMemberClassificationRequest {
  id?: TEntityId;

  name: string;
  description: string;
}

export interface IMemberClassificationPaginated
  extends IPaginatedResult<IMemberClassification> {}

export const memberClassificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: descriptionSchema.transform(descriptionTransformerSanitizer),
});
