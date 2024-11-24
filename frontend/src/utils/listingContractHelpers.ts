import { ethers } from 'ethers';
import { getListingContract } from './contract';
import { Listing } from '../types/listing';

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

export const fetchListingData = async (provider: ethers.providers.Web3Provider, listingId: number): Promise<Listing> => {
  const contract = getListingContract(provider);
  try {
    const data = await contract.getListing(listingId);
    console.log(`Fetched listing data for ID ${listingId}:`, data);

    const listing: Listing = {
      id: Number(data.id), 
      creator: data.creator,
      price: ethers.BigNumber.from(data.price),
      tags: data.tags,
      creationTime: Number(data.creationTime),
      likes: Number(data.likes),
      ipfsLink: data.ipfsLink,
      previewIpfsLink: data.previewIpfsLink,
      rentPricePerHour: ethers.BigNumber.from(data.rentPricePerHour), 
      minRentDuration: Number(data.minRentDuration),
      isActive: data.isActive
    };

    return listing;
  } catch (err) {
    console.error(`Error fetching listing data for ID ${listingId}:`, err);
    throw err;
  }
};
