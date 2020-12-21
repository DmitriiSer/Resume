import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() title = '';

  rippleColor = this.theme.getPrimaryColor() + 'bb';
  avatarHover = false;

  links: Array<string> = [];

  constructor(
    private router: Router,
    private theme: ThemeService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    // retrieve app pages and about details
    forkJoin([
      this.api.getPages(),
      this.api.getAbout()
    ]).subscribe(data => {
      const pages = data[0];
      const about = data[1];

      // set navbar title      
      this.title = about.fullname;

      // generate page links      
      this.links = pages.map(v => v.title);
    });
  }

  avatarClick() {
    const primary = this.theme.getPrimaryColor();
    const accent = this.theme.getAccentColor();
    if (this.rippleColor === primary) {
      this.rippleColor = accent;
    } else {
      this.rippleColor = primary;
    }
    this.router.navigate(['/']);
  }

  linkClick(link: string): void {
    this.router.navigate([link.toLocaleLowerCase()]);
  }

}
