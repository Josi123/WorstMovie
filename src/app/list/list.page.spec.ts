import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { ListPage } from './list.page';
import { ApiService } from '../services/api.service';
import { MoviesPaginated } from '../interfaces/movie.models';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getData']);

    await TestBed.configureTestingModule({
      declarations: [ListPage],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch list of movies when getListMovies is called', () => {
    const dummyMoviesData: MoviesPaginated = {
      content: [
        {
          id: 1,
          year: 1980,
          title: "Can't Stop the Music",
          studios: ['Associated Film Distribution'],
          producers: ['Allan Carr'],
          winner: true,
        },
        {
          id: 2,
          year: 1980,
          title: 'Cruising',
          studios: ['Lorimar Productions', 'United Artists'],
          producers: ['Jerry Weintraub'],
          winner: false,
        },
        {
          id: 3,
          year: 1980,
          title: 'The Formula',
          studios: ['MGM', 'United Artists'],
          producers: ['Steve Shagan'],
          winner: false,
        },
        {
          id: 4,
          year: 1980,
          title: 'Friday the 13th',
          studios: ['Paramount Pictures'],
          producers: ['Sean S. Cunningham'],
          winner: false,
        },
        {
          id: 5,
          year: 1980,
          title: 'The Nude Bomb',
          studios: ['Universal Studios'],
          producers: ['Jennings Lang'],
          winner: false,
        },
      ],
      pageable: {
        sort: { unsorted: true, sorted: false, empty: true },
        offset: 0,
        pageSize: 15,
        pageNumber: 0,
        paged: true,
        unpaged: false,
      },
      totalPages: 1,
      totalElements: 5,
      last: true,
      size: 15,
      number: 0,
      sort: { unsorted: true, sorted: false, empty: true },
      first: true,
      numberOfElements: 5,
      empty: false,
    };
    apiService.getData.and.returnValue(of(dummyMoviesData));

    component.searchYear.setValue(1980);
    component.selectWinner = 'yes';

    const expectedUrl = `page=${component.page}&size=${component.size}&year=${component.searchYear.value}&winner=${component.selectWinner}`;

    component.getListMovies();
    expect(apiService.getData).toHaveBeenCalledWith(expectedUrl);
    expect(component.listMovies).toEqual(dummyMoviesData);
  });

  it('should update filter and call getListMovies', () => {

    const mockEvent = {
      target: {
        value: 'yes'
      }
    } as unknown as Event;

    const dummyMoviesData = {
      content: [],
      pageable: {},
      totalPages: 1,
      totalElements: 0,
      last: false,
      size: 0,
      number: 0,
      sort: {},
      first: false,
      numberOfElements: 0,
      empty: true
    };
    apiService.getData.and.returnValue(of(dummyMoviesData));

    component.filterByWinner(mockEvent);
    expect(component.selectWinner).toBe('yes');
    expect(component.page).toBe(0);
    expect(apiService.getData).toHaveBeenCalled();
  });
  

});
