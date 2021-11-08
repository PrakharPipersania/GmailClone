import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { EmailsService } from '../emails.service';
import {EncrDecrService} from '../encr-decr.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  emailForm:FormGroup = new FormGroup({});
  displayStyle = "none";
  sidebarStatus: boolean = false;
  currentRoute: string = "";
  userInfo: any;

  constructor(private router:Router, private EncrDecr: EncrDecrService, private userService:UsersService, private emailService:EmailsService) { 
    this.userInfo = this.decode();
    this.resetEmailMessage();
  }

  decode() {
    let authdata: string = this.EncrDecr.Decode();
    try {
      return JSON.parse(authdata).AuthData;
    } catch (error) {
      this.logout();
    }
  }

  ngOnInit(): void {
    this.findCurrentRoute();
  }
  
  findCurrentRoute() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e:any) => {      
      this.currentRoute = e.url;
      console.log(this.currentRoute);
    });
  }
  
  resetEmailMessage() {
    this.emailForm = new FormGroup({
      'sender': new FormControl(this.userInfo.UserEmail),
      'receiver': new FormControl('', [Validators.required, Validators.email]),
      'message': new FormControl(''),
      'senderStarred': new FormControl(false),
      'receiverStarred': new FormControl(false),
      'senderTrash': new FormControl(false),
      'receiverTrash': new FormControl(false),
      'delBySender': new FormControl(false),
      'delByReceiver': new FormControl(false),
      'msgDate': new FormControl(new Date().toISOString()),
      'readByReceiver': new FormControl(false),
      'readBySender': new FormControl(true),
      'subject': new FormControl('')
    });
  }

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  togglemenu() {
    this.sidebarStatus = !this.sidebarStatus;
  }

  redirectTo(url: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>this.router.navigate([url]));
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate(['']);
  }

  validateSendEmail(){
    Object.keys(this.emailForm.controls).forEach(field => {
      const control = this.emailForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    if(this.emailForm.valid) {
      this.userService.getUserInfo(this.emailForm.value.receiver).subscribe((data) => {
        if(data.length>0) {
          if(this.emailForm.value.subject.length === 0) {
            this.emailForm.value.subject = '(no subject)';
          }
          this.emailService.sendEmail(this.emailForm.value).subscribe(() => {
            this.resetEmailMessage();
            this.closePopup();
            alert("Message sent.");
            this.router.navigate(['/mail/sent']);
          },
          () => {
            alert("Something Went Wrong. Try Again Later!");
          });
        } else {
          alert(`The email account (${this.emailForm.value.receiver}) that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces.`);
        }
      },
      () => {
        alert("Something Went Wrong. Try Again Later!");
      }) 
    }
  }

}
