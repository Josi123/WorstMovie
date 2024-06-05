import { Component, OnInit } from '@angular/core';
import { MoviesPaginated } from '../../interfaces/movie.models';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { LoadDataService } from 'src/app/services/load-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  private subscriptions: Subscription | undefined;
  public listMovies: MoviesPaginated | null = null;
  public searchYear: FormControl = new FormControl();
  public selectWinner: string = '';
  private urlApi = '';
  public page = 0;
  public size = 15;

  constructor(private loadData: LoadDataService) {}

  ngOnInit() {
    this.getListMovies();
    this.searchYear.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.filterMoviesYears());
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  getListMovies(): void {
    this.subscriptions = this.loadData
      .getListMovies(
        this.page,
        this.size,
        this.searchYear.value,
        this.selectWinner
      )
      .subscribe({
        next: (response: MoviesPaginated) => {
          this.listMovies = response;
        },
        error: this.handleErrors.bind(this),
      });
  }

  public filterByWinner(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectWinner = selectElement.value;
    this.page = 0;
    this.getListMovies();
  }

  public paginationMovies(page: number) {
    if (this.listMovies && page >= 0 && page < this.listMovies.totalPages) {
      this.page = page;
      this.getListMovies();
    }
  }

  public getTotalPages(): number[] {
    return Array.from(
      { length: this.listMovies?.totalPages ?? 0 },
      (_, i) => i + 1
    );
  }

  public onSearchChange(event: any) {
    this.searchYear.setValue(event.target.value.trim());
  }

  public filterMoviesYears() {
    this.page = 0;
    this.getListMovies();
  }

  private handleErrors(error: any) {
    console.error('Erro ao recuperar dados', error);
  }
}
