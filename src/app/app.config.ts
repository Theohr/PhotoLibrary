import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ImageDetailsComponent } from './components/image-details/image-details.component';
import { FavoritesService } from './services/favorites.service';
import { PhotoService } from './services/photo.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'photos/:id', component: ImageDetailsComponent },
  { path: '**', redirectTo: '/home' } 
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    FavoritesService,
    PhotoService
  ]
};