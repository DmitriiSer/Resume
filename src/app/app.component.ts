import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Resume';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.readAbout().subscribe(data => {
      this.title = data.fullname;
    });
  }


}
