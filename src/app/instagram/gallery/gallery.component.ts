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

  constructor() { }

  ngOnInit() {
  }

}
