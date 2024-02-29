import Login from './components/Login/Login'
import Register from './components/Register/Register';
import City from './components/Views/City/City';
import Country from './components/Views/Country/Country';
import HomePage from './components/Views/Home/Homepage';
import Sidebar from './components/Views/Home/Sidebar';
import State from './components/Views/State/State';
import {Routes, Route, useLocation } from "react-router-dom";
import {useState} from 'react'
import { X } from 'lucide-react'; // Import the X icon
function App() {

  const location = useLocation()
  const isRootUrl = location.pathname === '/'
  const isLogin = location.pathname === '/login'
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
     <div className="App">
    { !isRootUrl && !isLogin ? (
      <>
      <div className="flex h-screen relative" >
      <div className="absolute top-5 left-5 z-50">
          <button
            className="text-3xl text-black focus:outline-none"
            onClick={toggleSidebar}
            style={{ zIndex: 1000 }}
          >
            {showSidebar ? <X size={40} /> : '☰'}
          </button>
        </div>
    
        {showSidebar && !isRootUrl && <Sidebar />}
        <div className='w-screen flex items-center justify-center bg-gray-300 content-area'>
          <Routes>
        <Route path='/home' element={<HomePage/> }></Route>
        <Route path='/country' element={<Country/>}></Route>
        <Route path='/state' element={<State/>}></Route>
        <Route path='/city' element={<City/>}></Route>
          </Routes>
        </div>
      </div>
    
      </>
    ): (
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Register/>}></Route>
      </Routes>
    )}
  </div>
  )
}

export default App

// import { Routes, Route, useLocation, Navigate, Link } from "react-router-dom";
// import { useState } from 'react';

// import Login from './components/Login/Login';
// import Register from './components/Register/Register';
// import City from './components/Views/City/City';
// import Country from './components/Views/Country/Country';
// import HomePage from './components/Views/Home/Homepage';
// import Sidebar from './components/Views/Home/Sidebar';
// import State from './components/Views/State/State';
// import './styles/App.css';

// function App() {
//   const location = useLocation();
//   const isRootUrl = location.pathname === '/';

//   // State to track registration success
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<Link to="/register" />} /> {/* Always redirect to register page */}
//         <Route path="/register" element={<Register onRegistrationSuccess={() => setRegistrationSuccess(true)} />} />
//         {registrationSuccess && <Route path="/login" element={<Link to="/home" />} />} {/* Redirect to login page after successful registration */}
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/home"
//           element={
//             <div className="screens-container flex">
//              {isRootUrl && <Sidebar />}
//               <div className='w-[100%] flex items-center justify-center backgrounds-gradient'>
//                 <HomePage />
//               </div>
//             </div>
//           }
//         />
//         <Route path="/country" element={<Country />} />
//         <Route path="/state" element={<State />} />
//         <Route path="/city" element={<City />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


