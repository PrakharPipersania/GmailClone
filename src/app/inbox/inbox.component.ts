import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emails } from '../modal';
import { EmailsService } from '../emails.service';
import {EncrDecrService} from '../encr-decr.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  inboxMail: boolean = true;
  mailList:Array<Emails> = [];
  userInfo: any;
  mailContent: any;

  constructor(private emailsService:EmailsService, private EncrDecr: EncrDecrService, private router:Router) { }

  ngOnInit(): void {
    this.load();
  }

  decode() {
    let authdata: string = this.EncrDecr.Decode();
    try {
      return JSON.parse(authdata).AuthData;
    } catch (error) {
      this.logout();
    }
  }

  load() {
    this.inboxMail = true;
    this.userInfo = this.decode();
    console.log("Assigned:", this.userInfo);
    this.emailsService.getUserEmails(this.userInfo.UserEmail,'inbox').subscribe((data) => {
      this.mailList = data.slice().reverse();
    },
    () => {
      this.logout();
    })
  }

  toggleStarred(emailInfo: Emails) {
    emailInfo.receiverStarred = !emailInfo.receiverStarred;
    if(emailInfo.sender === emailInfo.receiver) {
      emailInfo.senderStarred = emailInfo.receiverStarred;
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {});
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }

  mailDateFormat(date: Date) {
    let curDate = new Date();
    let emailDate = new Date(date);
    if(emailDate.getFullYear() < curDate.getFullYear()) {
      return (`${emailDate.toLocaleDateString()}`);
    } else if(curDate.toLocaleDateString() == emailDate.toLocaleDateString()) {
      return (emailDate.toLocaleTimeString().replace(/(.*)\D\d+/, '$1'));
    }
    return (emailDate.toDateString().substr(4,6));
  }

  deleteEmail(emailInfo: Emails) {
    emailInfo.receiverTrash = !emailInfo.receiverTrash;
    if(emailInfo.sender === emailInfo.receiver) {
      emailInfo.senderTrash = emailInfo.receiverTrash;
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {
      this.load();
      alert("Conversation moved to Trash.");
    });
  }

  openMail(emailInfo: Emails) {
    this.inboxMail = !this.inboxMail;
    this.mailContent = emailInfo;
    if(emailInfo.readByReceiver === false) {
      emailInfo.readByReceiver = !emailInfo.readByReceiver;
      this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {});
    }
  }

  getFullDate(date: Date) {
    date = new Date(date);
    return (`${date.toDateString().substr(4)}, ${new Date().toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`);
  }

  getSender(emailInfo: Emails) {
    if(emailInfo.sender === this.userInfo.UserEmail)
      return "me";
    return emailInfo.sender;
  }
  
}