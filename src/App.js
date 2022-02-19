import './App.css';
import Home from './components/home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import hive from '@hiveio/hive-js';

//hive.config.set('alternative_api_endpoints', ['https://api.hive.blog', 'https://anyx.io']);

hive.api.getAccounts(['mahdiyari', 'hiveio'], function(err, result) {
	console.log(err, result);
});

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/2' element={<h2 > Hello</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
