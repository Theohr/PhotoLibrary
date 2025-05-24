import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Image } from '../../models/image.model'; // Import Image interface from the model file
import { FavoritesService } from '../../services/favorites.service';

// Component to display a grid of favorited images
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  // List of favorited images
  favorites: Image[] = [];
  // Flag to indicate if there was an error loading favorites
  errorLoadingFavorites = false;

  constructor(
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  // Initialize the component by loading the favorites list
  ngOnInit(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (favs) => {
        this.favorites = favs || [];
        this.errorLoadingFavorites = false;
        this.cdr.detectChanges(); // Trigger change detection to update the view
      },
      error: (err) => {
        console.error('Error loading favorites:', err); // Log the error for debugging
        this.favorites = [];
        this.errorLoadingFavorites = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Validates the favorites list to ensure all images have valid URLs
  hasValidFavorites(): boolean {
    return this.favorites && this.favorites.length > 0 && this.favorites.every(fav => fav && fav.url && typeof fav.url === 'string' && fav.url.startsWith('https://'));
  }

    // Encodes the image stableId for use in routerLink to handle special characters
  getEncodedId(stableId: string): string {
    return encodeURIComponent(stableId);
  }
}