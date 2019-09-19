import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ElectronService } from 'ngx-electron';
import { InstagramService } from '../instagram.service'

declare var $: any;

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {

  @ViewChild('usernameSearchBar', { static: true }) usernameEl;

  searchQuery: FormGroup;
  basicUserData;
  media: any[] = [];
  username = '';
  loaded = false;
  loading = false;
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
  advancedUserData;

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

    this.loading = true;
    this.instagramService.getUserByUsername(this.username)
      .subscribe((basicUserData) => {
        this.basicUserData = basicUserData;
        this.instagramService.getUserById(this.basicUserData.graphql.user.id)
          .subscribe((advancedUserData) => {
            this.advancedUserData = advancedUserData
            this.stats = this.instagramService.getStats(this.advancedUserData.data.user.edge_owner_to_timeline_media.edges, this.basicUserData.graphql.user, this.username, 6);
            this.populateStats();
          }, err => this.handleError())
      }, err => this.handleError())
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
    this.sampleSize = this.stats.posts <= 50 ? this.stats.sampleSize : '50 latest';
    this.loading = false;
    this.loaded = true;
  }

  toggleModal(media) {
    $("#postExpand").modal("toggle");
    this.expandPost = media
  }

  handleError() {
    this.loading = false;
    this.loaded = true;
    this.stats = undefined;
    this.mostLikedMedia = [];
    this.mostCommentedMedia = [];
    this.summary = [
      { key: 'Posts', value: '' },
      { key: 'Followers', value: '' },
      { key: 'Following', value: '' }
    ];

    this.engagements = [
      { key: 'Total likes', value: '' },
      { key: 'Total comments', value: '' },
      { key: 'Average likes', value: '' },
      { key: 'Average comments', value: '' }
    ];

    $("#error").modal("toggle");
  }

  focusUsernameSearch() {
    this.usernameEl.nativeElement.focus();
    this.usernameEl.nativeElement.scrollIntoView({ behavior: "smooth", block: 'end' });
  }
}
