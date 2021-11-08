import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from './modal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseURL:string = `${environment.baseurl}/prakharp/users`;
  
  constructor(private http:HttpClient) { }

  getUserInfo(userEmail: string) {
    return this.http.get<Array<Users>>(`${this.baseURL}?email=${userEmail}`);
  }

  createUser(userInfo: Users) {
    return this.http.post(this.baseURL, userInfo);
  }

  updateUserInfo(userInfo: Users) {
    // return this.http.put(`${this.baseURL}/updateuserdetails`, userInfo,
    // {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem("AuthToken") || ""}`
    //   })
    // });
    return this.http.put(this.baseURL, userInfo);
  }
}
