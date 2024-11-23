
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { fetchListingData, fetchNextListingId } from '../utils/listingContractHelpers';

interface ListingData {
  creator: string;
  price: ethers.BigNumber;
  tags: string[];
}

const useListingContract = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [listingData, setListingData] = useState<ListingData[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider); 
        console.log('Ethereum provider initialized');
      } else {
        alert('Please install MetaMask to interact with the blockchain.');
      }
    };

    initProvider();
  }, []); 

  
  useEffect(() => {
    if (provider) {
      console.log('Provider is ready. Fetching listings...');
      fetchAllListings(); 
    }
  }, [provider]); 

  
  const fetchAllListings = async () => {
    if (!provider) {
      console.log('Provider not yet initialized, returning early');
      return; 
    }

    setIsLoading(true); 

    try {
      const nextListingId = await fetchNextListingId(provider);
      console.log('Next Listing ID:', nextListingId.toString()); 
      
      const listingsPromises = [];
      for (let i = 0; i < nextListingId.toNumber(); i++) {
        listingsPromises.push(fetchListingData(provider, i)); 
      }

      const listings = await Promise.all(listingsPromises);
      console.log('Fetched All Listings:', listings);

      setListingData(listings);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      if (err.code === 'CALL_EXCEPTION') {
        console.error('Revert reason:', err.data); 
      }
      alert('An error occurred while fetching the listings.');
    } finally {
      setIsLoading(false); 
    }
  };

  return {
    listingData,
    isLoading,
  };
};

export default useListingContract;
