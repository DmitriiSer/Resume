import {
  Inject, Injectable,
  Optional
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AboutData } from './models/about-data';
import { BASE_API_PATH } from './models/base-api-path';

@Injectable({ providedIn: 'root' })
export class ApiService {

  apiPathMap = {
    about: '/assets/data/'
  };

  constructor(
    private http: HttpClient,
    @Optional() @Inject(BASE_API_PATH) private basePath: string
  ) {
    this.basePath = basePath ? basePath : '';
  }

  readAbout(): Observable<AboutData> {
    const key = 'about';
    let url = this.basePath + this.apiPathMap[key] + key + '.json';
    return this.http.get<AboutData>(url)
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      );
  }

}
