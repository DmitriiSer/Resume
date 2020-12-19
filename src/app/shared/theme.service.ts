import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  colorsFound = false;

  private colors: {
    primary: string;
    accent: string;
    [color: string]: string;
  } = {};

  constructor() { }

  getColors(): {
    primary: string;
    accent: string;
  } {
    if (Object.keys(this.colors).length === 0) {
      this.findColors();
    }
    return this.colors;
  }

  getPrimaryColor(): string {
    if (this.colors.primary == null) {
      this.findColors();
    }
    return this.colors.primary;
  }

  getAccentColor(): string {
    if (this.colors.accent == null) {
      this.findColors();
    }
    return this.colors.accent;
  }

  private findColors(): void {
    if (!this.colorsFound) {
      const styles = document.getElementsByTagName('style');
      const regexps: { [key: string]: RegExp } = {
        primary: /\.mat-primary(.*?)color:([#\s\w\d]+)/g,
        accent: /\.mat-accent(.*?)color:([#\s\w\d]+)/g
        // accent: /\.mat-accent(.*?)color:([#\s\w\d]+)/g
      };
      Array.from(styles).forEach(style => {
        if (style.textContent != null) {
          const textContent = style.textContent.replace(/\r?\n/g, '');

          Object.keys(regexps).forEach(r => {
            const resArr = regexps[r].exec(textContent);
            if (resArr && resArr.length === 3) {
              this.colors[r] = resArr[2];
            }
          });
        }
      });
      this.colorsFound = true;
    }
  }

}
