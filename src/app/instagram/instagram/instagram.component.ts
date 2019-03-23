import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators';


import { ActivatedRoute, Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ElectronService } from 'ngx-electron';
import { InstagramService } from '../instagram.service'
import { Http } from '@angular/http';

declare var $: any;

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {

  searchQuery: FormGroup;
  basicUserData;
  media: any[] = [];
  username = '';
  loaded = false;
  stats;
  mostLikedMedia = [];
  mostCommentedMedia = [];
  summary = [
    { key: 'Posts', value: '' },
    { key: 'Followers', value: '' },
    { key: 'Following', value: '' }
  ]

  engagements = [
    { key: 'Total likes', value: '' },
    { key: 'Total comments', value: '' },
    { key: 'Average likes', value: '' },
    { key: 'Average comments', value: '' }
  ]

  sampleSize;
  expandPost = null;

  constructor(private http: HttpClient,
    private instagramService: InstagramService,
    private fb: FormBuilder,
    private electronService: ElectronService,
    private route: ActivatedRoute,
    private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.username = params['user'] || '';
        if (this.username.length > 0)
          this.search();
      });


  }
  createForm() {
    this.searchQuery = this.fb.group({
      username: ['', Validators.required],
    });
  }

  search() {
    if (this.username.length <= 0)
      this.username = this.searchQuery.value.username.trim();

    else {
      this.getUserData();
   
      this.router.navigate(['instagram'], { queryParams: { user: this.username.trim() } });
    }
  }
  externalUrl(url) {
    var shell = this.electronService.shell;
    if (shell)
      shell.openExternal(url);
    else
      window.open(url);
  }

  getMockData() {
    this.http.get('./assets/mockStats.json')
      .subscribe(res => {
        this.stats = res;
        this.populateStats();
      })
  }

  getUserData() {

    var body = new HttpParams()
      .set('username', this.username)

    this.http.post(`https://ig-server.herokuapp.com/user`, body.toString(),
      {
        headers: new HttpHeaders()
          .append('Content-Type', 'application/json')
          .append('Access-Control-Allow-Origin', '*')
          .append("Access-Control-Allow-Headers", "*")
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(
      catchError(this.handleError)
    )
      .subscribe((data) => {
        var userData = data;
        this.basicUserData = userData
        this.stats = this.instagramService.getStats(userData['graphql'].user.edge_owner_to_timeline_media.edges, userData['graphql'].user, this.username, 6);
        this.populateStats();
      })
  }

  populateStats() {
    this.summary[0].value = this.stats.posts;
    this.summary[1].value = this.stats.followers;
    this.summary[2].value = this.stats.following;

    this.engagements[0].value = this.stats.totalLikes;
    this.engagements[1].value = this.stats.totalComments;
    this.engagements[2].value = this.stats.averageLikes;
    this.engagements[3].value = this.stats.averageComments;

    this.mostLikedMedia = this.stats.mostLikedMedia;
    this.mostCommentedMedia = this.stats.mostCommentedMedia;
    this.sampleSize = this.basicUserData.graphql.user.edge_owner_to_timeline_media.edges.length;
    this.loaded = true;
  }

  toggleModal(media) {
    $("#postExpand").modal("toggle");
    this.expandPost = media
    console.log(media)
  }

  handleError() {
    $("#error").modal("toggle");
    return 'Some error occured'
  }
}
