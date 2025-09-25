import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';
import { useMap } from 'react-leaflet';

import { MAP_STYLE_URL } from 'src/constants/const';

export default function MapTiler() {
  const map = useMap();

  useEffect(() => {
    const layer = new MaptilerLayer({
      apiKey: import.meta.env.VITE_MAPTILER_API_KEY,
      style: MAP_STYLE_URL,
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
}
