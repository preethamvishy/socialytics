import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() title;
  @Input() galleryMedia;
  @Input() sampleSize;
  @Input() term;

  @Output() toggleModal = new EventEmitter();
  @Output() externalUrl = new EventEmitter();

  iconClass;

  constructor() { 
  }

  ngOnInit() {
    this.iconClass = this.term === 'likes' ? 'fas fa-heart' : 'fas fa-comment';
  }

  getCount(media) {
    return this.term === 'likes' ? media.node.edge_media_preview_like.count : media.node.edge_media_to_comment.count
  }
}
