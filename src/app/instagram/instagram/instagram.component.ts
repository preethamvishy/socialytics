import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { InstagramService } from '../instagram.service'

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {

  basicUserData;
  advancedUserData;
  media: any[] = [];
  username = 'manutdfotos';
  loaded=false;

  public averageChartLabels:string[] = ['Average Likes', 'Average Comments', 'Average Engagements'];
  public averageChartData:number[] = [];
  public averageChartType:string = 'doughnut';
  
  
  constructor(private http: HttpClient,
    private instagramService: InstagramService) {

  }

  ngOnInit() {
    this.instagramService.getUserByUsername(this.username)
    .subscribe((res) => {
      this.basicUserData = res;
      this.instagramService.getUserById(this.basicUserData.user.id)
      .subscribe((res) => {
        this.advancedUserData = res
        var stats = this.instagramService.getStats(this.advancedUserData.data.user.edge_owner_to_timeline_media.edges, this.basicUserData.user, this.username, 5)
        this.averageChartData.push(stats.averageLikes)
        this.averageChartData.push(stats.averageComments)
        this.averageChartData.push(stats.averageEngagements)
        this.loaded = true;
      })
    })
  }

}
