import { Component, OnInit } from '@angular/core';
import { numeric } from 'src/app/shared/constants/numerics';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.less']
})
export class ContactComponent implements OnInit {
  latitude: Number = numeric.latitude;
  longitude: Number = numeric.longitude;

  constructor() {}

  ngOnInit() {}
}
