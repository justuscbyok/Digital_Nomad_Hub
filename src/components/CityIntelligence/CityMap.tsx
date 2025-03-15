import React, { useCallback, useState, useEffect, useRef } from 'react';
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { City } from '../../types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CityMapProps {
  cities: City[];
}

const DEFAULT_VIEW_STATE: ViewState = {
  latitude: 13.7563,
  longitude: 100.5018,
  zoom: 2,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 }
};

export default function CityMap({ cities }: CityMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      setError('Mapbox token is missing');
      return;
    }

    if (cities.length > 0) {
      try {
        const lats = cities.map(city => city.coordinates.lat);
        const lngs = cities.map(city => city.coordinates.lng);
        
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        
        const latDiff = Math.max(...lats) - Math.min(...lats);
        const lngDiff = Math.max(...lngs) - Math.min(...lngs);
        const maxDiff = Math.max(latDiff, lngDiff);
        const zoom = Math.min(10, Math.max(1, 6 - Math.log2(maxDiff || 1)));

        setViewState(prev => ({
          ...prev,
          latitude: centerLat,
          longitude: centerLng,
          zoom
        }));

        if (mapRef.current && mapLoaded) {
          mapRef.current.flyTo({
            center: [centerLng, centerLat],
            zoom,
            duration: 2000
          });
        }
      } catch (err) {
        setError('Error updating map view');
        console.error('Map view update error:', err);
      }
    }
  }, [cities, mapLoaded]);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
    setError(null);
  }, []);

  const onMapError = useCallback((err: any) => {
    setError('Error loading map');
    console.error('Map error:', err);
  }, []);

  if (error) {
    return (
      <div className="h-[400px] rounded-lg overflow-hidden bg-red-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={onMapLoad}
        onError={onMapError}
        minZoom={1}
        maxZoom={20}
        attributionControl={true}
        renderWorldCopies={true}
        reuseMaps
      >
        {mapLoaded && cities.map((city) => (
          <Marker
            key={city.id}
            longitude={city.coordinates.lng}
            latitude={city.coordinates.lat}
            anchor="bottom"
          >
            <div className="relative group">
              <MapPin className="text-blue-500 w-8 h-8 cursor-pointer hover:text-blue-600 transition-colors" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <p className="font-medium">{city.name}</p>
                <p className="text-sm text-gray-500">{city.country}</p>
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}