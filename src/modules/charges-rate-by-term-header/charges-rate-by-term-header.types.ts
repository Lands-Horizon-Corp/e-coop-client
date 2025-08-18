import { z } from "zod";

export type ChargesRateByTermHeaderRequest = {
  header_1?: number;
  header_2?: number;
  header_3?: number;
  header_4?: number;
  header_5?: number;
  header_6?: number;
  header_7?: number;
  header_8?: number;
  header_9?: number;
  header_10?: number;
  header_11?: number;
  header_12?: number;
  header_13?: number;
  header_14?: number;
  header_15?: number;
  header_16?: number;
  header_17?: number;
  header_18?: number;
  header_19?: number;
  header_20?: number;
  header_21?: number;
  header_22?: number;
};

export const ChargesRateByTermHeaderRequestSchema = z.object({
  header_1: z.number().int().optional(),
  header_2: z.number().int().optional(),
  header_3: z.number().int().optional(),
  header_4: z.number().int().optional(),
  header_5: z.number().int().optional(),
  header_6: z.number().int().optional(),
  header_7: z.number().int().optional(),
  header_8: z.number().int().optional(),
  header_9: z.number().int().optional(),
  header_10: z.number().int().optional(),
  header_11: z.number().int().optional(),
  header_12: z.number().int().optional(),
  header_13: z.number().int().optional(),
  header_14: z.number().int().optional(),
  header_15: z.number().int().optional(),
  header_16: z.number().int().optional(),
  header_17: z.number().int().optional(),
  header_18: z.number().int().optional(),
  header_19: z.number().int().optional(),
  header_20: z.number().int().optional(),
  header_21: z.number().int().optional(),
  header_22: z.number().int().optional(),
});

export type ChargesRateByTermHeaderRequestInput = z.infer<
  typeof ChargesRateByTermHeaderRequestSchema
>;
