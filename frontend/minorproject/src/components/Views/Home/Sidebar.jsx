// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import * as FaIcons from 'react-icons/fa';
// import * as AiIcons from 'react-icons/ai';
// import { SidebarData } from './SidebarData.jsx';
// import './Navbar.css';
// import { IconContext } from 'react-icons';
// import { useState } from 'react';

// const Sidebar = () => {
//   const [sidebar, setSidebar] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const showSidebar = () => {
//     setSidebar(!sidebar);
//   };

//   // Function to handle clicks on sidebar items
//   const handleItemClick = (e) => {
//     e.stopPropagation();
//   };

//   // Function to handle logout
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login'); // Redirect to login page
//   };

//   return (
//     <>
//       <IconContext.Provider value={{ color: '#fff' }}>
//         <div className='navbar'>
//           <Link to='#' className='menu-bars'>
//             <FaIcons.FaBars onClick={showSidebar} />
//           </Link>
//         </div>
//         <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
//           <ul className='nav-menu-items'>
//             <li className='navbar-toggle'>
//               <Link to='#' className='menu-bars' onClick={showSidebar}>
//                 <AiIcons.AiOutlineClose />
//               </Link>
//             </li>
//             {SidebarData.map((item, index) => (
//               <li key={index} className={item.cName} onClick={handleItemClick}>
//                 <Link to={item.path} onClick={item.title === 'Logout' ? handleLogout : null}
//                   className={location.pathname === item.path ? 'active' : ''}
//                 >
//                   {item.icon}
//                   <span className='color-text'>{item.title}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </IconContext.Provider>
//     </>
//   );
// };

// export default Sidebar;
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ImEarth } from 'react-icons/im';
import { IoLogOut } from 'react-icons/io5';   

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authToken from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('UserDetails');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="flex flex-col bg-blue-900 w-[15%] h-screen p-4">
      <div className="transition-all duration-300">
        <div className="">
          {/* Hamburger Icon */}
          
        </div>

        <div className="mt-20 flex flex-col items-start">
          <div className='my-3'>
            <NavLink
              className={`relative text-xl font-semibold ${
                location.pathname === "/country" ? "text-yellow-300" : "text-white"
              }  transition-colors duration-300 flex items-center`}
              to="/country"
            >
              <ImEarth className="inline-block mr-2" /> 
              Country
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-x-100 "></div>
            </NavLink>
          </div>
          <div className='my-3'>
            <NavLink
              className={`relative text-xl font-semibold  ${
                location.pathname === "/state" ? "text-yellow-300" : "text-white"
              }  transition-colors duration-300 flex items-center`}
              to="/state"
            >
              <ImEarth className="inline-block mr-2" /> 
              State
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
            </NavLink>
          </div>
          <div className='my-3'> 
            <NavLink
              className={`relative text-lg font-semibold  ${
                location.pathname === "/city" ? "text-yellow-300" : "text-white"
              }  transition-colors duration-300 flex items-center`}
              to="/city"
            >
              <ImEarth className="inline-block mr-2" />
              City
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="mt-auto">
        <button
          className="text-lg text-white hover:text-black transition-colors duration-300 flex items-center"
          onClick={handleLogout}
        >
          <IoLogOut className="inline-block mr-2" /> 
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;







