import React, { ReactNode } from 'react';
import { motion } from "framer-motion";

interface PageAnimationProps {
  children: ReactNode;
}

const PageAnimation: React.FC<PageAnimationProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageAnimation;