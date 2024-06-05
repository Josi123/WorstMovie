import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DashboardPage } from './dashboard.page';
import { ApiService } from '../../services/api.service';
import { MovieYear, Studio, ProducerIntervals, Movie } from '../../interfaces/movie.models';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getData']);
    const activatedRouteSpy = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'test-id' // ou um valor apropriado de teste
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch list of movies with multiple winners on initialization', () => {
    const dummyYearsData: { years: MovieYear[] } = { years: [{ year: 2020, winnerCount: 2 }] };
    apiService.getData.and.returnValue(of(dummyYearsData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.listYearsMultipleWinners).toEqual(dummyYearsData.years);
  });

  it('should fetch list of studios on initialization', () => {
    const dummyStudiosData: { studios: Studio[] } = { studios: [{ name: 'Studio A', winCount: 3 }] };
    apiService.getData.and.returnValue(of(dummyStudiosData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.listStudios).toEqual(dummyStudiosData.studios);
  });

  it('should fetch list of interval awards on initialization', () => {
    const dummyIntervalsData: ProducerIntervals = { min: [], max: [] };
    apiService.getData.and.returnValue(of(dummyIntervalsData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.listIntervalAwards).toEqual(dummyIntervalsData);
  });

  it('should fetch list of movies winner by year when onSearch is called', () => {
    const dummyMoviesData: Movie[] = [{ id: 1, year: 2020, title: 'Movie A', studios: ['Studio A'], producers: ['Producer A'], winner: true }];
    apiService.getData.and.returnValue(of(dummyMoviesData));

    component.searchYear = 2020;
    component.onSearch();
    fixture.detectChanges();

    expect(component.listMoviesWinnerYear).toEqual(dummyMoviesData);
  });
});