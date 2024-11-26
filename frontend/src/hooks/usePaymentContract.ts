import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getPaymentContract } from '../utils/contract'; 
import toast from 'react-hot-toast';

const usePaymentContract = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        console.log('Ethereum provider initialized');
      } else {
        toast.error('Please install MetaMask to interact with the blockchain.');
      }
    };

    initProvider();
  }, []);

  const buyDataset = async (listingId: number, price: number) => {
    if (!provider) return;

    setIsLoading(true);

    const contract = getPaymentContract(provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    try {
      const tx = await contractWithSigner.buyDataset(listingId, {
        value: ethers.utils.parseUnits(price.toString(), "wei"),
      });
      await tx.wait(); 
      toast.success("Dataset purchased successfully!");
    } catch (err: any) {
      console.error("Error purchasing dataset:", err);
      toast.error(`Error purchasing dataset: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    buyDataset,
    isLoading,
  };
};

export default usePaymentContract;
