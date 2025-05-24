import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PhotoService } from './services/photo.service';
import { FavoritesService } from './services/favorites.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let photoService: PhotoService;
  let favoritesService: FavoritesService;

  // Mock data
  const mockImages = Array.from({ length: 100 }, (_, i) => ({
    id: `1-${i}`,
    stableId: i.toString(),
    url: `https://picsum.photos/id/${i}/200/300`
  }));

  const mockFavorites = [
    { id: '1-0', stableId: '0', url: 'https://picsum.photos/id/0/200/300' }
  ];

  beforeEach(async () => {
    // Create spies for the services
    const photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getImages']);
    photoServiceSpy.getImages.and.returnValue(of(mockImages));

    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'addFavorite', 'removeFavorite', 'isFavorited']);
    favoritesServiceSpy.getFavorites.and.returnValue(of(mockFavorites));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent
      ],
      providers: [
        { provide: PhotoService, useValue: photoServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotoService);
    favoritesService = TestBed.inject(FavoritesService);

    // Initial change detection
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize PhotoService and FavoritesService', () => {
    expect(photoService.getImages).toBeDefined();
    expect(favoritesService.getFavorites).toBeDefined();
  });
});