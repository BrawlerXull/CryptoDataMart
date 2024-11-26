import React, { useEffect, useState } from "react";
import { FaMoneyCheckDollar, FaShop } from "react-icons/fa6";
import { Listing } from "../types/listing";
import usePaymentContract from "../hooks/usePaymentContract";
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface BuyDatasetSectionProps {
  dataset: Listing | null;
}

const BuyDatasetSection: React.FC<BuyDatasetSectionProps> = ({ dataset }) => {
  const { buyDataset, isLoading } = usePaymentContract();
  const [price, setPrice] = useState<number>(0);
  const wallet = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    if (dataset) {
      setPrice(Number(dataset.price));
    }
  }, [dataset]);

  const handlePurchase = async () => {

    if (!wallet.isConnected) {
        toast.error("Please connect your wallet before purchasing.");
        return;
    }
  
    if (!dataset || !price) {
      toast.error("Dataset details are not valid");
      return;
    }

    try {
      await buyDataset(dataset.id, price);
    } catch (error) {
      console.error('Error purchasing dataset:', error);
      toast.error(`Failed to purchase the dataset.`);
    }
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="rounded-3xl max-w-xl rounded-t-3xl bg-background p-8 ring-1 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-3xl">
        <div className="flex items-center">
          <h4 className="text-2xl font-semibold text-primary">Wanna Buy This Dataset?</h4>
          <FaShop className="w-10" />
        </div>
        <p className="mt-4 flex items-baseline gap-x-2">
          <span className="text-5xl font-semibold tracking-tight flex items-center">
            <FaMoneyCheckDollar className="mr-5" />
            {dataset?.price ? `${dataset.price} Wei` : "Price Unavailable"}
          </span>
        </p>
        <p className="mt-6 text-base">
          The perfect plan if you want to access this valuable dataset.
        </p>
        <ul role="list" className="mt-8 space-y-3 text-sm sm:mt-10">
          <li className="flex gap-x-3">
            <svg
              className="h-6 w-5 flex-none text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
            Valuable insights
          </li>
          <li className="flex gap-x-3">
            <svg
              className="h-6 w-5 flex-none text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
            Access to premium data
          </li>
          <li className="flex gap-x-3">
            <svg
              className="h-6 w-5 flex-none text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
            Exclusive full access to the Dataset
          </li>
        </ul>

        <div className="mt-8">
          <button
            onClick={handlePurchase}
            disabled={isLoading || !dataset}
            className="w-full flex justify-center rounded-lg bg-primary py-2 px-4 text-white"
          >
            {isLoading ? "Processing..." : "Buy Dataset"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyDatasetSection;
