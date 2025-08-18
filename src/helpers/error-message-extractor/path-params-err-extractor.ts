import { SearchParamError } from '@tanstack/react-router';

import { TErrorMessageExtractor } from '.';

export const searchParamErrExtractor: TErrorMessageExtractor = [
    SearchParamError,
    (err: Error) => {
        const castedError = err as SearchParamError;

        if (Array.isArray(castedError)) {
            return castedError[0]?.message ?? 'Invalid URL parameters';
        }

        if (typeof castedError.message === 'string') {
            try {
                const maybeParsed = JSON.parse(castedError.message);
                if (Array.isArray(maybeParsed)) {
                    return maybeParsed[0]?.message ?? 'Invalid URL parameters';
                }
            } catch {
                //
            }
            return castedError.message;
        }

        return 'Invalid URL parameters';
    },
];
