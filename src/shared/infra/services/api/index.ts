import axios, { type AxiosInstance } from 'axios'
import { apiConfig } from './config'

class API {
  protected baseUrl: string
  protected authorization: string
  private axiosInstance: AxiosInstance | any = null

  constructor () {
    this.baseUrl = apiConfig.baseUrl
    this.authorization = apiConfig.authorization
    this.axiosInstance = axios.create({})
  }

  get (url: string, params?: any, headers?: any): Promise<any> {
    return this.axiosInstance({
      timeout: 500000,
      method: 'GET',
      url: `${this.baseUrl}${url}`,
      params: params ? params : null,
      headers: headers ? Object.assign({Authorization: this.authorization}, headers) : {Authorization: this.authorization}
    })
  }

  post (url: string, data?: any, params?: any, headers?: any): Promise<any> { 
    return this.axiosInstance({
      timeout: 500000,
      method: 'POST',
      url: `${this.baseUrl}${url}`,
      data: data ? data : null,
      params: params ? params : null,
      headers: headers ? Object.assign({Authorization: this.authorization}, headers) : {Authorization: this.authorization}
    })
  }

  put (url: string, params?: any, headers?: any): Promise<any> {
    return this.axiosInstance({
      timeout: 500000,
      method: 'PUT',
      url: `${this.baseUrl}${url}`,
      params: params ? params : null,
      headers: headers ? Object.assign({Authorization: this.authorization}, headers) : {Authorization: this.authorization}
    })
  }

  delete (url: string, params?: any, headers?: any): Promise<any> {
    return this.axiosInstance({
      timeout: 500000,
      method: 'DELETE',
      url: `${this.baseUrl}${url}`,
      params: params ? params : null,
      headers: headers ? Object.assign({Authorization: this.authorization}, headers) : {Authorization: this.authorization}
    })
  }

  downloadFile (filename?: string, headers?: any): Promise<any> {
    if (!filename)
      throw new Error('Failed to retrieve the file name')

    return this.axiosInstance({
      timeout: 500000,
      method: 'GET',
      url: `${this.baseUrl}/BAIXAARQUIVO/${filename}`,
      responseType: 'blob',
      headers: headers ? Object.assign({Authorization: this.authorization}, headers) : {Authorization: this.authorization}
    })
  }

  handleResponse (response: any): any {
    if (!response.data?.sucesso)
      return

    if (response.data?.sucesso !== 'T')
      throw new Error(response.data?.mensagem)

    // if (!response.data?.dados?.length) 
    //   throw new Error('No response data found')

    return response
  }
}

export default new API()
