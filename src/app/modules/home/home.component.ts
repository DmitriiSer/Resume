import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title = 'Home';
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
