import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { type Image } from '../models/image.model'; 


describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and retrieve favorites, persisting to localStorage', fakeAsync(() => {
    const image: Image = { id: '1-0', stableId: '1', url: 'https://picsum.photos/id/1/200/300' };
    service.addFavorite(image);

    let favorites: Image[] = [];
    service.getFavorites().subscribe(favs => {
      favorites = favs;
    });

    tick(); 

    expect(favorites.length).toBe(1);
    expect(favorites[0]).toEqual(image);
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(stored).toEqual([image]);
  }));

  it('should remove a favorite and update localStorage', fakeAsync(() => {
    const image: Image = { id: '1-0', stableId: '1', url: 'https://picsum.photos/id/1/200/300' };
    service.addFavorite(image);
    service.removeFavorite('1');

    let favorites: Image[] = [];
    service.getFavorites().subscribe(favs => {
      favorites = favs;
    });

    tick();

    expect(favorites.length).toBe(0);
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(stored.length).toBe(0);
  }));

  it('should check if an image is favorited', fakeAsync(() => {
    const image: Image = { id: '1-0', stableId: '1', url: 'https://picsum.photos/id/1/200/300' };
    expect(service.isFavorited('1')).toBeFalse();
    service.addFavorite(image);
    expect(service.isFavorited('1')).toBeTrue();
    service.removeFavorite('1'); 

    let favorites: Image[] = [];
    service.getFavorites().subscribe(favs => {
      favorites = favs;
    });

    tick();

    expect(service.isFavorited('1')).toBeFalse();
  }));

});