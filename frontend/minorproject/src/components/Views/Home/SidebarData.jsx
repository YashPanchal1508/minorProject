import { ImEarth } from 'react-icons/im';
import { IoLogOut } from 'react-icons/io5';
import { FaHome } from 'react-icons/fa';

export const SidebarData = [
    {
      title: 'Home',
      path: '/home',
      icon: <FaHome />,
      cName: 'nav-text'
    },
    {
      title: 'Country',
      path: '/country',
      icon: <ImEarth />,
      cName: 'nav-text'
    },
    {
      title: 'State',
      path: '/state',
      icon: <ImEarth />,
      cName: 'nav-text'
    },
    {
      title: 'City',
      path: '/city',
      icon: <ImEarth />,
      cName: 'nav-text'
    },
    {
      title: 'Logout',
      path: '/login',
      icon: <IoLogOut />,
      cName: 'nav-text'
    },
  ];