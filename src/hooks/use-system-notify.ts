export const systemNativeNotify = (
    title: string,
    options?: NotificationOptions & {
        onClick?: (e: Event) => void
    }
) => {
    let Notif: Notification | undefined

    const {
        icon = '/e-coop-logo-1.webp',
        onClick,
        ...otherOptions
    } = options || {}

    if (!('Notification' in window)) {
        throw new Error('This browser does not support desktop notification')
    }

    if (Notification.permission === 'granted') {
        Notif = new Notification(title, { icon, ...otherOptions })
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                Notif = new Notification(title, {
                    icon,
                    body: 'Please allow ecoop notifications to stay updated!',
                    ...otherOptions,
                })
            }
        })
    }

    Notif?.addEventListener('click', (e) => {
        if (onClick) {
            return onClick(e)
        }

        window.focus()
        if (window.parent) {
            window.parent.focus()
        }
    })

    return Notif
}
