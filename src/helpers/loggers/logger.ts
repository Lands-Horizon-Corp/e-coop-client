import { APP_ENV } from '@/constants'

/* eslint-disable no-console */
type LogMethod = (...args: unknown[]) => void

class Logger {
    private static instance: Logger
    private isDevelopment: boolean

    public log: LogMethod
    public warn: LogMethod
    public error: LogMethod
    public info: LogMethod
    public debug: LogMethod

    private constructor() {
        console.log(
            '\n                  ......                                    \n            .,,,,,,,,,,,,,,,,,,,                             \n        ,,,,,,,,,,,,,,,,,,,,,,,,,,                          \n      ,,,,,,,,,,,,,,  .,,,,,,,,,,,,,                        \n    ,,,,,,,,,,           ,,,,,,,,,,,,                       \n      ,,,,,,,          .,,,,,,,,,,,                          \n  ,*,,,,,,          ,,,,,,,,,,,,                             \n.**,,,,.**      .,,,,,,,,,,,                                \n.,,,,,,,**    ,,,,,,,,,,,                                   \n  .,,,,.**       ,,,,,,                                      \n    *******       ,                                         \n    **********              **,                             \n      ************,,  ,,*********,                          \n        **************************                          \n            ********************                             \n                  ******.\n'
        )

        this.isDevelopment = ['development', 'local'].includes(APP_ENV)

        if (typeof document !== 'undefined' && !this.isDevelopment) {
            document.addEventListener('contextmenu', (event) =>
                event.preventDefault()
            )

            document.onkeydown = (e) => {
                if (e.ctrlKey && e.shiftKey && e.key == 'I') {
                    e.preventDefault()
                }
                if (e.ctrlKey && e.shiftKey && e.key == 'C') {
                    e.preventDefault()
                }
                if (e.ctrlKey && e.shiftKey && e.key == 'J') {
                    e.preventDefault()
                }
                if (e.ctrlKey && e.key == 'U') {
                    e.preventDefault()
                }
            }
        }

        if (this.isDevelopment) {
            this.log = console.log.bind(console)
            this.warn = console.warn.bind(console)
            this.error = console.error.bind(console)
            this.info = console.info.bind(console)
            this.debug = console.debug.bind(console)
        } else {
            this.log = () => {}
            this.warn = () => {}
            this.error = () => {}
            this.info = () => {}
            this.debug = () => {}

            console.log = () => {}
            console.warn = () => {}
            console.error = () => {}
            console.info = () => {}
            console.debug = () => {}
        }
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }
}

export default Logger.getInstance()
