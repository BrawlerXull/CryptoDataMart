import { ethers } from "ethers";

import ListingContractABI from "../config/ListingContractABI.json";
import PaymentContractABI from "../config/PaymentContractABI.json";

const listingContractAddress = import.meta.env.VITE_LISTING_CONTRACT_ADDRESS;
const paymentContractAddress = import.meta.env.VITE_PAYMENT_CONTRACT_ADDRESS;

export const getListingContract = (provider: ethers.providers.Provider) => {
  return new ethers.Contract(listingContractAddress, ListingContractABI, provider);
};

export const getPaymentContract = (provider: ethers.providers.Provider) => {
  return new ethers.Contract(paymentContractAddress, PaymentContractABI, provider);
};
