import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import {EncrDecrService} from '../encr-decr.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  userForm:FormGroup;
  isValidUser?:boolean;

  constructor(private userService:UsersService, private EncrDecr: EncrDecrService, private router:Router) { 
    this.userForm = new FormGroup({
      'UserEmail': new FormControl('', [Validators.required, Validators.email]),
      'UserPassword': new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  validateUser(){
    Object.keys(this.userForm.controls).forEach(field => {
      const control = this.userForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });

    if(this.userForm.valid){
      console.log(this.userForm.value);
      this.userService.getUserInfo(this.userForm.value.UserEmail).subscribe((data) => {
        console.log(data,"   " ,data[0].userPassword,"     ",this.userForm.value.UserPassword);
        if(data.length > 0 && data[0].userPassword === this.userForm.value.UserPassword) {
          this.isValidUser=true;
          window.localStorage.setItem('AuthData', this.EncrDecr.Encode(data[0]));
          setTimeout(() => { this.router.navigate(['/mail/inbox']) }, 2000);
        }
        if(this.isValidUser!==true) {
          this.isValidUser=false;
          setTimeout(() => { 
            this.isValidUser=undefined;
            this.userForm.reset();
          }, 2000);
        }
      },() => {
        alert("Something Went Wrong. Try Again Later!");
      })
      
    }
  }

}
