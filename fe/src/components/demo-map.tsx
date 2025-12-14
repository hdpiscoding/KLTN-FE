import { useState, useMemo, useRef } from 'react';
import ReactMapGL, {Marker, Popup, NavigationControl, type MapRef} from '@goongmaps/goong-map-react';
import Supercluster from 'supercluster';

interface PropertyPopupCardProps {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    area: number;
    onClose: () => void;
}

interface MockProperty {
    id: string;
    location: { latitude: number; longitude: number; address: string };
    title: string;
    image: string;
    price: number;
    area: number;
}

interface MultipleMarkerMapProps {
    properties: MockProperty[];
    defaultZoom?: number;
    height?: string;
    width?: string;
    mapStyle?: string;
    showNavigation?: boolean;
    centerLat?: number;
    centerLng?: number;
    minZoomToShow?: number; // Zoom tối thiểu để hiển thị markers
}

// Mock PropertyPopupCard component
const PropertyPopupCard = ({ title, image, address, price, area, onClose }: PropertyPopupCardProps) => (
    <div className="bg-white rounded-lg shadow-lg p-3 w-64">
        <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl leading-none"
        >
            ×
        </button>
        <img src={image} alt={title} className="w-full h-32 object-cover rounded mb-2" />
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-600 mb-2">{address}</p>
        <div className="flex justify-between text-xs">
            <span className="font-bold text-blue-600">{price.toLocaleString('vi-VN')} đ</span>
            <span className="text-gray-600">{area} m²</span>
        </div>
    </div>
);

const MultipleMarkerMap = ({
                               properties,
                               defaultZoom = 13,
                               height = '100%',
                               width = '100%',
                               mapStyle = 'https://tiles.goong.io/assets/goong_map_web.json',
                               showNavigation = true,
                               centerLat,
                               centerLng,
                               minZoomToShow = 10, // Default: hiển thị khi zoom >= 10
                           }: MultipleMarkerMapProps) => {
    // Calculate center from properties if not provided
    const calculateCenter = () => {
        if (centerLat !== undefined && centerLng !== undefined) {
            return { latitude: centerLat, longitude: centerLng };
        }

        if (!properties || properties.length === 0) {
            return { latitude: 10.8231, longitude: 106.6297 };
        }

        const sumLat = properties.reduce((sum, p) => sum + p.location.latitude, 0);
        const sumLng = properties.reduce((sum, p) => sum + p.location.longitude, 0);

        return {
            latitude: sumLat / properties.length,
            longitude: sumLng / properties.length,
        };
    };

    const GOONG_API_KEY = import.meta.env.VITE_MAPTILES_KEY;
    const center = calculateCenter();

    const mapRef = useRef<MapRef>(null);

    const [viewport, setViewport] = useState({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0,
    });

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);

    // Initialize Supercluster
    const supercluster = useMemo(() => {
        if (!properties || properties.length === 0) return null;

        const cluster = new Supercluster({
            radius: 30,
            maxZoom: 16,
            minZoom: 0,
            minPoints: 2,
        });

        // Convert properties to GeoJSON features
        const points = properties.map(property => ({
            type: 'Feature' as const,
            properties: {
                cluster: false,
                propertyId: property.id,
                property: property,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [property.location.longitude, property.location.latitude],
            },
        }));

        cluster.load(points);
        return cluster;
    }, [properties]);

    // Get clusters based on current viewport
    const clusters = useMemo(() => {
        if (!supercluster || !bounds || !properties) return [];

        // Ẩn tất cả markers khi zoom quá xa
        if (viewport.zoom < minZoomToShow) {
            console.log(`Zoom ${viewport.zoom} < ${minZoomToShow} - Hiding all markers`);
            return [];
        }

        const clustersData = supercluster.getClusters(bounds, Math.floor(viewport.zoom));

        // Debug log
        console.log('Zoom:', viewport.zoom.toFixed(2), 'Clusters:', clustersData.length, 'Total properties:', properties.length);

        return clustersData;
    }, [supercluster, bounds, viewport.zoom, properties, minZoomToShow]);

    const handleMarkerClick = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
    };

    const handleClusterClick = (clusterId: number, longitude: number, latitude: number) => {
        if (!supercluster) return;

        const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(clusterId),
            20
        );

        setViewport({
            ...viewport,
            longitude,
            latitude,
            zoom: expansionZoom,
        });
    };

    const handleClosePopup = () => {
        setSelectedPropertyId(null);
    };

    // Update bounds when viewport changes
    const handleViewportChange = (newViewport: any) => {
        setViewport(newViewport);

        // Calculate bounds from viewport
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            const mapBounds = map.getBounds();

            setBounds([
                mapBounds.getWest(),
                mapBounds.getSouth(),
                mapBounds.getEast(),
                mapBounds.getNorth(),
            ]);
        }
    };

    const selectedProperty = properties?.find(p => p.id === selectedPropertyId);
    const [isDragging] = useState(false);
    const [isHovering] = useState(false);
    const cursor = isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';

    return (
        <div className="relative" style={{ width, height }}>
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="100%"
                mapStyle={mapStyle}
                onViewportChange={handleViewportChange}
                onResize={() => {}}
                touchAction="pan-y"
                getCursor={() => cursor}
                goongApiAccessToken={GOONG_API_KEY}
                onLoad={() => {
                    // Initialize bounds on load
                    if (mapRef.current) {
                        const map = mapRef.current.getMap();
                        const mapBounds = map.getBounds();

                        setBounds([
                            mapBounds.getWest(),
                            mapBounds.getSouth(),
                            mapBounds.getEast(),
                            mapBounds.getNorth(),
                        ]);
                    }
                }}
            >
                {/* Navigation Controls */}
                {showNavigation && (
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <NavigationControl />
                    </div>
                )}

                {/* Render Clusters and Markers */}
                {clusters.map((cluster) => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                    if (isCluster) {
                        // Render Cluster Marker
                        const size = 30 + (pointCount / (properties?.length || 1)) * 40;

                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                latitude={latitude}
                                longitude={longitude}
                                offsetLeft={-size / 2}
                                offsetTop={-size / 2}
                            >
                                <div
                                    onClick={() => handleClusterClick(cluster.id as number, longitude, latitude)}
                                    className="cursor-pointer flex items-center justify-center relative"
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                    }}
                                >
                                    {/* Outer ring */}
                                    <div
                                        className="absolute rounded-full bg-blue-400 opacity-20"
                                        style={{
                                            width: `${size + 20}px`,
                                            height: `${size + 20}px`,
                                        }}
                                    />

                                    {/* Cluster circle */}
                                    <div
                                        className="absolute rounded-full bg-blue-500 border-4 border-white shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                        }}
                                    >
                                        <span className="text-white font-bold text-sm">
                                            {pointCount}
                                        </span>
                                    </div>
                                </div>
                            </Marker>
                        );
                    }

                    // Render Individual Property Marker
                    const property = cluster.properties.property;
                    const isSelected = selectedPropertyId === property.id;

                    return (
                        <Marker
                            key={`property-${property.id}`}
                            latitude={latitude}
                            longitude={longitude}
                            offsetLeft={-12}
                            offsetTop={-12}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkerClick(property.id);
                                }}
                                className="cursor-pointer"
                            >
                                {/* Outer ring - pulse effect when selected */}
                                <div
                                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-[#008DDA] opacity-30 animate-ping'
                                            : 'bg-transparent'
                                    }`}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        transform: 'translate(-50%, -50%)',
                                        top: '12px',
                                        left: '12px',
                                    }}
                                />

                                {/* Dot Marker */}
                                <div
                                    className={`relative rounded-full border-2 transition-all duration-200 shadow-lg hover:scale-125 ${
                                        isSelected
                                            ? 'bg-[#008DDA] border-white scale-125 shadow-xl'
                                            : 'bg-red-500 border-white hover:bg-red-600'
                                    }`}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                    }}
                                >
                                    {/* Inner white dot */}
                                    <div
                                        className="absolute bg-white rounded-full"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    />
                                </div>
                            </div>
                        </Marker>
                    );
                })}

                {/* Popup for Selected Property */}
                {selectedProperty && (
                    <Popup
                        latitude={selectedProperty.location.latitude}
                        longitude={selectedProperty.location.longitude}
                        onClose={handleClosePopup}
                        closeButton={false}
                        closeOnClick={false}
                        offsetTop={-15}
                        offsetLeft={0}
                        anchor="bottom"
                        dynamicPosition={true}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <PropertyPopupCard
                                id={selectedProperty.id}
                                title={selectedProperty.title}
                                image={selectedProperty.image}
                                address={selectedProperty.location.address}
                                price={selectedProperty.price}
                                area={selectedProperty.area}
                                onClose={handleClosePopup}
                            />
                        </div>
                    </Popup>
                )}
            </ReactMapGL>
        </div>
    );
};

export default MultipleMarkerMap;