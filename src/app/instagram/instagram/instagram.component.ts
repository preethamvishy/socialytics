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

  public doughnutChartLabels:string[] = ['Average Likes', 'Average Comments', 'Average Engagements'];
  public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';
  
  loaded=false;
  constructor(private http: HttpClient,
    private instagramService: InstagramService) {

  }

  ngOnInit() {
    this.instagramService.getUserByUsername('manutdfotos')
    .subscribe((res) => {
      this.basicUserData = res;
      this.instagramService.getUserById(this.basicUserData.user.id)
      .subscribe((res) => {
        this.advancedUserData = res
        var stats = this.instagramService.getStats(this.advancedUserData.data.user.edge_owner_to_timeline_media.edges, this.basicUserData.user, 'manutdfotos', 5)
        this.doughnutChartData.push(stats.averageLikes)
        this.doughnutChartData.push(stats.averageComments)
        this.doughnutChartData.push(stats.averageEngagements)
        this.loaded = true;
      })
    })
  }

}
