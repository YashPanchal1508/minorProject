import { Link, useLocation,useNavigate  } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const removeItem = () => {
    localStorage.clear();
    navigate("/")
  }

  return (
    <div className="flex flex-col items-center justify-center bg-slate-800  text-white font-sans w-[15%] h-screen">
      <Link
        to="/country"
        className={`py-3 px-5 mb-6  text-center rounded text-lg font-extrabold  ${
          location.pathname === '/country' ? 'text-slate-600 ' : 'hover:text-slate-500 transition duration-300 ease-in-out'
        }`}
      >
        Country
      </Link>
      <Link
        to="/state"
        className={`py-3 px-5 mb-6 text-center rounded text-lg font-extrabold  ${
          location.pathname === '/state' ? 'text-slate-600' : 'hover:text-slate-500 transition duration-300 ease-in-out'
        }`}
      >
        State
      </Link>
      <Link
        to="/city"
        className={`py-3 px-5 mb-6  text-center rounded text-lg font-extrabold  ${
          location.pathname === '/city' ? 'text-slate-400' : 'hover:text-slate-500  transition duration-300 ease-in-out'
        }`}
      >
        City
      </Link>
      <Link
        to="/login"
        onClick={removeItem}
        className={`py-3 px-5 mb-6  text-center rounded text-lg font-extrabold  ${
          location.pathname === '/login' ? 'text-slate-400' : 'hover:text-slate-500  transition duration-300 ease-in-out'
        }`}
      >
        Logout
      </Link>
    </div>
  );
};

export default Sidebar;
