import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import type { SalePoint } from '../../types'

const LOGO_URL = 'https://wealthquest.sirv.com/3D%20Logo%20%E5%8F%98%E4%BD%932%201%20(1).webp'

function pointsToGeoJSON(points: SalePoint[]) {
  return {
    type: 'FeatureCollection' as const,
    features: points.map(p => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] },
      properties: { amount: p.amount },
    })),
  };
}

interface GlobeProps {
  points: SalePoint[];
}

export default function Globe({ points }: GlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const sourceReadyRef = useRef(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? '';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      projection: 'globe',
      zoom: 1.0,
      center: [20, 30],
      pitch: 0,
      interactive: true,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.scrollZoom.disable();
    map.getCanvas().style.background = 'transparent';

    map.on('style.load', () => {
      map.setFog({
        color: 'rgba(0,0,0,0)',
        'high-color': 'rgba(0,0,0,0)',
        'horizon-blend': 0.01,
        'space-color': 'rgba(0,0,0,0)',
        'star-intensity': 0,
      });

      map.addSource('sales-heat', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'sales-heatmap',
        type: 'heatmap',
        source: 'sales-heat',
        maxzoom: 9,
        paint: {
          'heatmap-weight': [
            'interpolate', ['linear'], ['get', 'amount'],
            0, 0, 500, 0.3, 2000, 0.7, 5000, 1,
          ],
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            0, 0.6, 5, 2,
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.1, 'rgba(80,50,5,0.4)',
            0.25, 'rgba(140,85,10,0.55)',
            0.4, 'rgba(200,130,20,0.65)',
            0.55, 'rgba(235,170,30,0.75)',
            0.7, 'rgba(245,197,66,0.85)',
            0.85, 'rgba(255,220,120,0.92)',
            1, 'rgba(255,255,230,0.97)',
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            0, 8, 2, 20, 5, 40,
          ],
          'heatmap-opacity': 0.8,
        },
      });

      sourceReadyRef.current = true;

      if (points.length > 0) {
        map.getSource('sales-heat')?.setData(pointsToGeoJSON(points) as GeoJSON.FeatureCollection);
      }

      // Auto-rotate
      let rotating = true;
      function rotateGlobe() {
        if (!rotating) return;
        const center = map.getCenter();
        center.lng += 0.12;
        map.easeTo({ center, duration: 100, easing: (t: number) => t });
        requestAnimationFrame(rotateGlobe);
      }
      rotateGlobe();

      map.on('mousedown', () => { rotating = false; });
      map.on('touchstart', () => { rotating = false; });
      map.on('dragend', () => {
        setTimeout(() => { rotating = true; rotateGlobe(); }, 3000);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      sourceReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !sourceReadyRef.current) return;
    const source = mapRef.current.getSource('sales-heat');
    if (source && 'setData' in source) {
      source.setData(pointsToGeoJSON(points) as GeoJSON.FeatureCollection);
    }
  }, [points]);

  return (
    <div className="globe-wrapper" style={{ position: 'relative' }}>
      <div className="globe-bg-logo">
        <img src={LOGO_URL} alt="Wealth Quest" className="globe-bg-img" />
      </div>

      <div className="globe-container">
        <div ref={mapContainer} id="map" />
      </div>
    </div>
  );
}
