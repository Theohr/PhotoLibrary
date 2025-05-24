import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ImageDetailsComponent } from './image-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { type Image } from '../../models/image.model';

describe('ImageDetailsComponent', () => {
  let component: ImageDetailsComponent;
  let fixture: ComponentFixture<ImageDetailsComponent>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let router: jasmine.SpyObj<Router>;
  let paramsSubject: Subject<{ id: string }>;

  const mockFavorites: Image[] = [
    { id: '1-0', stableId: '0', url: 'https://picsum.photos/id/0/200/300' },
    { id: '1-1', stableId: '1', url: 'https://picsum.photos/id/1/200/300' },
    { id: '1-2', stableId: '2', url: 'https://picsum.photos/id/2/200/300' }
  ];

  beforeEach(async () => {
    paramsSubject = new Subject<{ id: string }>();

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, MatIconModule, ImageDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: paramsSubject.asObservable() } },
        {
          provide: FavoritesService,
          useValue: jasmine.createSpyObj('FavoritesService', ['getFavorites', 'removeFavorite'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDetailsComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    favoritesService.getFavorites.and.returnValue(of(mockFavorites));
  });

  it('should display the image if found', fakeAsync(() => {
    fixture.detectChanges();
    paramsSubject.next({ id: '0' });
    tick();
    fixture.detectChanges();

    expect(component.image?.stableId).toBe('0');

    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('https://picsum.photos/id/0/200/300');
  }));

});
