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

  constructor(private http: HttpClient,
    private instagramService: InstagramService) {

  }

  ngOnInit() {
    this.instagramService.getUserByUsername('manutdfotos')
      .subscribe((res) => console.log(res))

  }

}
