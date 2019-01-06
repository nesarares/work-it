import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Jsonp } from '@angular/http';
import { Observable, from } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import { CitiesService } from 'src/app/shared/services/cities.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  searchField: FormControl;
  results$: Observable<any>;
  gotResults: boolean = false;

  constructor(private jsonp: Jsonp, private citiesService: CitiesService) {}

  ngOnInit() {
    this.searchField = new FormControl();
    // this.results$ = from(this.search('int'));
    this.results$ = this.searchField.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.search(term)),
      tap(result => {
        this.gotResults = result.length != 0;
      })
    );
  }

  search(term: string) {
    return this.citiesService.getByTerm(term);
  }
}
