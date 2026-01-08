import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/pages/home';
import AboutPage from './components/pages/about';
import NotFoundPage from './components/pages/not-found';
import CoinDetailsPage from './components/pages/coin-details';
import TrendsPage from './components/pages/trends';
import PortfolioPage from './components/pages/portfolio';
import CoinsTablePage from './components/pages/coins-table-page';

const API_URL = import.meta.env.VITE_COINS_API_URL;

import type { Coin } from '@/types';

const App = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        );
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setCoins(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path='/'
            element={
              <HomePage
                coins={coins}
                filter={filter}
                setFilter={setFilter}
                limit={limit}
                setLimit={setLimit}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={loading}
                error={error}
              />
            }
          />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/coin/:id' element={<CoinDetailsPage />} />
          <Route path='/trends' element={<TrendsPage />} />
          <Route path='/portfolio' element={<PortfolioPage />} />
          <Route path='/coins-table' element={<CoinsTablePage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="py-6 border-t text-center text-sm text-muted-foreground bg-muted/20">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Crypta. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
