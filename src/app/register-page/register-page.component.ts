import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  userForm:FormGroup;
  isRegistered:boolean = false;

  constructor(private formBuilder: FormBuilder, private userService:UsersService, private router:Router) { 
    this.userForm = this.formBuilder.group({
      'UserName': new FormControl('', [Validators.required]),
      'UserDOB': new FormControl('', [Validators.required]),
      'UserGender': new FormControl('', [Validators.required]),
      'UserEmail': new FormControl('', [Validators.required, Validators.email]),
      'UserPassword': new FormControl('', [Validators.required,Validators.minLength(8)]),
      'ConfirmPwd': new FormControl('', [Validators.required])
    },
    {
      validators: this.passwordValidator('UserPassword','ConfirmPwd')
    });
  }

  ngOnInit(): void {
  }

  passwordValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.passwordValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ passwordValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  submitUser() {
    Object.keys(this.userForm.controls).forEach(field => {
      const control = this.userForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });

    if(this.userForm.valid){
      console.log(this.userForm.value);

      this.userService.getUserInfo(this.userForm.value.UserEmail).subscribe((data) => {
        if(data.length == 0) {
          this.userService.createUser(this.userForm.value).subscribe(() => {
            this.isRegistered = true;
            setTimeout(() => { this.router.navigate(['/login']) }, 2000);
          },() => {
            alert("Something Went Wrong. Try Again Later!");
          })
        }
        else {
          alert("That email is taken. Try another.");
          this.userForm.controls.UserEmail.setValue('');
        }
      },() => {
        alert("Something Went Wrong. Try Again Later!");
      })

    }
  }

}
