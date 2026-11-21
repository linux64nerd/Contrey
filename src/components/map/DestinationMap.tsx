import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PlaceRecommendation, PlaceCategory } from '../../types/map';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { isValidCoordinate } from '../../services/geocodingService';

// Helper component to programmatically pan, zoom, and invalidate map size
const MapController: React.FC<{
  center: [number, number];
  selectedPlace: PlaceRecommendation | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>;
}> = ({ center, selectedPlace, markerRefs }) => {
  const map = useMap();

  // Fix grey tiles and container rendering glitches
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  // Handle center pan and selection fly-to
  useEffect(() => {
    if (selectedPlace && isValidCoordinate(selectedPlace.lat, selectedPlace.lng)) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 16, { animate: true, duration: 1.0 });

      // Automatically open the marker's popup
      const marker = markerRefs.current[selectedPlace.id];
      if (marker) {
        marker.openPopup();
      }
    } else if (isValidCoordinate(center[0], center[1])) {
      map.flyTo(center, 14, { animate: true, duration: 1.0 });
    }
  }, [center, selectedPlace, map, markerRefs]);

  return null;
};

// Create custom colored DivIcon with exact anchor points
function createCustomPin(category: PlaceCategory | 'center', isSelected: boolean = false) {
  let color = '#4d49fc'; // Figma Electric Indigo
  let label = '📍';

  if (category === 'center') {
    color = '#4d49fc';
    label = '✈️';
  } else if (category === 'hotel') {
    color = '#4d49fc';
    label = '🏨';
  } else if (category === 'restaurant') {
    color = '#24cb71'; // Figma Green
    label = '🍽️';
  } else if (category === 'shopping') {
    color = '#ff7237'; // Figma Orange
    label = '🛍️';
  } else if (category === 'attraction') {
    color = '#b98e01'; // Figma Mustard
    label = '🏖️';
  }

  const size = isSelected ? 36 : 28;

  return L.divIcon({
    className: 'custom-leaflet-marker-pin',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        transition: all 0.2s ease;
      ">
        <span style="transform: rotate(45deg); font-size: ${isSelected ? 15 : 12}px; line-height: 1;">
          ${label}
        </span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

interface DestinationMapProps {
  center: [number, number];
  destinationName?: string;
  radiusKm: number;
  places: PlaceRecommendation[];
  selectedPlace: PlaceRecommendation | null;
  onSelectPlace: (place: PlaceRecommendation) => void;
}

export const DestinationMap: React.FC<DestinationMapProps> = ({
  center,
  destinationName = 'Destination Anchor',
  radiusKm,
  places,
  selectedPlace,
  onSelectPlace,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const { isDark } = useTheme();
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const safeCenter: [number, number] =
    center && isValidCoordinate(center[0], center[1])
      ? center
      : [15.2993, 74.1240];

  const radiusMeters = Math.max(100, Math.min(50000, (radiusKm || 2) * 1000));

  // OpenStreetMap 100% free tile layer (zero API key required, zero watermark)
  const cartoApiKey = ((import.meta as any).env?.VITE_CARTO_API_KEY as string | undefined)?.trim();
  const isUsingOsm = !cartoApiKey;

  const tileUrl = cartoApiKey
    ? (isDark
        ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`
        : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`)
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = cartoApiKey
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={safeCenter}
        zoom={14}
        scrollWheelZoom={true}
        className={`w-full h-full z-10 ${isUsingOsm ? 'osm-tile-layer' : ''}`}
        style={{ minHeight: '100%', width: '100%' }}
      >
        <MapController center={safeCenter} selectedPlace={selectedPlace} markerRefs={markerRefs} />

        {/* Dynamic Basemap Tiles */}
        <TileLayer
          key={isDark ? 'dark-tiles' : 'light-tiles'}
          attribution={tileAttribution}
          url={tileUrl}
          maxZoom={19}
        />

        {/* Destination Center Anchor Marker */}
        <Marker position={safeCenter} icon={createCustomPin('center', false)}>
          <Popup>
            <div className="p-3 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">
                Destination Anchor
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{destinationName}</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Search Radius: {radiusKm} km</p>
            </div>
          </Popup>
        </Marker>

        {/* Search Radius Circle Overlay */}
        <Circle
          center={safeCenter}
          radius={radiusMeters}
          pathOptions={{
            color: '#4d49fc',
            fillColor: '#4d49fc',
            fillOpacity: isDark ? 0.12 : 0.08,
            weight: 2,
            dashArray: '5, 5',
          }}
        />

        {/* Curated Place Pins */}
        {places.map((place) => {
          if (!isValidCoordinate(place.lat, place.lng)) return null;

          const isSelected = selectedPlace?.id === place.id;
          const convertedPrice = convertAmount(place.estimatedPrice, 'EUR', currentCurrency);

          return (
            <Marker
              key={place.id}
              ref={(ref) => {
                markerRefs.current[place.id] = ref;
              }}
              position={[place.lat, place.lng]}
              icon={createCustomPin(place.category, isSelected)}
              eventHandlers={{
                click: () => onSelectPlace(place),
              }}
            >
              <Popup>
                <div className="p-3 text-xs space-y-1.5 min-w-[190px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                      {place.category}
                    </span>
                    {place.isBestValue && (
                      <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{place.name}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                    {place.reviewSnippet}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 font-medium">
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      ★ {place.rating.toFixed(1)}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ~{format(convertedPrice)}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
