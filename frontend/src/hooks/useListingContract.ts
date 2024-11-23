import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { fetchListingData, fetchNextListingId } from '../utils/listingContractHelpers';
import { getListingContract } from '../utils/contract';
import toast from 'react-hot-toast';

interface ListingData {
  creator: string;
  price: ethers.BigNumber;
  tags: string[];
  likes: number;
  creationTime: number;
}

const useListingContract = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [listingData, setListingData] = useState<ListingData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [creatingListing, setCreatingListing] = useState<boolean>(false);

  const [ipfsLink, setIpfsLink] = useState<string>('');
  const [previewIpfsLink, setPreviewIpfsLink] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [rentPricePerHour, setRentPricePerHour] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);

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
      alert('An error occurred while fetching the listings.');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewListing = async (
    previewCid: string,
    fullCid: string,
    price: number,
    rentPricePerHour: number,
    tags: string[]
  ) => {
    if (!provider) {
      console.log('Provider not initialized.');
      return;
    }

    setCreatingListing(true);

    const contract = getListingContract(provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    try {
      const tx = await contractWithSigner.createListing(
        previewCid,
        fullCid,
        price,
        rentPricePerHour,
        tags
      );

      console.log('Transaction sent:', tx);
      await tx.wait(); 
      console.log('Listing created successfully.');
      toast.success('Listing created successfully.');

      fetchAllListings();
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('An error occurred while creating the listing.');
    } finally {
      setCreatingListing(false);
    }
  };

  return {
    listingData,
    isLoading,
    creatingListing,
    ipfsLink,
    setIpfsLink,
    previewIpfsLink,
    setPreviewIpfsLink,
    price,
    setPrice,
    rentPricePerHour,
    setRentPricePerHour,
    tags,
    setTags,
    createNewListing,
  };
};

export default useListingContract;
