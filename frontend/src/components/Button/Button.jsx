import styles from './button.module.css';
import Icon from 'src/components/Icon/Icon';

export default function Button({ children, icon, onClick, className, type }) {
  return (
    <button
      className={`${styles.button} ${styles.button__purple} ${className}`}
      onClick={onClick}
      type={type}
    >
      {icon && <Icon {...icon} />}
      {children}
    </button>
  );
}
