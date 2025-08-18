import { ZodError } from 'zod';

import { TErrorMessageExtractor } from '.';

export const zodErrExtractor: TErrorMessageExtractor = [
    ZodError,
    (e: Error) => (e as ZodError).issues[0].message,
];
