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

// Create custom colored DivIcon for each category matching Notion tones
function createCustomPin(category: PlaceCategory | 'center', isSelected: boolean = false) {
  let color = '#0075de'; // Notion Blue
  let label = '📍';

  if (category === 'center') {
    color = '#0075de';
    label = '✈️';
  } else if (category === 'hotel') {
    color = '#0075de';
    label = '🏨';
  } else if (category === 'restaurant') {
    color = '#ffb110'; // Marigold
    label = '🍽️';
  } else if (category === 'shopping') {
    color = '#f64932'; // Coral
    label = '🛍️';
  } else if (category === 'attraction') {
    color = '#62aef0'; // Sky Wash
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
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
  const radiusMeters = radiusKm * 1000;

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] rounded-[10px] overflow-hidden border border-[rgba(0,0,0,0.08)]">
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

        {/* Dynamic Radius Circle in Notion Blue tint */}
        <Circle
          center={center}
          radius={radiusMeters}
          pathOptions={{
            color: '#0075de',
            fillColor: '#e6f3fe',
            fillOpacity: 0.35,
            weight: 1.5,
            dashArray: '5, 5',
          }}
        />

        {/* Center / Destination Marker */}
        <Marker position={center} icon={createCustomPin('center')}>
          <Popup>
            <div className="text-xs p-1">
              <span className="font-bold text-[#000000] block">{destinationName}</span>
              <span className="text-[11px] text-[#0075de]">
                Center Anchor ({radiusKm} km radius)
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
                <div className="text-xs p-1 max-w-[210px] space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[#000000] truncate">{place.name}</span>
                    {place.isBestValue && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#ffb110] text-[#000000] text-[9px] font-bold">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#757575]">
                    <span>★ {place.rating}</span>
                    <span>{place.distanceKm} km away</span>
                  </div>
                  <p className="font-bold text-sm text-[#0075de]">
                    Est. {format(convertedPrice)}
                  </p>
                  <p className="text-[10px] text-[#615d59] italic line-clamp-2">
                    "{place.reviewSnippet}"
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend Indicator */}
      <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-[6px] bg-[#ffffff]/95 backdrop-blur-xs border border-[rgba(0,0,0,0.12)] shadow-xs text-[11px] font-medium text-[#000000] flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0075de]" /> Hotels
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb110]" /> Dining
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f64932]" /> Shopping
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#62aef0]" /> Attractions
        </span>
      </div>
    </div>
  );
};
