import {Camera} from '@/enums';

export interface IManifest {
  name: string;
  landing_date: string;
  launch_date: string;
  max_date: string;
  max_sol: number;
  status: string;
  total_photos: number;
}

export interface ICameraData {
  id: Camera;
  name: string;
  fullName: string;
}

export interface IImageData {
  id: number;
  img_src: string;
  camera: Camera | string;
  cameraName: string;
}
