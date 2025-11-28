import React, { useState } from 'react';
import './AddTreatmentModal.css';

interface AddTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTreatment: (newTreatment: { title: string; description: string; image: string }) => void;
}

const AddTreatmentModal: React.FC<AddTreatmentModalProps> = ({ isOpen, onClose, onAddTreatment }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/350x200?text=Nuevo+Tratamiento');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTreatment({ title, description, image });
    onClose();
    setTitle('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Agregar Nuevo Tratamiento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>URL de la imagen:</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTreatmentModal;