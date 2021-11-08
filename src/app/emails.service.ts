import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Emails } from './modal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  baseURL:string = `${environment.baseurl}/prakharp/emails`;
  
  constructor(private http:HttpClient) { }

  getUserEmails(userEmail: string, mailType: string) {
    // return this.http.get<Array<Emails>>(`${this.baseURL}?email=${userEmail}&mail=${mailType}`,
    // {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem("AuthToken") || ""}`
    //   })
    // });
    return this.http.get<Array<Emails>>(`${this.baseURL}?email=${userEmail}&mail=${mailType}`);
  }

  sendEmail(emailInfo: Emails) {
    // return this.http.post(this.baseURL,emailInfo,
    // {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem("AuthToken") || ""}`
    //   })
    // });
    console.log(emailInfo);
    return this.http.post(this.baseURL,emailInfo);
  }

  updateEmailInfo(emailInfo: Emails) {
    // return this.http.put(this.baseURL,emailInfo,
    // {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem("AuthToken") || ""}`
    //   })
    // });
    return this.http.put(this.baseURL,emailInfo);
  }
  
}