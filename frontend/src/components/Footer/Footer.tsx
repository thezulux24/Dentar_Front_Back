'use client';
import React from 'react';
import styles from './Footer.module.css';
import facebookIcon from '../../assets/svg/Facebook.svg';
import instagramIcon from '../../assets/svg/Instagram.svg';
import linkedinIcon from '../../assets/svg/linkedin.svg';
import twitterIcon from '../../assets/svg/twitter.svg';




const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>© Copyright&nbsp;DentAR. Todos los derechos reservados</p>
      <div className={styles.icons}>
        <img src={facebookIcon} alt="Facebook" className={styles.icon} />
        <img src={instagramIcon} alt="Instagram" className={styles.icon} />
        <img src={linkedinIcon} alt="linkedin" className={styles.icon} />
        <img src={twitterIcon} alt="twitter" className={styles.icon} />
      </div>
    </footer>
  );
};

export default Footer;
