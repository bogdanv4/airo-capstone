import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './onboarding.module.css';
import { closeOnboarding } from 'src/redux/actions';
import { PRIVACY_POLICY_URL } from 'src/constants/const';
import Icon from 'src/components/Icon/Icon';
import Button from 'src/components/Button/Button';
import logo from 'src/assets/images/logo.svg';

export default function Onboarding() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.onboarding.isOpen);

  function handleClose() {
    dispatch(closeOnboarding());
  }

  function handleExternalLink() {
    window.open(PRIVACY_POLICY_URL, '_blank');
  }

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.onboarding__overlay} onClick={handleClose}>
      <div className={styles.onboarding} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className={styles.close}>
          <Icon id="xIcon" width="13" height="13" />
        </button>
        <div className={styles.onboarding__header}>
          <img src={logo} alt="Airo logo" />
          <button type="button" onClick={handleExternalLink}>
            <Icon id="externalLinkIcon" width="18" height="18" />
          </button>
        </div>
        <div className={styles.onboarding__content}>
          <h1>Hi there!</h1>
          <p>
            Let us introduce the AIRO by Grid Dynamics – the application's ready
            to share with you the overall and parametrical information about the
            air condition in the selected area. <br /> <br /> It is the platform
            for collaboration. Users could add their own devices to share air
            condition statistics in their areas with other people. <br /> <br />
            The goal of the application is to highlight the condition of our
            common environment and think about where we are now and what we
            would bring to new generations.
          </p>
          <Button
            type="button"
            onClick={handleClose}
            className={styles.onboarding__button}
          >
            Ok, got it!
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
