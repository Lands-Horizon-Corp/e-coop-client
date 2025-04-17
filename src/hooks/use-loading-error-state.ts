import { useState } from 'react'

const useLoadingErrorState = <TError = string>() => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<TError | null>(null)

    return { loading, setLoading, error, setError }
}

export default useLoadingErrorState
