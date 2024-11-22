import { useDispatch } from 'react-redux';
import { setWalletAddress, disconnectWallet } from '../redux/wallet/walletSlice';
import toast from 'react-hot-toast';

const useWalletLogin = () => {
  const dispatch = useDispatch();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
          dispatch(setWalletAddress(accounts[0]));

          toast.success(`Successfully connected as: ${accounts[0]}`)
        } else {
        console.error('No accounts found in MetaMask');
        }
      } catch (error: any) {
        console.error('Error connecting to MetaMask:', error);
        alert('Could not connect to MetaMask. Please try again.');
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask!');
    }
  };

  const disconnectWalletHandler = () => {
    dispatch(disconnectWallet());
    toast.success(`Successfully disconnected!`)
  };

  return { connectWallet, disconnectWalletHandler };
};

export default useWalletLogin;
