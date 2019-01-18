import { Component, OnInit, Input } from '@angular/core';
import { cssConstants } from '../../constants/css-constants';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.less']
})
export class StatsCardComponent implements OnInit {
  @Input() top: string;
  @Input() bottom: string;
  @Input() color: string = cssConstants.primaryColor;
  @Input() icon: string;

  constructor() {}

  ngOnInit() {}
}
