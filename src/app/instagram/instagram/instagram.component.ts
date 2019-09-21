import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { ElectronService } from 'ngx-electron';
import { InstagramService } from '../instagram.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PostComponent } from '../post/post.component';
import { catchError } from 'rxjs/operators';



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
  summary;
  engagements;

  sampleSize;
  expandPost = null;
  advancedUserData;

  modal: NzModalRef;
  @ViewChild('tplError', { static: false }) tplError;
  @ViewChild('tplUserError', { static: false }) tplUsernameError;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
  ];

  constructor(private http: HttpClient,
    private instagramService: InstagramService,
    private fb: FormBuilder,
    private electronService: ElectronService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.createForm();
    this.reset();
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
      this.loading = true;
      this.loaded = false;
      this.reset();
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
      .subscribe(basicUserData => {
        if (basicUserData) {
          this.basicUserData = basicUserData;
          this.instagramService.getUserById(this.basicUserData.graphql.user.id)
            .subscribe((advancedUserData) => {
              this.advancedUserData = advancedUserData
              this.stats = this.instagramService.getStats(this.advancedUserData.data.user.edge_owner_to_timeline_media.edges, this.basicUserData.graphql.user, this.username, 9);
              this.populateStats();
            }, err => {
              this.handleError()
            })
        }
      }, err => this.handleError(this.tplUsernameError))
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

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    let dayPosts = this.stats.days.map(day => day.dayPosts);
    let dayAvgLikes = this.stats.days.map(day => day.avgDayLikes);
    let dayAvgComments = this.stats.days.map(day => day.avgDayComments);

    this.barChartLabels = dayNames;
    this.barChartData.push({ data: dayPosts, label: 'Posts' });

    let minDayAvgLikes = dayAvgLikes.reduce(function (p, v) {
      if (v == 0 || p == 0)
        return 1000000000000
      return (p < v ? p : v);
    });

    let minDayAvgComments = dayAvgComments.reduce(function (p, v) {
      if (v == 0 || p == 0)
        return 100000000;
      return (p < v ? p : v);
    });

    let normalizer = 1;
    while ((normalizer * 10) < minDayAvgLikes)
      normalizer *= 10;

    switch (normalizer) {
      case 1000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 1000).toFixed(1)), label: 'Average Likes (in k)' });
        break; case 10000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 10000).toFixed(1)), label: 'Average Likes (in 10k)' });
        break;
      case 100000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 100000).toFixed(1)), label: 'Average Likes (in 100k)' });
        break;
      case 1000000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 1000000).toFixed(1)), label: 'Average Likes (in M)' });
        break; case 10000000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 10000000).toFixed(1)), label: 'Average Likes (in 10M)' });
        break;
      case 100000000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 100000000).toFixed(1)), label: 'Average Likes (in 100M)' });
        break;
      case 1000000000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 1000000000).toFixed(1)), label: 'Average Likes (in billion)' });
        break; case 10000000000: this.barChartData.push({ data: dayAvgLikes.map(item => (item / 10000000000).toFixed(1)), label: 'Average Likes (in 10B)' });
        break;
      default: this.barChartData.push({ data: dayAvgLikes, label: 'Average Likes' });
        break;
    }

    let commentNormalizer = 1;
    while ((commentNormalizer * 10) < minDayAvgComments)
      commentNormalizer *= 10;

    switch (commentNormalizer) {
      case 1000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 1000).toFixed(1)), label: 'Average Comments (in k)' });
        break;
      case 10000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 10000).toFixed(1)), label: 'Average Comments (in 10k)' });
        break;
      case 100000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 100000).toFixed(1)), label: 'Average Comments (in 100k)' });
        break;
      case 1000000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 1000000).toFixed(1)), label: 'Average Comments (in M)' });
        break;
      case 10000000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 10000000).toFixed(1)), label: 'Average Comments (in 10M)' });
        break;
      case 100000000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 100000000).toFixed(1)), label: 'Average Comments (in 100M)' });
        break;
      case 1000000000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 1000000000).toFixed(1)), label: 'Average Comments (in billion)' });
        break;
      case 10000000000: this.barChartData.push({ data: dayAvgComments.map(item => (item / 10000000000).toFixed(1)), label: 'Average Comments (in 10B)' });
        break;
      default: this.barChartData.push({ data: dayAvgComments, label: 'Average Comments' });
        break;
    }

    this.loading = false;
    this.loaded = true;
  }

  toggleModal(media, tplTitle?, tplFooter?) {
    this.expandPost = media;
    this.modal = this.modalService.create({
      nzTitle: tplTitle,
      nzFooter: tplFooter,
      nzContent: PostComponent,
      nzComponentParams: {
        expandPost: media,
      },
      nzClosable: false,
      nzWrapClassName: 'vertical-center-modal'
    });
  }

  handleCancel() {
    this.modal.destroy();
  }

  handleError(tpl?) {
    this.loading = false;
    this.loaded = true;
    this.reset();

    this.modalService.error({
      nzTitle: 'Oops!',
      nzContent: tpl || this.tplError
    })
  }

  focusUsernameSearch() {
    this.usernameEl.nativeElement.focus();
    this.usernameEl.nativeElement.scrollIntoView({ behavior: "smooth", block: 'end' });
  }

  reset() {
    this.stats = undefined;
    this.mostLikedMedia = [];
    this.mostCommentedMedia = [];
    this.summary = [
      { key: 'Posts', value: '0' },
      { key: 'Followers', value: '0' },
      { key: 'Following', value: '0' }
    ];

    this.engagements = [
      { key: 'Total likes', value: '0' },
      { key: 'Total comments', value: '0' },
      { key: 'Average likes', value: '0' },
      { key: 'Average comments', value: '0' }
    ];

    if (this.modal) this.modal.destroy();
  }

  ngOnDestroy() {
    this.loading = false;
    this.loaded = false;
    this.reset();
  }
}
