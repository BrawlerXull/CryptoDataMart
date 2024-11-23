// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ListingContract.sol";

contract PaymentContract {
    ListingContract public listingContract;

    event PaymentReceived(address buyer, uint256 listingId, uint256 amount);
    event DatasetRented(address renter, uint256 listingId, uint256 rentalEndTime);
    event DatasetPurchased(address buyer, uint256 listingId);

    constructor(address _listingContract) {
        listingContract = ListingContract(_listingContract);
    }

    function rentDataset(uint256 _listingId, uint256 _rentDuration) public payable {
        ListingContract.Listing memory listing = listingContract.getListing(_listingId);

        require(listing.isActive, "Dataset not available for rent");
        require(msg.value >= listing.rentPricePerHour * _rentDuration, "Incorrect rent price");
        require(_rentDuration >= listing.minRentDuration, "Rent duration out of range");

        listingContract.rentDataset{value: msg.value}(_listingId, _rentDuration , msg.sender);

        emit DatasetRented(msg.sender, _listingId, block.timestamp + _rentDuration);
    }

    function buyDataset(uint256 _listingId) public payable {
        ListingContract.Listing memory listing = listingContract.getListing(_listingId);

        require(listing.isActive, "Dataset not available for purchase");
        require(msg.value >= listing.price, "Incorrect price to buy the dataset");

        listingContract.buyDataset{value: msg.value}(_listingId , msg.sender);

        emit DatasetPurchased(msg.sender, _listingId);
    }

    receive() external payable {}

    fallback() external payable {}
}
