import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

// import 'rxjs/Rx';

@Injectable()
export class InstagramService {

  constructor(private http: HttpClient) { }

  getUserByUsername(username) {
    return this.http.get(`https://www.instagram.com/${username}/?__a=1`)
      .map(res => res)
  }


}
