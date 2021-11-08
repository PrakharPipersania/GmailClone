import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Users } from './modal';

@Injectable({
  providedIn: 'root'
})
export class EncrDecrService {

  SecretKey: string = "GmailCloneByPrakharPipersania";

  constructor() { }

  //The set method is use for encrypt the value.
  Encode(userInfo: Users) {
    let AuthData = { 
      UserEmail: userInfo.userEmail, 
      UserName: userInfo.userName,
      UserDOB: userInfo.userDOB,
      UserGender: userInfo.userGender
    };
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify({ AuthData }), this.SecretKey).toString();
    return encrypted;
  }

  //The get method is use for decrypt the value.
  Decode() {
    let userInfo:string = window.localStorage.getItem('AuthData') || '';
    var decrypted = CryptoJS.AES.decrypt(userInfo, this.SecretKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
  
}
