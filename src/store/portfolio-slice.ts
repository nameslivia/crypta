import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface Transaction {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  totalCost: number;
}

interface PortfolioState {
  transactions: Transaction[];
}

const loadPortfolio = () => {
  const saved = localStorage.getItem('cryptoPortfolio');
  return saved ? JSON.parse(saved) : [];
};

// State
const initialState: PortfolioState = {
  transactions: loadPortfolio(),
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
      localStorage.setItem('cryptoPortfolio', JSON.stringify(state.transactions));
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload);
      localStorage.setItem('cryptoPortfolio', JSON.stringify(state.transactions));
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((transaction) => transaction.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
          localStorage.setItem('cryptoPortfolio', JSON.stringify(state.transactions));
        }
      },
    clearPortfolio: (state) => {
      state.transactions = [];
      localStorage.removeItem('cryptoPortfolio');
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;

// Selectors
export const selectTransactions = (state: RootState) => state.portfolio.transactions;
export const selectTransactionById = (id: string) => (state: RootState) =>
  state.portfolio.transactions.find((transaction) => transaction.id === id);
