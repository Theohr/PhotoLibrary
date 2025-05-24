export interface Image {
  id: string; // Session-based identifier for the image (eg '1-0')
  stableId: string; // Stable identifier used for the Picsum image URL (eg '0')
  url: string; // URL of the image (eg 'https://picsum.photos/id/0/200/300')
}