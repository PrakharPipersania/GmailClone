import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    if(window.localStorage.getItem("AuthData") == null) {
      setTimeout(() => { this.router.navigate(['/login']) }, 4000);
    } else {
      setTimeout(() => { this.router.navigate(['/mail/inbox']) }, 4000);
    }
  }

}
