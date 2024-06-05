import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoviesPaginated, MovieYear, Studio } from '../interfaces/movie.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://tools.texoit.com/backend-java/api/movies?';

  constructor(private http: HttpClient) {}

  public getData(url: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${url}`);
  }
}
