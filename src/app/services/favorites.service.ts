import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from '../models/image.model'; // Import Image interface from the model file

// Service to manage favorited images, persisting them to localStorage
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // In-memory list of favorited images
  private favorites: Image[] = [];
  // BehaviorSubject to emit updates to the favorites list
  private favoritesSubject = new BehaviorSubject<Image[]>([]);

  // Constructor initializes the service by loading favorites from localStorage
  constructor() {
    this.loadFavorites();
  }

  // Returns an observable of the current favorites list
  getFavorites(): Observable<Image[]> {
    return this.favoritesSubject.asObservable();
  }

  // Adds an image to the favorites list if it's not already present (based on stableId)
  addFavorite(image: Image): void {
    if (!this.favorites.some(fav => fav.stableId === image.stableId)) {
      this.favorites.push(image);
      this.saveFavorites(); // Persist to localStorage
      this.favoritesSubject.next([...this.favorites]); // Emit updated list
    }
  }

  // Removes an image from the favorites list by its stableId
  removeFavorite(stableId: string): void {
    this.favorites = this.favorites.filter(fav => fav.stableId !== stableId);
    this.saveFavorites(); // Persist to localStorage
    this.favoritesSubject.next([...this.favorites]); // Emit updated list
  }

  // Checks if an image is in the favorites list (based on stableId)
  isFavorited(stableId: string): boolean {
    return this.favorites.some(fav => fav.stableId === stableId);
  }

  // Loads favorites from localStorage with validation
  private loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate that the stored data is an array of valid Image objects
        if (Array.isArray(parsed) && parsed.every(item => item && typeof item === 'object' && 'id' in item && 'stableId' in item && 'url' in item && item.id && item.stableId && item.url && typeof item.url === 'string' && item.url.startsWith('https://'))) {
          this.favorites = parsed;
        } else {
          this.favorites = [];
          localStorage.removeItem('favorites'); // Clear invalid data
        }
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        this.favorites = [];
        localStorage.removeItem('favorites'); // Clear invalid data
      }
    } else {
      this.favorites = [];
    }
    this.favoritesSubject.next([...this.favorites]); // Emit initial list
  }

  // Saves the current favorites list to localStorage
  private saveFavorites(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}