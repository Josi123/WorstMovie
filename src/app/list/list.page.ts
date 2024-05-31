import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MoviesPaginated } from '../interfaces/movie.models';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

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

  constructor(private apiService: ApiService) {}

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

  public getListMovies() {
    this.urlApi = `page=${this.page}&size=${this.size}`;
    if (
      this.searchYear.value &&
      this.selectWinner &&
      (this.selectWinner === 'yes' || this.selectWinner === 'no')
    ) {
      this.urlApi += `&year=${this.searchYear.value}&winner=${this.selectWinner}`;
    } else {
      if (this.searchYear.value) {
        this.urlApi += `&year=${this.searchYear.value}`;
      }

      if (
        this.selectWinner &&
        (this.selectWinner === 'yes' || this.selectWinner === 'no')
      ) {
        this.urlApi += `&winner=${this.selectWinner}`;
      }
    }

    this.subscriptions = this.apiService.getData(this.urlApi).subscribe({
      next: (response: MoviesPaginated) => {
        this.listMovies = response;
        console.log(this.listMovies);
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
