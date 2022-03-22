import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, HomeNoAuth} from './components/home/Home';
import { Blog } from './components/blog/Blog';
import hive from '@hiveio/hive-js';
import { CreateBlog } from './components/blog/CreateBlog';
import { Profile } from './components/blog/profile/Profile';

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} >
            <Route path=':searchType' element={<Home className='App' />} />
        </Route>
        <Route path='/' element={<HomeNoAuth />} />
        <Route path="blog" element={<Blog />}>
          <Route path=":author/:id" element={<Blog />} />
        </Route>
        <Route path="/blog/create" element={<CreateBlog />} />
        <Route path="/profile">
          <Route  path=":username" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
