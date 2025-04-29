import APIService from './api-service'
import { ITimesheetResource, ITimeInRequest, ITimeOutRequest } from '@/types'

/**
 * Service class to handle timesheet-specific operations.
 */
export default class TimesheetService {
    private static readonly BASE_ENDPOINT = '/timesheet'

    public static async timeIn(
        timeInData: ITimeInRequest
    ): Promise<ITimesheetResource> {
        const endpoint = `${TimesheetService.BASE_ENDPOINT}/time-in`
        const response = await APIService.post<
            ITimeInRequest,
            ITimesheetResource
        >(endpoint, timeInData)
        return response.data
    }

    public static async timeOut(
        timeOutData: ITimeOutRequest
    ): Promise<ITimesheetResource> {
        const endpoint = `${TimesheetService.BASE_ENDPOINT}/time-out`
        const response = await APIService.post<
            ITimeOutRequest,
            ITimesheetResource
        >(endpoint, timeOutData)
        return response.data
    }

    public static async getCurrentEmployeeTime(): Promise<ITimesheetResource | null> {
        const endpoint = `${TimesheetService.BASE_ENDPOINT}/current`
        const response = await APIService.get<ITimesheetResource | null>(
            endpoint
        )
        return response.data
    }
}
