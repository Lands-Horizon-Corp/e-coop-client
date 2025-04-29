import APIService from './api-service'

export default class Connection {
    private static readonly BASE_ENDPOINT = '/'

    /**
     * Test backend connection
     *
     * @returns {Promise<boolean>}
     */
    public static async test(): Promise<boolean> {
        const response = await APIService.get(Connection.BASE_ENDPOINT)
        return response.status === 200
    }
}
