import { APP_ENV } from '@/constants'
import { TFootstepLevel, createFootstep } from '@/modules/footstep'

/* eslint-disable no-console */
type LogMethod = (...args: unknown[]) => void

class Logger {
    private static instances: Map<string, Logger> = new Map()
    private isDevelopment: boolean
    private module: string
    private static hasLoggedAsciiArt: boolean = false

    public log: LogMethod
    public warn: LogMethod
    public error: LogMethod
    public info: LogMethod
    public debug: LogMethod

    private constructor(module: string = 'default') {
        this.module = module
        if (!Logger.hasLoggedAsciiArt) {
            console.log(
                '\n                  ......                                    \n            .,,,,,,,,,,,,,,,,,,,                             \n        ,,,,,,,,,,,,,,,,,,,,,,,,,,                          \n      ,,,,,,,,,,,,,,  .,,,,,,,,,,,,,                        \n    ,,,,,,,,,,           ,,,,,,,,,,,,                       \n      ,,,,,,,          .,,,,,,,,,,,                          \n  ,*,,,,,,          ,,,,,,,,,,,,                             \n.**,,,,.**      .,,,,,,,,,,,                                \n.,,,,,,,**    ,,,,,,,,,,,                                   \n  .,,,,.**       ,,,,,,                                      \n    *******       ,                                         \n    **********              **,                             \n      ************,,  ,,*********,                          \n        **************************                          \n            ********************                             \n                  ******.\n'
            )
            Logger.hasLoggedAsciiArt = true
        }

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
                this.footstep('info', args.join(' '), 'client_log')
            }
            this.warn = (...args) => {
                console.warn(...args)
                this.footstep('warning', args.join(' '), 'client_warning_log')
            }
            this.error = (...args) => {
                console.error(...args)
                this.footstep('error', args.join(' '), 'client_error_log')
            }
            this.info = (...args) => {
                console.info(...args)
                this.footstep('info', args.join(' '), 'client_info_log')
            }
            this.debug = (...args) => {
                console.debug(...args)
                this.footstep('debug', args.join(' '), 'client_debug_log')
            }
        } else {
            this.log = (...args) => {
                this.footstep('info', args.join(' '), 'client_log')
            }
            this.warn = (...args) => {
                this.footstep('warning', args.join(' '), 'client_warning_log')
            }
            this.error = (...args) => {
                this.footstep('error', args.join(' '), 'client_error_log')
            }
            this.info = (...args) => {
                this.footstep('info', args.join(' '), 'client_info_log')
            }
            this.debug = (...args) => {
                this.footstep('debug', args.join(' '), 'client_debug_log')
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
            payload: {
                level,
                description,
                activity,
                module: this.module,
            },
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

/**
import { Logger } from '@/helpers/loggers/logger'

const authLogger = Logger.getInstance('authentication')
const userLogger = Logger.getInstance('user-management') 
const paymentLogger = Logger.getInstance('payment-processing')

authLogger.log('User attempting to login')
authLogger.warn('Multiple failed login attempts detected')
authLogger.error('Authentication failed')
authLogger.info('Login successful')
authLogger.debug('Token validation in progress')
 */
