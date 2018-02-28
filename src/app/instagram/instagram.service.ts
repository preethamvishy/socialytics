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

  getUserById(
    userId,
    count = 50,
    after = '') {
    return this.http.get(`https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=${userId}&first=${count}&after=${after}`)
      .map(res => res)
  }

}
