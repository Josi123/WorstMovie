import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import {
  MovieYear,
  Studio,
  ProducerInterval,
  ProducerIntervals,
  MoviesPaginated,
  Movie,
} from '../interfaces/movie.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  public dashboard!: string;
  public listYearsMultipleWinners: MovieYear[] | null = null;
  public listStudios: Studio[] | null = null;
  public listIntervalAwards: ProducerIntervals = { min: [], max: [] };
  private subscriptions: Subscription[] = [];
  public searchYear: number | null = null;
  public listMoviesWinnerYear: Movie[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.dashboard = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.getListMovies();
    this.getStudios();
    this.getIntervalAwards();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private handleErrors(error: any) {
    console.error('Erro ao recuperar dados', error);
  }

  public getListMovies() {
    const urlApi = `projection=years-with-multiple-winners`;
    const subscription = this.apiService.getData(urlApi).subscribe({
      next: (response: any) => {
        this.listYearsMultipleWinners = response.years;
      },
      error: this.handleErrors.bind(this),
    });
    this.subscriptions.push(subscription);
  }

  public getStudios() {
    const urlApi = `projection=studios-with-win-count`;
    const subscription = this.apiService.getData(urlApi).subscribe({
      next: (response: any) => {
        this.listStudios = response.studios;
      },
      error: this.handleErrors.bind(this),
    });
    this.subscriptions.push(subscription);
  }

  public getIntervalAwards() {
    const urlApi = `projection=max-min-win-interval-for-producers`;
    const subscription = this.apiService.getData(urlApi).subscribe({
      next: (response: any) => {
        this.listIntervalAwards = response;
      },
      error: this.handleErrors.bind(this),
    });
    this.subscriptions.push(subscription);
  }

  public getListMoviesWinnerYear(year: number) {
    const urlApi = `winner=true&year=${year}`;
    this.apiService.getData(urlApi).subscribe({
      next: (response: Movie[]) => {
        this.listMoviesWinnerYear = response;
      },
      error: this.handleErrors.bind(this),
    });
  }

  public onSearch() {
    if (this.searchYear !== null) {
      this.getListMoviesWinnerYear(this.searchYear);
    }
  }
}
