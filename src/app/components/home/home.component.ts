import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Image } from '../../models/image.model'; // Import Image interface from the model file
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';
import { CommonModule } from '@angular/common';

// Component to display an infinite scrolling grid of images
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // List of images to display
  images: Image[] = [];
  // Flag to indicate if images are currently loading
  loading = false;
  // Current page number for pagination
  page = 1;
  // Flag to show the "Back to Top" button
  showBackToTop = false;
  // Flag to indicate if there was an error loading images
  errorLoadingImages = false;

  constructor(
    private favoritesService: FavoritesService,
    private photoService: PhotoService
  ) {
    this.loadImages(); // Load initial set of images
  }

  // Loads images for the current page
  loadImages(): void {
    if (this.loading) return; // Prevent multiple simultaneous loads
    this.loading = true;
    this.errorLoadingImages = false; // Reset error state
    this.photoService.getImages(this.page).subscribe({
      next: (newImages) => {
        this.images = [...this.images, ...newImages]; // Append new images
        this.loading = false;
        this.page++; // Increment page for next load
      },
      error: (err) => {
        console.error('Error loading images:', err); // Log the error for debugging
        this.loading = false;
        this.errorLoadingImages = true; // Set error state
      }
    });
  }

  // Listens for scroll events to implement infinite scrolling and show/hide the "Back to Top" button
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Show "Back to Top" button after scrolling down 400px
    this.showBackToTop = window.scrollY > 400;

    // Load more images when scrolled near the bottom
    if (scrollPosition >= documentHeight - 100 && !this.loading) {
      this.loadImages();
    }
  }

  // Toggles an image as a favorite (adds or removes it), does not navigate
  toggleFavorite(image: Image): void {
    if (this.isFavorited(image)) {
      this.favoritesService.removeFavorite(image.stableId);
    } else {
      this.favoritesService.addFavorite(image);
    }
  }

  // Checks if an image is in the favorites list (based on stableId)
  isFavorited(image: Image): boolean {
    return this.favoritesService.isFavorited(image.stableId);
  }

  // Scrolls the page back to the top smoothly
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}