import React from 'react';
import styles from './RoleBasedGreeting.module.css';
import { Avatar } from '@mui/material';

interface RoleBasedGreetingProps {
  name: string;
  role: 'odontologo' | 'paciente' | 'auxiliar';
  photoSrc: string;
}

const RoleBasedGreeting: React.FC<RoleBasedGreetingProps> = ({ name, role, photoSrc }) => {
  let greeting = '';

  switch (role) {
    case 'auxiliar':
      greeting = `Bienvenido auxiliar ${name}`;
      break;
    case 'paciente':
      greeting = `Bienvenido ${name}`;
      break;
    case 'odontologo':
      greeting = `Bienvenido Doctor ${name}`;
      break;
    default:
      greeting = `Bienvenido ${name}`;
  }

  return (
    <div className={styles.container}>
      { photoSrc ? 
        <img src={photoSrc} alt={name} className={styles.photo} />
        :
        <Avatar
          alt={name}
          sx={{
            width: 100,
            height: 100,
            mr: "20px"
          }}
        />
      }
      
      
      <div className={styles.textContainer}>
        <p className={styles.greeting}>{greeting}</p>
        <p className={styles.message}>Tu jornada en DentAR comienza aquí</p>
      </div>
    </div>
  );
};

export default RoleBasedGreeting;