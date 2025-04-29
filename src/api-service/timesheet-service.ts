import APIService from './api-service'
import { ITimesheet, ITimeInRequest, ITimeOutRequest } from '@/types'

/**
 * Service class to handle timesheet-specific operations.
 */
export default class TimesheetService {
    private static readonly BASE_ENDPOINT = '/timesheet'

    public static async timeIn(
        timeInData: ITimeInRequest
    ): Promise<ITimesheet> {
        const endpoint = `${TimesheetService.BASE_ENDPOINT}/time-in`
        const response = await APIService.post<ITimeInRequest, ITimesheet>(
            endpoint,
            timeInData
        )
        return response.data
    }

    public static async timeOut(
        timeOutData: ITimeOutRequest
    ): Promise<ITimesheet> {
        const endpoint = `${TimesheetService.BASE_ENDPOINT}/time-out`
        const response = await APIService.post<ITimeOutRequest, ITimesheet>(
            endpoint,
            timeOutData
        )
        return response.data
    }

    public static async getCurrentEmployeeTime(): Promise<ITimesheet | null> {
        const endpoint = `${TimesheetService.BASE_ENDPOINT}/current`
        const response = await APIService.get<ITimesheet | null>(endpoint)
        return response.data
    }
}
