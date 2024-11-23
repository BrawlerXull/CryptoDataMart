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
        bool isActive;
        string[] tags;
        uint256 creationTime;
        uint256 likes;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;

    uint256 public minRentDuration = 30;

    mapping(address => mapping(uint256 => uint256)) public renterAccessExpiration;
    mapping(address => mapping(uint256 => bool)) public buyerAccess;
    mapping(uint256 => mapping(address => bool)) public likedBy; // Mapping to track likes by user

    event ListingCreated(uint256 listingId, address creator, string ipfsLink, uint256 price, uint256 rentPricePerHour, uint256 minRentDuration, string[] tags, uint256 creationTime);
    event ListingDeactivated(uint256 listingId, address creator);
    event DatasetRented(uint256 listingId, address renter, uint256 rentalEndTime);
    event DatasetPurchased(uint256 listingId, address buyer);
    event MinRentDurationUpdated(uint256 newMinRentDuration);
    event TagsUpdated(uint256 listingId, string[] newTags);
    event DatasetLiked(uint256 listingId, address user);
    event DatasetUnliked(uint256 listingId, address user);

    constructor() Ownable(msg.sender) {}

    function createListing(
        string memory _ipfsLink,
        string memory _previewIpfsLink,
        uint256 _price,
        uint256 _rentPricePerHour,
        string[] memory _tags  
    ) public returns (uint256) {
        uint256 listingId = nextListingId++;
        uint256 creationTime = block.timestamp;

        listings[listingId] = Listing({
            id: listingId,
            creator: msg.sender,
            ipfsLink: _ipfsLink,
            previewIpfsLink: _previewIpfsLink,
            price: _price,
            rentPricePerHour: _rentPricePerHour,
            minRentDuration: minRentDuration,
            isActive: true,
            tags: _tags,
            creationTime: creationTime,
            likes: 0
        });

        // Initialize the likedBy mapping for this listing as empty (no user has liked yet)
        // The mapping itself will be populated later when users interact with the "like" functionality.

        buyerAccess[msg.sender][listingId] = true;

        emit ListingCreated(listingId, msg.sender, _ipfsLink, _price, _rentPricePerHour, minRentDuration, _tags, creationTime);
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
        require(_rentDuration >= listing.minRentDuration, "Rent duration out of range");

        uint256 rentalEndTime = block.timestamp + _rentDuration;

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

    function setMinRentDuration(uint256 _newMinRentDuration) public onlyOwner {
        minRentDuration = _newMinRentDuration;
        emit MinRentDurationUpdated(_newMinRentDuration);
    }

    function setTags(uint256 _listingId, string[] memory _newTags) public {
        Listing storage listing = listings[_listingId];
        require(msg.sender == listing.creator, "Only the creator can set the tags");
        
        listing.tags = _newTags;
        emit TagsUpdated(_listingId, _newTags); 
    }

    function likeDataset(uint256 _listingId) public {
        Listing storage listing = listings[_listingId];
        require(listing.isActive, "Dataset is not available for liking");
        require(!likedBy[_listingId][msg.sender], "You have already liked this dataset");

        listing.likes += 1;
        likedBy[_listingId][msg.sender] = true;

        emit DatasetLiked(_listingId, msg.sender);
    }

    function removeLikeDataset(uint256 _listingId) public {
        Listing storage listing = listings[_listingId];
        require(listing.isActive, "Dataset is not available for unliking");
        require(likedBy[_listingId][msg.sender], "You have not liked this dataset yet");

        listing.likes -= 1;
        likedBy[_listingId][msg.sender] = false;

        emit DatasetUnliked(_listingId, msg.sender);
    }
}
