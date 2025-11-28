interface GeoLocation {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

export interface PropertyListing {
    id: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    approvalStatus: string;
    title: string;
    description: string;
    listingType: string;
    price: number;
    priceUnit: string;
    area: number;
    propertyType: string;
    legalStatus: string | null;
    numBedrooms: number | null;
    numBathrooms: number | null;
    numFloors: number | null;
    facadeWidthM: number | null;
    roadWidthM: number | null;
    houseDirection: string | null;
    balconyDirection: string | null;
    furnitureStatus: string | null;
    projectName: string | null;
    buildingBlock: string | null;
    floorNumber: number | null;
    addressStreet: string | null;
    addressWard: string | null;
    addressDistrict: string | null;
    addressCity: string | null;
    location: GeoLocation;
    features: string[];
    imageUrls: string[];
    tagNames: string[];
}
