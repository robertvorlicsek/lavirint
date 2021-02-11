import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = ['#FF008C', '#D309E1', '#9C1AFF', '#7700FF', '#4400FF'];

export const MenuItem = ({ item }) => {
  const placeholderStyle = { border: `2px solid ${colors[item.id]}` };
  return (
    <motion.div
      className='menu-item-container'
      variants={menuItemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={item.to} className='menu-li'>
        <div className='menu-icon-placeholder' style={placeholderStyle} />
        <div className='menu-text-placeholder'>{item.name}</div>
      </Link>
    </motion.div>
  );
};
