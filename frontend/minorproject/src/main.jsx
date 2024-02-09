import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import {CountryProvider} from '../src/Context/Country.context'
import Snowfall from 'react-snowfall'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <CountryProvider>
      <Snowfall />
      <App />
      </CountryProvider>
    </Router>
)
