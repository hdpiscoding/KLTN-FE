import type { Location } from './location.d.ts';

/**
 * Property marker data for map display
 */
export interface PropertyMarker {
    id: string;
    location: Location;
    title: string;
    image: string;
    price: number;
    area: number;
}

