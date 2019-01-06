import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CitiesService } from 'src/app/shared/services/cities.service';
import { LookupFn, SearchService } from 'ng2-semantic-ui';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BadgeGroupComponent } from 'src/app/shared/components/badge-group/badge-group.component';

interface IOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-job-filters',
  templateUrl: './job-filters.component.html',
  styleUrls: ['./job-filters.component.less']
})
export class JobFiltersComponent implements OnInit, OnDestroy {
  tagsField: FormControl;
  titleField: FormControl;

  filters = {
    title: null,
    tags: null,
    city: null
  };

  subscriptions: Subscription[] = [];

  @ViewChild(BadgeGroupComponent)
  tagGroupComponent: BadgeGroupComponent;

  constructor(
    private router: Router,
    private citiesService: CitiesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tagsField = new FormControl();
    this.titleField = new FormControl();

    this.subscriptions.push(
      this.route.queryParamMap.subscribe(queryParamMap => {
        this.filters.title = queryParamMap.get('title') || null;
        const queryTags = queryParamMap.get('tags');
        this.filters.tags = queryTags ? queryTags.split(',') : null;
        this.filters.city = queryParamMap.get('city') || null;

        this.tagsField.setValue(queryTags);
        this.titleField.setValue(this.filters.title);
      })
    );

    this.subscriptions.push(
      this.titleField.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(titleTerm => {
          this.filters.title = titleTerm;
          this.search();
        })
    );

    this.subscriptions.push(
      this.tagsField.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(() => {
          const tags = this.tagGroupComponent.tagList.join(',');
          this.filters.tags = tags != '' ? tags : null;
          this.search();
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  search() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: { ...this.filters },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });

    this.router.navigateByUrl(urlTree);
  }

  optionsLookupCity: LookupFn<IOption, number> = (query: string, initial?) => {
    return this.citiesService.getByTerm(query).then(results => {
      const res = results.map(city => ({ label: city, value: city }));
      return res;
    });
  };

  clearFilters() {
    this.filters.city = null;
    this.filters.tags = null;
    this.filters.title = null;
    this.tagsField.setValue(null);
    this.search();
  }
}
