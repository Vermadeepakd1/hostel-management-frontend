// src/pages/AdminDashboardPage.jsx

import React from 'react';
// 1. Import motion from framer-motion
import { motion } from 'framer-motion';

// Import your widgets
import OccupancyWidget from '../components/OccupancyWidget';
import StudentChartWidget from '../components/StudentChartWidget';
import ComplaintsWidget from '../components/ComplaintsWidget';
import PendingOutpassWidget from '../components/PendingOutpassWidget';
// import LiveClockWidget from '../components/LiveClockWidget';

// 2. Define animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1, // Start animating children after 0.1s
      staggerChildren: 0.2, // Each child animates 0.2s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  },
};

function AdminDashboardPage() {
  return (
    // 3. Apply the 'container' animation variants to the main grid
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 4. Wrap each widget in an animated 'item' div */}
      {/* These will now animate in one by one */}
      
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }} // Adds the hover effect
        className="transition-transform duration-200"
      >
        <OccupancyWidget />
   </motion.div>
      
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        className="transition-transform duration-200"
      >
        <StudentChartWidget />
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        className="transition-transform duration-200"
      >
        <ComplaintsWidget />
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        className="transition-transform duration-200"
      >
        <PendingOutpassWidget />
      </motion.div>
      
    </motion.div>
  );
}

export default AdminDashboardPage;