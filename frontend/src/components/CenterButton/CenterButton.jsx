import { useMap } from 'react-leaflet';
import Icon from 'src/components/Icon/Icon';
import styles from './centerButton.module.css';
import Button from 'src/components/Button/Button';

export default function CenterButton({ latitude, longitude }) {
  const map = useMap();

  function handleCenterMap() {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 14);
    }
  }

  return (
    <Button onClick={handleCenterMap} className={styles.centerButton}>
      <Icon id="centerIcon" height="24" width="24" />
    </Button>
  );
}
