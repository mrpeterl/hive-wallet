import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, HomeNoAuth} from './components/home/Home';
import { Blog } from './components/blog/Blog';
import { CreateBlog } from './components/blog/CreateBlog';
import { Profile } from './components/blog/profile/Profile';
import { TokenList } from './components/trading/TokenList';
import { MyWallet } from './components/trading/MyWallet';
import NftGallery from './components/nft/NftGallery';

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
        <Route path="/trading">
          <Route path="/trading" element={<TokenList />} />
        </Route>
        <Route path="/trading/myWallet">
          <Route path="/trading/myWallet" element={<MyWallet />} />
        </Route>
        <Route path="/nft/gallery">
          <Route path="/nft/gallery" element={<NftGallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
