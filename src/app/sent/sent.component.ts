import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emails } from '../modal';
import { EmailsService } from '../emails.service';
import {EncrDecrService} from '../encr-decr.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css']
})
export class SentComponent implements OnInit {

  sentMail: boolean = true;
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
    this.sentMail = true;
    this.userInfo = this.decode();
    this.emailsService.getUserEmails(this.userInfo.UserEmail,'sent').subscribe((data) => {
      this.mailList = data.slice().reverse();
    },
    () => {
      this.logout();
    })
  }

  toggleStarred(emailInfo: Emails) {
    emailInfo.senderStarred = !emailInfo.senderStarred;
    if(emailInfo.sender === emailInfo.receiver) {
      emailInfo.receiverStarred = emailInfo.senderStarred;
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {});
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate(['']);
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
    emailInfo.senderTrash = !emailInfo.senderTrash;
    if(emailInfo.sender === emailInfo.receiver) {
      emailInfo.receiverTrash = emailInfo.senderTrash
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {
      this.load();
      alert("Conversation moved to Trash.");
    });
  }

  openMail(emailInfo: Emails) {
    this.sentMail = !this.sentMail;
    this.mailContent = emailInfo;
    if(emailInfo.readBySender === false) {
      emailInfo.readBySender = !emailInfo.readBySender;
      this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {});
    }
  }

  getFullDate(date: Date) {
    date = new Date(date);
    return (`${date.toDateString().substr(4)}, ${new Date().toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`);
  }

  getReceiver(emailInfo: Emails) {
    if(emailInfo.receiver == this.userInfo.UserEmail)
      return "me";
    return emailInfo.receiver;
  }

}