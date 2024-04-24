import { AxiosResponse } from 'axios'

const isSuccess = (res: AxiosResponse) => res.status >= 200 && res.status <= 300
export default isSuccess
