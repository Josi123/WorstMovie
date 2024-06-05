import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MovieYear,
  Studio,
  ProducerIntervals,
  Movie,
} from '../../interfaces/movie.models';
import { Subject, takeUntil } from 'rxjs';
import { LoadDataService } from 'src/app/services/load-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  public dashboard!: string;
  public listYearsMultipleWinners: MovieYear[] | null = null;
  public listStudios: Studio[] | null = null;
  public studiosMoreWins: Studio[] = [];
  public listIntervalAwards: ProducerIntervals = { min: [], max: [] };
  public searchYear: number | null = null;
  public listMoviesWinnerYear: Movie[] = [];
  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadData: LoadDataService
  ) {}

  public ngOnInit() {
    this.dashboard = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.getListYearsMultipleWinners();
    this.getStudiosWithWinCount();
    this.getMaxMinWinIntervalForProducers();
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  private handleErrors(error: any) {
    console.error('Erro ao recuperar dados', error);
  } 

  private getListYearsMultipleWinners(): void {
   this.loadData.getDataByUrl('years-with-multiple-winners')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
        this.listYearsMultipleWinners = response.years;
      });
  }

  private getStudiosWithWinCount(): void {
   this.loadData.getStudiosWithWinCount()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
        this.listStudios = response.studios;
        this.getStudiosMoreWins();
      });
  }

  private getStudiosMoreWins(): void {
    if (this.listStudios !== null) {
      this.studiosMoreWins = this.listStudios
        .sort((a, b) => b.winCount - a.winCount)
        .slice(0, 3);
    }
  }

  private getMaxMinWinIntervalForProducers(): void {
   this.loadData.getMaxMinWinIntervalForProducers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
        this.listIntervalAwards = response;
      });
  }

  private getListMoviesWinnerYear(year: number): void {
   this.loadData.getListMoviesWinnerYear(year)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
        this.listMoviesWinnerYear = response;
      });
  }

  public onSearch() {
    if (this.searchYear !== null) {
      this.getListMoviesWinnerYear(this.searchYear);
    }
  }
}
