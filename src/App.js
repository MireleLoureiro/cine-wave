import { BrowserRouter, Routes, Route } from 'react-router-dom';

// components
import Header from './components/Header/Header';

// context
import { FavoritesProvider } from './contexts/FavoritesContext';

// pages
import Home from './pages/Home/Home';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import TVShowDetail from './pages/TVShowDetail/TVShowDetail';
import Search from './pages/Search/Search';
import Favorites from './pages/Favorites/Favorites';
import Categories from './pages/Categories/Categories';
import CategoryResults from './pages/CategoryResults/CategoryResults';

// css
import './App.css';


function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<TVShowDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:type/:genreId" element={<CategoryResults />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;