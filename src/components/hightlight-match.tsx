export const highlightMatch = (text: string, search: string) => {
    if (!search || !text) return text
    const regex = new RegExp(`(${search})`, 'ig')
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <span
                className="bg-primary/20 text-primary rounded px-0.5 py-0.5 font-medium"
                key={i}
            >
                {part}
            </span>
        ) : (
            part
        )
    )
}
