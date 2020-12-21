import {
  Inject, Injectable,
  Optional
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AboutData } from './models/about-data';
import { BASE_API_PATH } from './models/base-api-path';
import { PagesData } from './models/pages-data';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private apiPathMap: { [key: string]: string } = {
    subpath: '/assets/data/',
  };

  constructor(
    private http: HttpClient,
    @Optional() @Inject(BASE_API_PATH) private basePath: string
  ) {
    this.basePath = basePath ? basePath : '';
  }

  /**
   * Retrieve a list of available pages
   */
  getPages(): Observable<Array<PagesData>> {
    return this.http.get<Array<PagesData>>(this.getUrl('pages'))
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }


  /**
   * Retrieve details about myself
   */
  getAbout(): Observable<AboutData> {
    return this.http.get<AboutData>(this.getUrl('about'))
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  private getUrl(key: string): string {
    const subpath = this.apiPathMap['subpath'];
    return subpath !== undefined ?
      `${this.basePath}${subpath}${key}.json` : '';
  }

}
