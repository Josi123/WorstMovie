import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MoviesPaginated } from '../interfaces/movie.models';

@Injectable({
  providedIn: 'root',
})
export class LoadDataService {
  constructor(private apiService: ApiService) {}

  public getStudiosWithWinCount(): Observable<any> {
    const url = 'studios-with-win-count';
    return this.getDataByUrl(url);
  }

  public getMaxMinWinIntervalForProducers(): Observable<any> {
    const url = 'max-min-win-interval-for-producers';
    return this.getDataByUrl(url);
  }

  public getListMoviesWinnerYear(year: number): Observable<any> {
    const urlApi = `winner=true&year=${year}`;
    return this.apiService.getData(urlApi);
  }

  public getDataByUrl(projection: string): Observable<any> {
    const urlApi = `projection=${projection}`;
    return this.apiService.getData(urlApi);
  }

  public getListMovies(
    page: number,
    size: number,
    searchYear: number,
    selectWinner: string
  ): Observable<MoviesPaginated> {
    let urlApi = `page=${page}&size=${size}`;

    if (
      searchYear &&
      selectWinner &&
      (selectWinner === 'yes' || selectWinner === 'no')
    ) {
      urlApi += `&year=${searchYear}&winner=${selectWinner}`;
    } else {
      if (searchYear) {
        urlApi += `&year=${searchYear}`;
      }

      if (selectWinner && (selectWinner === 'yes' || selectWinner === 'no')) {
        urlApi += `&winner=${selectWinner}`;
      }
    }

    return this.apiService.getData(urlApi);
  }
}
