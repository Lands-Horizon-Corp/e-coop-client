import { AxiosRequestConfig } from 'axios'

/**
 * Injects an idempotency key into request headers (if provided).
 *
 * Idempotency ensures that repeated requests (e.g. double-click submit)
 */
export const injectIdempotency = (
    config?: AxiosRequestConfig & { idempotencyKey?: string }
) => {
    if (!config?.idempotencyKey) return config

    const { idempotencyKey, headers, ...rest } = config

    return {
        ...rest,
        headers: {
            ...headers,
            ...(headers?.['X-Idempotency-Key']
                ? {}
                : { 'X-Idempotency-Key': idempotencyKey }),
        },
    }
}

/**
 * Base type for envelopes that may include an idempotency key
 */
type TCreateEnvelopeBase = {
    idempotencyKey?: string
}

/**
 * ✅ Recommended format:
 * Wrap payload inside { data }
 */
export type CreateDataEnvelope<TPayload> = TCreateEnvelopeBase & {
    data: TPayload
}

/**
 * ⚠️ Deprecated format:
 * Old code used { payload } instead of { data }
 */
export type CreatePayloadEnvelope<TPayload> = TCreateEnvelopeBase & {
    payload: TPayload
}

/**
 * Flexible input type:
 * Allows 3 formats:
 * 1. Raw payload (deprecated)
 * 2. { data } (preferred)
 * 3. { payload } (deprecated)
 */
export type CreateVariables<TPayload> =
    | TPayload
    | CreateDataEnvelope<TPayload>
    | CreatePayloadEnvelope<TPayload>

export type NormalizedCreateVariables<TPayload> = {
    data: TPayload
    idempotencyKey?: string
}

let hasWarnedPayloadEnvelope = false
let hasWarnedRawPayload = false

const isEnvelopeRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const hasOnlyEnvelopeKeys = (
    value: Record<string, unknown>,
    keys: string[]
) => {
    return Object.keys(value).every((key) => keys.includes(key))
}

/**
 * Logs deprecation warnings only in development mode
 */
const warnCreateDeprecation = (message: string) => {
    if (!import.meta.env.DEV) return
    console.warn(message)
}

/**
 * Normalizes all possible input formats into a single consistent structure:
 *
 * Output:
 * {
 *   data: T,
 *   idempotencyKey?: string
 * }
 */
export const normalizeCreateVariables = <T>(
    variables: CreateVariables<T>
): NormalizedCreateVariables<T> => {
    if (isEnvelopeRecord(variables)) {
        if (
            'data' in variables &&
            hasOnlyEnvelopeKeys(variables, ['data', 'idempotencyKey'])
        ) {
            return {
                data: variables.data as T,
                idempotencyKey: variables.idempotencyKey as string | undefined,
            }
        }

        if (
            'payload' in variables &&
            hasOnlyEnvelopeKeys(variables, ['payload', 'idempotencyKey'])
        ) {
            if (!hasWarnedPayloadEnvelope) {
                hasWarnedPayloadEnvelope = true
                warnCreateDeprecation(
                    '[createDataLayerFactory] create({ payload, idempotencyKey }) is deprecated na desu. Use create({ data, idempotencyKey }) instead.'
                )
            }

            return {
                data: variables.payload as T,
                idempotencyKey: variables.idempotencyKey as string | undefined,
            }
        }
    }

    if (!hasWarnedRawPayload) {
        hasWarnedRawPayload = true
        warnCreateDeprecation(
            '[createDataLayerFactory] create(payload) is deprecated na desu. Use create({ data: payload }) instead.'
        )
    }

    return {
        data: variables as T,
        idempotencyKey: undefined,
    }
}
