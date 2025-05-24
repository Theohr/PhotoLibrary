import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { type Image } from '../../models/image.model';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;

  const mockFavorites: Image[] = [
    { id: '1-0', stableId: '0', url: 'https://picsum.photos/id/0/200/300' },
    { id: '1-1', stableId: '1', url: 'https://picsum.photos/id/1/200/300' }
  ];

  beforeEach(async () => {
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getFavorites']);
    favoritesServiceSpy.getFavorites.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), FavoritesComponent],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;
    localStorage.clear();
  });

  it('should create the component', fakeAsync(() => {
    favoritesService.getFavorites.and.returnValue(of([]));
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(component.favorites).toEqual([]);
    expect(component.errorLoadingFavorites).toBeFalse();
  }));

  it('hasValidFavorites should return false for invalid favorites', () => {
    component.favorites = [
      { id: '1-0', stableId: '0', url: '' },
      { id: '1-1', stableId: '1', url: undefined } as any
    ];
    expect(component.hasValidFavorites()).toBeFalse();
  });

  it('hasValidFavorites should return true for valid favorites', () => {
    component.favorites = [mockFavorites[0]];
    expect(component.hasValidFavorites()).toBeTrue();
  });

  it('getEncodedId should encode special characters correctly', () => {
    expect(component.getEncodedId('hello world')).toBe('hello%20world');
    expect(component.getEncodedId('id/with/slash')).toBe('id%2Fwith%2Fslash');
    expect(component.getEncodedId('simple')).toBe('simple');
  });
});
