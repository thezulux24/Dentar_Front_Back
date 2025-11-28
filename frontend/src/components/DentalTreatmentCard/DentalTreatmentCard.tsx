import { useState } from 'react';
import React from 'react';
import './DentalTreatmentCard.css';
import { useNavigate } from 'react-router-dom';

import { PreviewPopup } from '../imports';

interface DentalTreatmentCardProps {
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  visualization?: string;
  isAdmin?: boolean;
}

const DentalTreatmentCard: React.FC<DentalTreatmentCardProps> = ({
  image,
  title,
  description,
  buttonText = 'Información',
  visualization = '',
  isAdmin = false
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="treatment-card">
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>

        <button className="card-button" style={{width:'100%'}} onClick={()=>setIsOpen(true)}>{buttonText}</button>
      </div>

      <PreviewPopup 
        isOpen={isOpen} 
        imageSrc={image} 
        title={title} 
        text={description} 
        isEnabled={visualization?true:false} 
        onClose={()=>setIsOpen(false)}
        onPreviewClick={() => navigate(visualization)}
        isAdmin = {isAdmin}
        ></PreviewPopup>
    </div>
  );
};

export default DentalTreatmentCard;