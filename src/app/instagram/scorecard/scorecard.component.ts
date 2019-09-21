import { Component, OnInit, Input } from '@angular/core';
import { isTemplateRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss']
})
export class ScorecardComponent implements OnInit {

  @Input() item;
  constructor() { }

  ngOnInit() {
  }

}
