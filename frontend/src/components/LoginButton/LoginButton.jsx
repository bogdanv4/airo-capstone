import Button from 'src/components/Button/Button';
import styles from './LoginButton.module.css';

export default function LoginButton({ children, onClick }) {
  return (
    <Button onClick={onClick} className={styles.button_logIn}>
      {children}
    </Button>
  );
}
