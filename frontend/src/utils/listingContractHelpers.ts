import { ethers } from 'ethers';
import { getListingContract } from './contract';

export const fetchNextListingId = async (provider: ethers.providers.Web3Provider): Promise<ethers.BigNumber> => {
  const contract = getListingContract(provider); 
  try {
    const nextListingId = await contract.nextListingId();
    console.log('Fetched nextListingId:', nextListingId.toString());
    return nextListingId;
  } catch (err) {
    console.error('Error fetching nextListingId:', err);
    throw err; 
  }
};

export const fetchListingData = async (provider: ethers.providers.Web3Provider, listingId: number) => {
  const contract = getListingContract(provider);
  try {
    const data = await contract.getListing(listingId);
    console.log(`Fetched listing data for ID ${listingId}:`, data);
    return {
      creator: data.creator,
      price: data.price,
      tags: data.tags,
    };
  } catch (err) {
    console.error(`Error fetching listing data for ID ${listingId}:`, err);
    throw err;
  }
};
