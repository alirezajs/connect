import { Injectable, HttpService } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {
  }


  public pushNotification(): Observable<AxiosResponse<any[]>> {
    const data = {
      'app_ids': ['6g03o3z8kx984m3g'],
      'device_id': ['wzlkim2jgzp7hse4f869'],
      'platform': 2,
      'data': {
        'title': 'show-confirm'
      }
    }
    return this.sendPush(data)
  }
  public pushNotificationType2(): Observable<AxiosResponse<any[]>> {
    const data = {
      'app_ids': ['6g03o3z8kx984m3g'],
      'device_id': ['wzlkim2jgzp7hse4f869'],
      'platform': 2,
      'data': {
        'title': 'show-confirm-2'
      }
    }
    return this.sendPush(data)
  }

  public confirmNotification(): Observable<AxiosResponse<any[]>> {
    const data = {
      'app_ids': ['6g03o3z8kx984m3g'],
      'device_id': ['wzlkim2jgzp7hse4f869'],
      'platform': 2,
      'data': {
        'title': 'confirm'
      }
    }
    return this.sendPush(data)

  }

  sendPush(data: any): Observable<AxiosResponse<any[]>> {
    return this.httpService.post('https://api.pushe.co/v2/messaging/notifications/', data, {
      headers: {
        'authorization': 'Token c9d0ea43cbd988cc8f21d80c90ac90bb84f31885',
        'content-type': 'application/json'
      }
    })
  }
}
