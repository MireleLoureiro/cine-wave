import { BrowserRouter, Routes, Route } from 'react-router-dom';

// components
import Header from './components/Header/Header';

// context
import { FavoritesProvider } from './contexts/FavoritesContext';

// pages
import Home from './pages/Home/Home';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Search from './pages/Search/Search';
import Favorites from './pages/Favorites/Favorites';

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
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;