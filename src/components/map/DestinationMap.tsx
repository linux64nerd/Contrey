import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PlaceRecommendation, PlaceCategory } from '../../types/map';
import { useCurrency } from '../../context/CurrencyContext';

// Helper component to programmatically pan/zoom map
const MapController: React.FC<{ center: [number, number]; selectedPlace: PlaceRecommendation | null }> = ({
  center,
  selectedPlace,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 16, { animate: true, duration: 1.2 });
    } else {
      map.flyTo(center, 14, { animate: true, duration: 1.2 });
    }
  }, [center, selectedPlace, map]);

  return null;
};

// Create custom colored DivIcon for each category
function createCustomPin(category: PlaceCategory | 'center', isSelected: boolean = false) {
  let color = '#10b981'; // emerald
  let label = '📍';

  if (category === 'center') {
    color = '#059669';
    label = '✈️';
  } else if (category === 'hotel') {
    color = '#6366f1';
    label = '🏨';
  } else if (category === 'restaurant') {
    color = '#f59e0b';
    label = '🍽️';
  } else if (category === 'shopping') {
    color = '#f43f5e';
    label = '🛍️';
  } else if (category === 'attraction') {
    color = '#0284c7';
    label = '🏖️';
  }

  const size = isSelected ? 38 : 30;

  return L.divIcon({
    className: 'custom-leaflet-pin',
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid white;
        transition: transform 0.2s ease;
      ">
        <span style="transform: rotate(45deg); font-size: ${isSelected ? 16 : 13}px;">
          ${label}
        </span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

interface DestinationMapProps {
  center: [number, number];
  destinationName: string;
  radiusKm: number;
  places: PlaceRecommendation[];
  selectedPlace: PlaceRecommendation | null;
  onSelectPlace: (place: PlaceRecommendation) => void;
}

export const DestinationMap: React.FC<DestinationMapProps> = ({
  center,
  destinationName,
  radiusKm,
  places,
  selectedPlace,
  onSelectPlace,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const radiusMeters = radiusKm * 1000;

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <MapController center={center} selectedPlace={selectedPlace} />

        {/* OpenStreetMap standard free tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Radius Circle */}
        <Circle
          center={center}
          radius={radiusMeters}
          pathOptions={{
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '6, 6',
          }}
        />

        {/* Center / Destination Marker */}
        <Marker position={center} icon={createCustomPin('center')}>
          <Popup>
            <div className="text-xs p-1">
              <span className="font-extrabold text-slate-900 block">{destinationName}</span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Trip Center Anchor ({radiusKm} km radius filter)
              </span>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Recommendation Pins */}
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const convertedPrice = convertAmount(place.estimatedPrice, 'EUR', currentCurrency);

          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createCustomPin(place.category, isSelected)}
              eventHandlers={{
                click: () => onSelectPlace(place),
              }}
            >
              <Popup>
                <div className="text-xs p-1 max-w-[200px] space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-slate-900 truncate">{place.name}</span>
                    {place.isBestValue && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-amber-600 font-bold">★ {place.rating}</span>
                    <span>{place.distanceKm} km away</span>
                  </div>
                  <p className="font-bold text-emerald-700 text-xs">
                    Est. {format(convertedPrice)}
                  </p>
                  <p className="text-[10px] text-slate-500 italic line-clamp-2">
                    "{place.reviewSnippet}"
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend Indicator */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-3 py-2 rounded-2xl border border-slate-200/80 shadow-lg text-[10px] font-semibold text-slate-700 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Hotels
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Dining
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Shopping
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Attractions
        </span>
      </div>
    </div>
  );
};
