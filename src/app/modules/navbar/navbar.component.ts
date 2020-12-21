import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  title = 'Dmitrii Serikov';

  rippleColor = this.theme.getPrimaryColor() + 'bb';
  avatarHover = false;

  links = ['Projects', 'About'];

  constructor(
    private theme: ThemeService
  ) { }

  ngOnInit(): void {
  }

  avatarClick() {
    const primary = this.theme.getPrimaryColor();
    const accent = this.theme.getAccentColor();
    if (this.rippleColor === primary) {
      this.rippleColor = accent;
    } else {
      this.rippleColor = primary;
    }
    console.log(`avatarClick, rippleColor = ${this.rippleColor}`);
  }

  linkClick(link: string): void {
    console.log(`linkClick = ${link}`);
  }

}
