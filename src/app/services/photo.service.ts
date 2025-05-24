import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { type Image } from '../models/image.model'; // Import Image interface from the model file

// Service to fetch image data with validation for the photo gallery
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  // Fetches a specified number of valid images for a given page with a random delay
  getImages(page: number, limit: number = 20): Observable<Image[]> {
    const startIndex = (page - 1) * limit;

    // Async function to fetch and validate images
    const fetchImages = async (): Promise<Image[]> => {
      const images: Image[] = [];
      let i = 0;
      const maxAttempts = limit * 5; // Maximum attempts to avoid infinite loops
      let attempts = 0;

      // Keep generating images until we have 'limit' number of valid images or hit max attempts
      while (images.length < limit && attempts < maxAttempts) {
        // Generate a random stableId for the image (between 0 and 999)
        const stableId = Math.floor(Math.random() * 1000);
        const stableIdStr = stableId.toString();
        const url = `https://picsum.photos/id/${stableId}/200/300`;

        // Validate the image by attempting to load it
        const isValid = await this.validateImage(url);
        attempts++;

        if (!isValid) {
          i++; // Increment the index to maintain unique session-based IDs
          continue;
        }

        // Create the image object
        const image: Image = {
          id: `${page}-${i}`, // Session-based ID for navigation
          stableId: stableIdStr, // Random stable ID for the Picsum image
          url // Use the validated URL
        };

        images.push(image);
        i++;
      }

      // If we couldn't find enough valid images, log a warning
      if (images.length < limit) {
        console.warn(`Only found ${images.length} valid images out of ${limit} requested after ${maxAttempts} attempts`);
      }

      return images;
    };

    // Convert the async result to an Observable with a random delay
    return new Observable<Image[]>(observer => {
      fetchImages().then(images => {
        const randomDelay = Math.floor(Math.random() * 100) + 200;
        of(images).pipe(delay(randomDelay)).subscribe({
          next: (result) => {
            observer.next(result);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
      }).catch(err => observer.error(err));
    });
  }

  // Validates an image by attempting to load it
  private validateImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Image failed to load
      img.src = url;
    });
  }
}