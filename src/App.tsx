import { useState, type ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/pages/home';
import AboutPage from './components/pages/about';
import NotFoundPage from './components/pages/not-found';
import CoinDetailsPage from './components/pages/coin-details';
import TrendsPage from './components/pages/trends';
import PortfolioPage from './components/pages/portfolio';
import CoinsTablePage from './components/pages/coins-table-page';
import LoginPage from './components/pages/auth/login-page';
import RegisterPage from './components/pages/auth/register-page';
import { AuthProvider } from './components/providers/auth-provider';
import { useAuth } from './hooks/use-auth';
import { useMarketData } from './hooks/use-market-data';


// Protected Route Component
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');

  const { data: coins = [], isLoading: loading, error: queryError } = useMarketData(limit);
  const error = queryError ? (queryError as Error).message : null;

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
          <Route
            path='/portfolio'
            element={
              <RequireAuth>
                <PortfolioPage />
              </RequireAuth>
            }
          />
          <Route path='/coins-table' element={<CoinsTablePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
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

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
