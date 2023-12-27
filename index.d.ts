// Elevation API
interface Point {
  latitude: number
  longitude: number
}

interface ResultPoint extends Point {
  elevation: number
}

declare interface Window {
  delete_modal: any;
  save_modal: any;
  upload_modal: any;
  error_modal: any;
}

declare module 'togpx';
