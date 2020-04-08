import {Camera, Rover} from '@/enums';
import {ICameraData} from '@/interfaces';

export const NASA_API_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

export const emptyManifest = {
  name: '',
  landing_date: '',
  launch_date: '',
  max_date: '',
  max_sol: 0,
  status: '',
  total_photos: 0
};

export const curiosityCameras = [
  {id: Camera.FHAZ, name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera'},
  {id: Camera.RHAZ, name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera'},
  {id: Camera.MAST, name: 'MAST', fullName: 'Mast Camera'},
  {id: Camera.MAHLI, name: 'MAHLI', fullName: 'Mars Hand Lens Imager'},
  {id: Camera.MARDI, name: 'MARDI', fullName: 'Mars Descent Imager'},
  {id: Camera.NAVCAM, name: 'NAVCAM', fullName: 'Navigation Camera'},
  {id: Camera.CHEMCAM, name: 'CHEMCAM', fullName: 'Chemistry and Camera Complex'}];

export const opportunityCameras = [
  {id: Camera.FHAZ, name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera'},
  {id: Camera.RHAZ, name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera'},
  {id: Camera.NAVCAM, name: 'NAVCAM', fullName: 'Navigation Camera'},
  {id: Camera.PANCAM, name: 'PANCAM', fullName: 'Panoramic Camera'},
  {id: Camera.PANCAM, name: 'MINITES', fullName: 'Miniature Thermal Emission Spectrometer (Mini-TES)'}];

export const spiritCameras = [
  {id: Camera.FHAZ, name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera'},
  {id: Camera.RHAZ, name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera'},
  {id: Camera.NAVCAM, name: 'NAVCAM', fullName: 'Navigation Camera'},
  {id: Camera.PANCAM, name: 'PANCAM', fullName: 'Panoramic Camera'},
  {id: Camera.PANCAM, name: 'MINITES', fullName: 'Miniature Thermal Emission Spectrometer (Mini-TES)'}];

export function getCamerasForRover(rover: Rover): ICameraData[] {
  switch (rover) {
    case Rover.Curiosity:
      return curiosityCameras;
    case Rover.Opportunity:
      return opportunityCameras;
    case Rover.Spirit:
      return spiritCameras;
    default:
      return [];
  }
}
