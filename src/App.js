import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, HomeNoAuth} from './components/home/Home';
import hive from '@hiveio/hive-js';

hive.config.set('alternative_api_endpoints', ['https://api.hive.blog', 'https://anyx.io']);

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeNoAuth />} />
        <Route path='/home' element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
