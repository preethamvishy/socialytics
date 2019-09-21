import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() expandPost;
  constructor() { }

  ngOnInit() {
  }

  externalUrl() {
    window.open('http://www.instagram.com/p/' + this.expandPost.node.shortcode)
  }


}
