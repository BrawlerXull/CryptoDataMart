import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  walletAddress: string | null;
  isConnected: boolean;
}

const initialState: WalletState = {
  walletAddress: null,
  isConnected: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress(state, action: PayloadAction<string>) {
      state.walletAddress = action.payload;
      state.isConnected = true;
    },
    disconnectWallet(state) {
      state.walletAddress = null;
      state.isConnected = false;
    },
  },
});

export const { setWalletAddress, disconnectWallet } = walletSlice.actions;

export default walletSlice.reducer;
