"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  initialCoordinates: { latitude: number; longitude: number };
  accessToken: string;
  onCoordinatesChange: (coordinates: { latitude: number; longitude: number }) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ initialCoordinates, accessToken, onCoordinatesChange }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [coordinates, setCoordinates] = useState(initialCoordinates);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialCoordinates.longitude, initialCoordinates.latitude],
      zoom: 12
    });

    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([initialCoordinates.longitude, initialCoordinates.latitude])
      .addTo(map.current);

    map.current.on('load', () => {
      map.current?.resize();
    });

    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        const newCoordinates = { latitude: lngLat.lat, longitude: lngLat.lng };
        setCoordinates(newCoordinates);
        onCoordinatesChange(newCoordinates);
      }
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    // Update marker position when initialCoordinates change
    if (map.current && marker.current) {
      map.current.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        essential: true,
      });
      marker.current.setLngLat([coordinates.longitude, coordinates.latitude]);
    }
  }, [coordinates.latitude, coordinates.longitude]);


  return (
    <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
  );
};

export default MapboxMap;