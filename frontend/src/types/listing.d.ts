import { ethers } from "ethers";

export interface Listing {
  id: number;
  creator: string;
  ipfsLink: string;
  previewIpfsLink: string;
  price: ethers.BigNumber;
  rentPricePerHour: ethers.BigNumber;
  minRentDuration: number;
  isActive: boolean;
  tags: string[];
  creationTime: number;
  likes: number;
}
