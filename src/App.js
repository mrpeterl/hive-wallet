import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, HomeNoAuth} from './components/home/Home';
import { Blog } from './components/blog/Blog';
import hive from '@hiveio/hive-js';

hive.config.set('alternative_api_endpoints', ['https://api.hive.blog', 'https://anyx.io']);

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} >
            <Route path=':searchType' element={<Home />} />
        </Route>
        <Route path='/' element={<HomeNoAuth />} />
        <Route path="blog" element={<Blog />}>
          <Route path=":author/:id" element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
