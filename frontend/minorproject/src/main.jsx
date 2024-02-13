import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { CountryProvider } from '../src/Context/Country.context'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StateProvider } from '../src/Context/State.context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <CountryProvider>
        <StateProvider>
          <App />
        </StateProvider>
      </CountryProvider>
    </Provider>

  </Router>
)
