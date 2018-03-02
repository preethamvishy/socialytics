import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { InstagramService } from '../instagram.service'

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {

  basicUserData;
  advancedUserData;
  media: any[] = [];
  username = 'manutdfotos';
  loaded=false;
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
  constructor(private http: HttpClient,
    private instagramService: InstagramService) {

  }

  ngOnInit() {
    this.http.get('./assets/mockStats.json')
    .subscribe(res => {
      console.log(res)
      this.stats = res;
      this.populateStats();
    })
    // this.instagramService.getUserByUsername(this.username)
    // .subscribe((basicUserData) => {
    //   this.basicUserData = basicUserData;
    //   console.log(basicUserData)
    //   this.instagramService.getUserById(this.basicUserData.user.id)
    //   .subscribe((advancedUserData) => {
    //     this.advancedUserData = advancedUserData
    //     console.log(advancedUserData)
    //     this.stats = this.instagramService.getStats(this.advancedUserData.data.user.edge_owner_to_timeline_media.edges, this.basicUserData.user, this.username, 6)
    //     this.populateStats()
    //     console.log(this.stats)
    //     console.log(this.stats.website)
    //   })
    // })
    
  }

  populateStats()
  {
    this.summary[0].value = this.stats.posts;
    this.summary[1].value = this.stats.followers;
    this.summary[2].value = this.stats.following;
    
    this.engagements[0].value = this.stats.totalLikes;
    this.engagements[1].value = this.stats.totalComments;
    this.engagements[2].value = this.stats.averageLikes;
    this.engagements[3].value = this.stats.averageComments;
  
    this.mostLikedMedia = this.stats.mostLikedMedia;
    this.mostCommentedMedia = this.stats.mostCommentedMedia;
    this.loaded = true;
  }

}
