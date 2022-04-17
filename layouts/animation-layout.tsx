import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AnimationPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{
        opacity: 0,
        y: 80,
        x: -20,
        transition: { duration: 0.5 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationPageLayout;
