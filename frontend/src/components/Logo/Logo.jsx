import styles from './logo.module.css';
import logoImage from 'src/assets/images/logo.svg';

export default function Logo() {
  return (
    <div className="logo">
      <img src={logoImage} alt="Logo Airo" className={styles.logo__image} />
      <span className={styles.logo__text}>by Grid Dynamics</span>
    </div>
  );
}
