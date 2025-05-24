import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ImageDetailsComponent } from './components/image-details/image-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route that redirects to Home Page
  { path: 'home', component: HomeComponent },// Route to home page
  { path: 'favorites', component: FavoritesComponent }, // Route to the favorites page
  { path: 'photos/:id', component: ImageDetailsComponent }, // Route to view a specific image
  { path: '**', redirectTo: '/home' } // Fallback route for unmatched paths
];