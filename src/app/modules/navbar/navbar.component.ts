import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  // TODO: get links using API call
  links = ['Projects', 'About'];

  constructor(
    private router: Router,
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
    this.router.navigate(['/']);
  }

  linkClick(link: string): void {
    this.router.navigate([link.toLocaleLowerCase()]);
  }

}
