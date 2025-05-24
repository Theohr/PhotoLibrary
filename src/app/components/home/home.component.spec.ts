import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { type Image } from '../../models/image.model';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let favoritesService: FavoritesService;
  let photoService: PhotoService;
  let router: Router;

  const mockImages: Image[] = Array.from({ length: 100 }, (_, i) => ({
    id: `1-${i}`,
    stableId: i.toString(),
    url: `https://picsum.photos/id/${i}/200/300`
  }));

  beforeEach(async () => {
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['addFavorite', 'removeFavorite', 'isFavorited']);
    favoritesServiceSpy.isFavorited.and.returnValue(false);

    const photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getImages']);
    photoServiceSpy.getImages.and.returnValue(of(mockImages));

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, HomeComponent],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        { provide: PhotoService, useValue: photoServiceSpy },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService);
    photoService = TestBed.inject(PhotoService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // Test: should create
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test: should load initial 100 images
  it('should load initial 100 images', fakeAsync(() => {
    tick(300); // Wait for the async loadImages call in the constructor
    fixture.detectChanges();

    expect(component.images.length).toBe(100);
    expect(component.images[0].url).toBe('https://picsum.photos/id/0/200/300');
    expect(component.images[0].stableId).toBe('0');
    expect(photoService.getImages).toHaveBeenCalledWith(1);
  }));

  it('should show favorite icon when image is favorited', fakeAsync(() => {
    tick(300);
    fixture.detectChanges();

    (favoritesService.isFavorited as jasmine.Spy).and.returnValue(true);
    fixture.detectChanges();
    const favoriteIcon = fixture.debugElement.query(By.css('.favorite-icon'));
    expect(favoriteIcon).not.toBeNull();
  }));

  it('should not show favorite icon when image is not favorited', fakeAsync(() => {
    tick(300);
    fixture.detectChanges();

    (favoritesService.isFavorited as jasmine.Spy).and.returnValue(false);
    fixture.detectChanges();
    const favoriteIcon = fixture.debugElement.query(By.css('.favorite-icon'));
    expect(favoriteIcon).toBeNull();
  }));

  it('should show back to top button when scrolled down', fakeAsync(() => {
    tick(300);
    fixture.detectChanges();

    spyOnProperty(window, 'scrollY', 'get').and.returnValue(500);
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const backToTopButton = fixture.debugElement.query(By.css('.back-to-top'));
    expect(backToTopButton).not.toBeNull();
  }));

  it('should hide back to top button when at the top', fakeAsync(() => {
    tick(300);
    fixture.detectChanges();

    spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const backToTopButton = fixture.debugElement.query(By.css('.back-to-top'));
    expect(backToTopButton).toBeNull();
  }));

  it('should load more images when scrolled to bottom', fakeAsync(() => {
    tick(300);
    fixture.detectChanges();

    spyOnProperty(window, 'scrollY', 'get').and.returnValue(1000);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(500);
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500, configurable: true });
    component.loading = false;

    window.dispatchEvent(new Event('scroll'));
    tick(300);
    fixture.detectChanges();

    expect(photoService.getImages).toHaveBeenCalledWith(2);
  }));
});