import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Image } from '../../models/image.model'; // Import Image interface from the model file
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Component to display a single favorited image in full-screen with navigation controls
@Component({
  selector: 'app-image-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss']
})
export class ImageDetailsComponent implements OnInit, OnDestroy {
  // Currently displayed image, null if not found
  image: Image | null = null;
  // List of all favorited images
  favorites: Image[] = [];
  // Index of the current image in the favorites list
  currentIndex: number = -1;
  // Subscription to route params for cleanup
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  // Initialize the component by subscribing to route params and favorites
  ngOnInit(): void {
    // Subscribe to route params to handle navigation between images
    this.routeSub = this.route.params.subscribe(params => {
      const stableId = params['id'];
      // Fetch the favorites list and find the current image
      this.favoritesService.getFavorites().subscribe(favs => {
        this.favorites = favs;
        if (stableId) {
          // Find the index of the image with the given stableId
          this.currentIndex = this.favorites.findIndex(fav => fav.stableId === stableId);
          // Set the current image, or redirect if not found
          this.image = this.currentIndex !== -1 ? this.favorites[this.currentIndex] : null;
          if (!this.image) {
            this.router.navigate(['/favorites']);
          }
        } else {
          // Redirect to favorites if no stableId is provided
          this.router.navigate(['/favorites']);
        }
      });
    });
  }

  // Clean up subscriptions on component destruction
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  // Remove the current image from favorites and redirect to the favorites page
  removeFromFavorites(): void {
    if (this.image) {
      this.favoritesService.removeFavorite(this.image.stableId);
      this.router.navigate(['/favorites']);
    }
  }
}