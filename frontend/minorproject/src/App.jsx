import Login from './components/Login/Login'
import City from './components/Views/City/City';
import Country from './components/Views/Country/Country';
import HomePage from './components/Views/Home/Homepage';
import Sidebar from './components/Views/Home/Sidebar';
import State from './components/Views/State/State';
import './styles/App.css'
import {Routes, Route, useLocation } from "react-router-dom";

function App() {

  const location = useLocation()
  const isRootUrl = location.pathname === '/'
  return (
     <div className="App">
    { !isRootUrl ? (
      <>
      <div className="screens-container flex">
        <Sidebar/>
        <div className='w-[100%] flex items-center justify-center'>
          <Routes>
        <Route path='/home' element={<HomePage/>}></Route>
        <Route path='/country' element={<Country/>}></Route>
        <Route path='/state' element={<State/>}></Route>
        <Route path='/city' element={<City/>}></Route>
          </Routes>
        </div>
      </div>
      </>
    ): (
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    )}
  </div>
  )
}

export default App
