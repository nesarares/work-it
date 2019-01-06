import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city';

const cities: City[] = require('../utils/orase.json');

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  constructor() {}

  getByTerm(term: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!term) resolve([]);
      term = term.toLowerCase().trim();
      if (term.length < 2) resolve([]);
      const results = cities
        .filter(city =>
          city.simplu
            ? city.simplu.toLowerCase().startsWith(term)
            : city.nume.toLowerCase().startsWith(term)
        )
        .map(city => {
          return city.comuna ? `${city.nume} (${city.comuna})` : city.nume;
        })
        .slice(0, 7);
      resolve(results);
    });
  }
}
