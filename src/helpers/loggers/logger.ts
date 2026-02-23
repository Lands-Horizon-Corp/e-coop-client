import { IS_STAGING } from '@/constants'
import { TFootstepLevel, createFootstep } from '@/modules/footstep'

/* eslint-disable no-console */
type LogMethod = (...args: unknown[]) => void

class Logger {
    private static instances: Map<string, Logger> = new Map()
    private isDevelopment: boolean
    private module?: string
    private static hasLoggedAsciiArt: boolean = false

    public log: LogMethod
    public warn: LogMethod
    public error: LogMethod
    public info: LogMethod
    public debug: LogMethod

    private constructor(module?: string, footstep: boolean = true) {
        this.isDevelopment = !IS_STAGING
        this.module = module

        if (!Logger.hasLoggedAsciiArt && !this.isDevelopment) {
            console.log(
                '\n                  ......                                    \n            .,,,,,,,,,,,,,,,,,,,                             \n        ,,,,,,,,,,,,,,,,,,,,,,,,,,                          \n      ,,,,,,,,,,,,,,  .,,,,,,,,,,,,,                        \n    ,,,,,,,,,,           ,,,,,,,,,,,,                       \n      ,,,,,,,          .,,,,,,,,,,,                          \n  ,*,,,,,,          ,,,,,,,,,,,,                             \n.**,,,,.**      .,,,,,,,,,,,                                \n.,,,,,,,**    ,,,,,,,,,,,                                   \n  .,,,,.**       ,,,,,,                                      \n    *******       ,                                         \n    **********              **,                             \n      ************,,  ,,*********,                          \n        **************************                          \n            ********************                             \n                  ******.\n'
            )
            Logger.hasLoggedAsciiArt = true
        }

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
                this.footstep('info', args.join(' '), 'client_log', footstep)
            }
            this.warn = (...args) => {
                console.warn(...args)
                this.footstep(
                    'warning',
                    args.join(' '),
                    'client_warning_log',
                    footstep
                )
            }
            this.error = (...args) => {
                console.error(...args)
                this.footstep(
                    'error',
                    args.join(' '),
                    'client_error_log',
                    footstep
                )
            }
            this.info = (...args) => {
                console.info(...args)
                this.footstep(
                    'info',
                    args.join(' '),
                    'client_info_log',
                    footstep
                )
            }
            this.debug = (...args) => {
                console.debug(...args)
                this.footstep(
                    'debug',
                    args.join(' '),
                    'client_debug_log',
                    footstep
                )
            }
        } else {
            this.log = (...args) => {
                this.footstep('info', args.join(' '), 'client_log', footstep)
            }
            this.warn = (...args) => {
                this.footstep(
                    'warning',
                    args.join(' '),
                    'client_warning_log',
                    footstep
                )
            }
            this.error = (...args) => {
                this.footstep(
                    'error',
                    args.join(' '),
                    'client_error_log',
                    footstep
                )
            }
            this.info = (...args) => {
                this.footstep(
                    'info',
                    args.join(' '),
                    'client_info_log',
                    footstep
                )
            }
            this.debug = (...args) => {
                this.footstep(
                    'debug',
                    args.join(' '),
                    'client_debug_log',
                    footstep
                )
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
        activity: string,
        footstep: boolean = true
    ) {
        if (this.module) {
            if (footstep)
                await createFootstep({
                    payload: {
                        level,
                        description,
                        activity,
                        module: this.module,
                    },
                })
        }
    }

    public static getInstance(
        module: string = 'default',
        footstep = true
    ): Logger {
        if (!Logger.instances.has(module)) {
            Logger.instances.set(module, new Logger(module, footstep))
        }
        return Logger.instances.get(module)!
    }
}

// Default logger instance
export default Logger.getInstance('default', false)

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
