import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var config;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  ApiUrl = config.APIUrl;
  constructor(private httpClient: HttpClient) { }

  public Get(url) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.get(this.ApiUrl + url, httpOptions);
  }

  public Post(url, parameters) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.ApiUrl + url, parameters, httpOptions);
  }
}
