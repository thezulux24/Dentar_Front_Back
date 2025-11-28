// FlexiCard.tsx
import React from 'react';
import styles from './FlexiCard.module.css';

interface FlexiCardProps {
  imageSrc: string;
  title: string;
  text: string;
  imagePosition: 'left' | 'right';
}

const FlexiCard: React.FC<FlexiCardProps> = ({ imageSrc, title, text, imagePosition }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${imagePosition === 'left' ? styles.imageLeft : styles.imageRight}`}>
        <img src={imageSrc} alt="Card Image" className={styles.cardImage} />
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardText}>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default FlexiCard;