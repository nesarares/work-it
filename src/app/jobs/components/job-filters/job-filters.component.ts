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
  employerField: FormControl;

  filters = {
    title: null,
    tags: null,
    city: null,
    employer: null
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
    this.employerField = new FormControl();

    // Gets the search criteria from the url
    this.subscriptions.push(
      this.route.queryParamMap.subscribe(queryParamMap => {
        this.filters.title = queryParamMap.get('title') || null;
        this.filters.employer = queryParamMap.get('employer') || null;
        const queryTags = queryParamMap.get('tags');
        this.filters.tags = queryTags ? queryTags.split(',') : null;
        this.filters.city = queryParamMap.get('city') || null;

        this.tagsField.setValue(queryTags);
        this.titleField.setValue(this.filters.title);
        this.employerField.setValue(this.filters.employer);
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
      this.employerField.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(employerTerm => {
          this.filters.employer = employerTerm;
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

  /**
   * Unsubscribe each object at destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Searches for jobs, based on the filters which are populated in ngOnInit.
   * The search arguments are received by url
   */
  search() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: { ...this.filters },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });

    this.router.navigateByUrl(urlTree);
  }

  /**
   * Handles search by a given city action
   */
  optionsLookupCity: LookupFn<IOption, number> = (query: string, initial?) => {
    return this.citiesService.getByTerm(query).then(results => {
      const res = results.map(city => ({ label: city, value: city }));
      return res;
    });
  };

  /**
   * Clears all filters
   */
  clearFilters() {
    this.filters.city = null;
    this.filters.tags = null;
    this.filters.title = null;
    this.filters.employer = null;
    this.tagsField.setValue(null);
    this.search();
  }
}
