import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-badge-group',
  templateUrl: './badge-group.component.html',
  styleUrls: ['./badge-group.component.less']
})
export class BadgeGroupComponent implements OnInit, OnChanges {
  @Input()
  private tags: string = '';
  private tagLst: string[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (!this.tags) return;
    this.tagLst = this.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '');
  }

  public get tagList(): string[] {
    return this.tagLst;
  }
}
