import { z } from "zod";
import { entityIdSchema, ITimeStamps } from "../common";

export interface IMedia {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_key: string;
  url: string;
  key: string;
  bucket_name: string;
  status: string;
  progress: number;
}

export interface IMediaRequest {
  id?: string;
  file_name: string;
}

export interface IMediaResponse extends IMedia, ITimeStamps {
  download_url: string;
}

export const MediaSchema = z.object({
  id: entityIdSchema,
  file_name: z.string().max(2048),
  file_size: z.number().nonnegative(),
  file_type: z.string().max(50),
  storage_key: z.string().max(2048),
  url: z.string().url().max(2048),
  key: z.string().max(2048),
  bucket_name: z.string().max(2048),
  status: z.string().max(50).default("pending"),
  progress: z.number().nonnegative(),
});

export const MediaRequestSchema = z.object({
  id: entityIdSchema.optional(),
  file_name: z.string().min(1).max(255),
});

export const MediaResponseSchema = MediaSchema.extend({
  created_at: z.string(),
  updated_at: z.string(),
  download_url: z.string().url().max(2048),
});
