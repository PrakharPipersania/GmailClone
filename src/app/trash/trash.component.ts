import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emails } from '../modal';
import { EmailsService } from '../emails.service';
import {EncrDecrService} from '../encr-decr.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {

  trashMail: boolean = true;
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
    this.trashMail = true;
    this.userInfo = this.decode();
    this.emailsService.getUserEmails(this.userInfo.UserEmail,'trash').subscribe((data) => {
      this.mailList = data.slice().reverse();
    },
    () => {
      this.logout();
    })
  }

  toggleStarred(emailInfo: Emails) {
    if(emailInfo.receiver === this.userInfo.UserEmail) {
      emailInfo.receiverStarred = !emailInfo.receiverStarred;
      if(emailInfo.sender === emailInfo.receiver) {
        emailInfo.senderStarred = emailInfo.receiverStarred;
      }
    } else {
      emailInfo.senderStarred = !emailInfo.senderStarred;
      if(emailInfo.sender === emailInfo.receiver) {
        emailInfo.receiverStarred = emailInfo.senderStarred;
      }
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

  restoreEmail(emailInfo: Emails) {
    if(emailInfo.sender === this.userInfo.UserEmail) {
      emailInfo.senderTrash = !emailInfo.senderTrash;
      if(emailInfo.sender === emailInfo.receiver) {
        emailInfo.receiverTrash = emailInfo.senderTrash;
      }
    } else {
      emailInfo.receiverTrash = !emailInfo.receiverTrash;
      if(emailInfo.sender === emailInfo.receiver) {
        emailInfo.senderTrash = emailInfo.receiverTrash;
      }
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {
      this.load();
      alert("Conversation Restored.");
    });
  }

  deleteEmail(emailInfo: Emails) {
    if(emailInfo.sender === this.userInfo.UserEmail) {
      emailInfo.delBySender = !emailInfo.delBySender;
      if(emailInfo.sender === emailInfo.receiver) {
        emailInfo.delByReceiver = emailInfo.delBySender;
      }
    } else {
      emailInfo.delByReceiver = !emailInfo.delByReceiver;
      if(emailInfo.sender === emailInfo.receiver) {
        emailInfo.delBySender = emailInfo.delByReceiver;
      }
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {
      this.load();
      alert("Conversation deleted forever.");
    });
  }

  getSender(emailInfo: Emails) {
    if(emailInfo.sender == this.userInfo.UserEmail)
      return "me";
    return emailInfo.sender;
  }
  
  openMail(emailInfo: Emails) {
    this.trashMail = !this.trashMail;
    this.mailContent = emailInfo;
    if(emailInfo.receiver === this.userInfo.UserEmail) {
      if(emailInfo.readByReceiver === false) {
        emailInfo.readByReceiver = !emailInfo.readByReceiver;
      }
    } else {
      if(emailInfo.readBySender === false) {
        emailInfo.readBySender = !emailInfo.readBySender;
      }
    }
    this.emailsService.updateEmailInfo(emailInfo).subscribe(() => {});
  }

  checkSRStar(emailInfo: Emails) {
    if(emailInfo.receiver === this.userInfo.UserEmail) {
      return emailInfo.receiverStarred;
    } else {
      return emailInfo.senderStarred;
    }
  }

  checkSRRead(emailInfo: Emails, vis: string) {
    if(emailInfo.receiver === this.userInfo.UserEmail) {
      if(vis === 'show') {
        return emailInfo.readByReceiver;
      } else {
      return !emailInfo.readByReceiver;
      }
    } else {
      if(vis === 'show') {
        return emailInfo.readBySender;
      } else {
      return !emailInfo.readBySender;
      }
    }
  }

  getFullDate(date: Date) {
    date = new Date(date);
    return (`${date.toDateString().substr(4)}, ${new Date().toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`);
  }

}