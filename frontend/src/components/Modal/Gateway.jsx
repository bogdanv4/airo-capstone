import styles from './modal.module.css';

export default function Gateway() {
  return (
    <form className={styles.modal__form}>
      <div
        className={`${styles.modal__column} ${styles['modal__column--full']}`}
      >
        <div className={styles.modal__field}>
          <label htmlFor="name">Gateway's name</label>
          <input
            className={styles.modal__input}
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div className={styles.modal__field}>
          <label htmlFor="key">Key</label>
          <textarea
            className={styles.modal__input}
            name="key"
            id="key"
            placeholder="Type key"
          ></textarea>
        </div>
      </div>
    </form>
  );
}
