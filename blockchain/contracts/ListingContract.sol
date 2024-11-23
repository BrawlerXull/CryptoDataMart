// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ListingContract is Ownable {

    struct Listing {
        uint256 id;
        address creator;
        string ipfsLink; 
        string previewIpfsLink;
        uint256 price;
        uint256 rentPricePerHour;
        uint256 minRentDuration;
        uint256 maxRentDuration;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;

    mapping(address => mapping(uint256 => uint256)) public renterAccessExpiration;
    mapping(address => mapping(uint256 => bool)) public buyerAccess;

    event ListingCreated(uint256 listingId, address creator, string ipfsLink, uint256 price, uint256 rentPricePerHour, uint256 minRentDuration, uint256 maxRentDuration);
    event ListingDeactivated(uint256 listingId, address creator);
    event DatasetRented(uint256 listingId, address renter, uint256 rentalEndTime);
    event DatasetPurchased(uint256 listingId, address buyer);

    constructor() Ownable(msg.sender) {}

    function createListing(
        string memory _ipfsLink,
        string memory _previewIpfsLink,
        uint256 _price,
        uint256 _rentPricePerHour,
        uint256 _minRentDuration,
        uint256 _maxRentDuration
    ) public returns (uint256) {
        uint256 listingId = nextListingId++;
        listings[listingId] = Listing({
            id: listingId,
            creator: msg.sender,
            ipfsLink: _ipfsLink,
            previewIpfsLink: _previewIpfsLink,
            price: _price,
            rentPricePerHour: _rentPricePerHour,
            minRentDuration: _minRentDuration,
            maxRentDuration: _maxRentDuration,
            isActive: true
        });

        buyerAccess[msg.sender][listingId] = true;

        emit ListingCreated(listingId, msg.sender, _ipfsLink, _price, _rentPricePerHour, _minRentDuration, _maxRentDuration);
        return listingId;
    }

    function deactivateListing(uint256 _listingId) public onlyOwner {
        require(listings[_listingId].isActive, "Listing already inactive");
        listings[_listingId].isActive = false;
        emit ListingDeactivated(_listingId, msg.sender);
    }

    function rentDataset(uint256 _listingId, uint256 _rentDuration, address renterAddress) public payable {
        Listing storage listing = listings[_listingId];

        require(listing.isActive, "Dataset is not available for rent");
        require(msg.value >= listing.rentPricePerHour * _rentDuration, "Incorrect rent price");
        require(_rentDuration >= listing.minRentDuration && _rentDuration <= listing.maxRentDuration, "Rent duration out of range");

        uint256 rentalEndTime = block.timestamp + _rentDuration;

        // Link the expiration time to both the renter's address and the listing ID
        renterAccessExpiration[renterAddress][_listingId] = rentalEndTime;

        payable(listing.creator).transfer(msg.value);

        emit DatasetRented(_listingId, renterAddress, rentalEndTime);
    }


    function buyDataset(uint256 _listingId , address buyerAddress) public payable {
        Listing storage listing = listings[_listingId];

        require(listing.isActive, "Dataset is not available for purchase");
        require(msg.value >= listing.price, "Incorrect price");

        payable(listing.creator).transfer(msg.value);

        buyerAccess[buyerAddress][_listingId] = true;

        emit DatasetPurchased(_listingId, buyerAddress);
    }

    function getPreviewIPFSLink(uint256 _listingId) public view returns (string memory) {
        return listings[_listingId].previewIpfsLink;
    }

    function getFullIPFSLink(uint256 _listingId) public view returns (string memory) {
        Listing storage listing = listings[_listingId];


        if (block.timestamp <= renterAccessExpiration[msg.sender][_listingId] || buyerAccess[msg.sender][_listingId]) {
            return listing.ipfsLink;
        } else {
            revert("You do not have access to the full dataset");
        }
    }


    function getListing(uint256 _listingId) public view returns (Listing memory) {
        return listings[_listingId];
    }
}
