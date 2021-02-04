import { motion } from 'framer-motion';
import { MenuItem } from './MenuItem';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const item = [
  {
    id: 0,
    to: '/',
    name: 'Home',
  },
  {
    id: 1,
    to: '/editions',
    name: 'Izdanja',
  },
];

export const Navigation = () => (
  <motion.ul className='menu-ul' variants={variants}>
    {item.map(e => (
      <MenuItem key={e.id} item={e} />
    ))}
  </motion.ul>
);
