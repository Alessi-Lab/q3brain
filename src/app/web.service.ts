import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private http: HttpClient) { }

  getFileLocation(fileLocation: string) {
    return this.http.get(fileLocation, {responseType: 'text', observe: 'body'})
  }
}
