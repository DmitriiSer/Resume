import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  title = '';
  aboutMe = '';
  skills: Array<string> = [];
  education: Array<string> = [];
  employment: Array<string> = [];
  projects: Array<string> = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getAbout().subscribe(about => {
      console.log(`about:`, about);
      this.title = about.title;
      this.aboutMe = about.aboutMe;
      this.skills = about.skills;
    })
  }

}
