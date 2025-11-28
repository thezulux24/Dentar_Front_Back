import React from 'react';

const Loader: React.FC = () => {
  return (
    <div style={{
      margin: "1rem",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    }} />
  );
};

export default Loader;
