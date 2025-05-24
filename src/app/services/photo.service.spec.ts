import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PhotoService } from './photo.service';
import { of } from 'rxjs';
import { type Image } from '../models/image.model';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch specified number of valid images, skipping invalid ones', fakeAsync(() => {
    spyOn(service as any, 'validateImage').and.callFake((url: string) => {
      const stableId = url.match(/id\/(\d+)/)?.[1];
      const invalidIds = ['100', '200', '300', '400', '500'];
      return Promise.resolve(!stableId || !invalidIds.includes(stableId));
    });

    let resultImages: Image[] = [];
    service.getImages(1, 2).subscribe(images => {
      resultImages = images;
    });

    tick(300);

    expect(resultImages.length).toBe(2);
    expect(resultImages[0].id).toBe('1-0');
    expect(resultImages[1].id).toBe('1-1');
    expect(Number(resultImages[0].stableId)).toBeGreaterThanOrEqual(0);
    expect(Number(resultImages[0].stableId)).toBeLessThan(1000);
    expect(Number(resultImages[1].stableId)).toBeGreaterThanOrEqual(0);
    expect(Number(resultImages[1].stableId)).toBeLessThan(1000);
    expect(resultImages[0].url).toBe(`https://picsum.photos/id/${resultImages[0].stableId}/200/300`);
    expect(resultImages[1].url).toBe(`https://picsum.photos/id/${resultImages[1].stableId}/200/300`);
    resultImages.forEach(image => {
      expect(['100', '200', '300', '400', '500']).not.toContain(image.stableId);
    });
  }));

  it('should handle zero limit', fakeAsync(() => {
    spyOn(service as any, 'validateImage').and.returnValue(Promise.resolve(true));

    let resultImages: Image[] = [];
    service.getImages(1, 0).subscribe(images => {
      resultImages = images;
    });

    tick(300);

    expect(resultImages.length).toBe(0);
  }));

  it('should return fewer images if max attempts are reached', fakeAsync(() => {
    spyOn(service as any, 'validateImage').and.returnValue(Promise.resolve(false));
    spyOn(console, 'warn');

    let resultImages: Image[] = [];
    service.getImages(1, 100).subscribe(images => {
      resultImages = images;
    });

    tick(300);

    expect(resultImages.length).toBe(0);
    expect(console.warn).toHaveBeenCalledWith(
      jasmine.stringMatching(/Only found 0 valid images out of 100 requested after \d+ attempts/)
    );
  }));
});