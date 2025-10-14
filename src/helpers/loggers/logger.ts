import { APP_ENV } from '@/constants'
import { TFootstepLevel, createFootstep } from '@/modules/footstep'

/* eslint-disable no-console */
type LogMethod = (...args: unknown[]) => void

class Logger {
    private static instances: Map<string, Logger> = new Map()
    private isDevelopment: boolean
    private module: string

    public log: LogMethod
    public warn: LogMethod
    public error: LogMethod
    public info: LogMethod
    public debug: LogMethod

    private constructor(module: string = 'default') {
        this.module = module
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
            this.log = (...args) => {
                console.log(...args)
                this.footstep('info', args.join(' '), 'log')
            }
            this.warn = (...args) => {
                console.warn(...args)
                this.footstep('warning', args.join(' '), 'warning_log')
            }
            this.error = (...args) => {
                console.error(...args)
                this.footstep('error', args.join(' '), 'error_log')
            }
            this.info = (...args) => {
                console.info(...args)
                this.footstep('info', args.join(' '), 'info_log')
            }
            this.debug = (...args) => {
                console.debug(...args)
                this.footstep('debug', args.join(' '), 'debug_log')
            }
        } else {
            this.log = (...args) => {
                this.footstep('info', args.join(' '), 'log')
            }
            this.warn = (...args) => {
                this.footstep('warning', args.join(' '), 'warning_log')
            }
            this.error = (...args) => {
                this.footstep('error', args.join(' '), 'error_log')
            }
            this.info = (...args) => {
                this.footstep('info', args.join(' '), 'info_log')
            }
            this.debug = (...args) => {
                this.footstep('debug', args.join(' '), 'debug_log')
            }
            console.log = (..._args) => {}
            console.warn = (..._args) => {}
            console.error = (..._args) => {}
            console.info = (..._args) => {}
            console.debug = (..._args) => {}
        }
    }

    public async footstep(
        level: TFootstepLevel,
        description: string,
        activity: string
    ) {
        await createFootstep({
            level,
            description,
            activity,
            module: this.module,
        })
    }

    public static getInstance(module: string = 'default'): Logger {
        if (!Logger.instances.has(module)) {
            Logger.instances.set(module, new Logger(module))
        }
        return Logger.instances.get(module)!
    }
}

// Default logger instance
export default Logger.getInstance()

// Export the Logger class for module-specific instances
export { Logger }
