// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/utils/structs/EnumerableSet.sol";

contract DeShop {
    using EnumerableSet for EnumerableSet.UintSet;

    struct Store {
        string name;
        string description;
        uint256 earnings;
    }

    struct StoreResult {
        uint256 id;
        string name;
        string description;
        uint256 earnings;
    }

    struct Item {
        address buyer;
        address seller;
        uint256 price;
        bool sold;
        string name;
        string description;
        string imageUrl;
    }

    struct ItemResult {
        uint256 id;
        address buyer;
        address seller;
        uint256 price;
        bool sold;
        string name;
        string description;
        string imageUrl;
    }

    mapping(uint256 => Store) internal stores;
    mapping(uint256 => Item) internal items;

    mapping(address owner => uint256 storeId) internal storeIdByOwner;
    mapping(uint256 itemId => uint256 storeId) internal storeIdByItemId;
    mapping(uint256 storeId => EnumerableSet.UintSet itemIds) internal itemsByStore;
    mapping(address owner => EnumerableSet.UintSet itemIds) internal itemsBought;

    uint256 public storeCount;
    uint256 public itemCount;

    event StoreCreated(uint256 id, address owner, string name, string description);

    event ItemCreated(uint256 id, address seller, string name, string description, string imageUrl, uint256 price);

    event ItemSold(uint256 id, address seller, address buyer, uint256 price);

    constructor() {
        storeCount = 0;
        itemCount = 0;
    }

    function createStore(string memory _name, string memory _description) external returns (uint256 storeIdResult) {
        if (storeIdByOwner[msg.sender] != 0) {
            revert("You already have a store");
        }

        uint256 storeId = ++storeCount;

        stores[storeId] = Store({name: _name, description: _description, earnings: 0});

        storeIdByOwner[msg.sender] = storeId;

        storeIdResult = storeId;

        emit StoreCreated(storeId, msg.sender, _name, _description);
    }

    function createItem(
        uint256 _storeId,
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        uint256 _price
    ) external onlyStoreOwner(_storeId) ifValidStore(_storeId) returns (uint256 newItemId) {
        uint256 itemId = ++itemCount;

        items[itemId] = Item({
            buyer: address(0),
            seller: msg.sender,
            price: _price,
            sold: false,
            name: _name,
            description: _description,
            imageUrl: _imageUrl
        });

        itemsByStore[_storeId].add(itemId);
        storeIdByItemId[itemId] = _storeId;

        newItemId = itemId;

        emit ItemCreated(itemId, msg.sender, _name, _description, _imageUrl, _price);
    }

    function buyItem(uint256 _itemId) external payable {
        Item storage item = items[_itemId];

        require(!item.sold, "Item is already sold");
        require(msg.value >= item.price, "Not enough funds sent");
        require(msg.sender != item.seller, "Cannot buy your own item");

        item.buyer = msg.sender;
        item.sold = true;

        itemsBought[msg.sender].add(_itemId);

        // increase store earnings
        uint256 storeId = storeIdByItemId[_itemId];
        stores[storeId].earnings += item.price;

        payable(msg.sender).transfer(msg.value);

        emit ItemSold(_itemId, msg.sender, item.buyer, item.price);
    }

    // GETTERS

    function getStore(uint256 _storeId) external view ifValidStore(_storeId) returns (StoreResult memory storeResult) {
        Store memory store = stores[_storeId];
        return StoreResult({id: _storeId, name: store.name, description: store.description, earnings: store.earnings});
    }

    function getStoreByOwner(address _owner) external view returns (StoreResult memory storesResult) {
        uint256 storeId = storeIdByOwner[_owner];
        Store memory store = stores[storeId];
        return StoreResult({id: storeId, name: store.name, description: store.description, earnings: store.earnings});
    }

    function getItem(uint256 _itemId) external view returns (ItemResult memory itemResult) {
        Item memory item = items[_itemId];

        return ItemResult({
            id: _itemId,
            buyer: item.buyer,
            seller: item.seller,
            price: item.price,
            sold: item.sold,
            name: item.name,
            description: item.description,
            imageUrl: item.imageUrl
        });
    }

    function getAllItems() external view returns (ItemResult[] memory itemsResult) {
        itemsResult = new ItemResult[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 itemId = i + 1;
            Item memory item = items[itemId];

            itemsResult[i] = ItemResult({
                id: itemId,
                buyer: item.buyer,
                seller: item.seller,
                price: item.price,
                sold: item.sold,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl
            });
        }
        return itemsResult;
    }

    function getStoreItemsByOwner(address _owner) external view returns (ItemResult[] memory itemsResult) {
        uint256 storeId = storeIdByOwner[_owner];
        return getItemsByStore(storeId);
    }

    function getItemsByStore(uint256 _storeId)
        public
        view
        ifValidStore(_storeId)
        returns (ItemResult[] memory itemsResult)
    {
        uint256 itemCountByStore = itemsByStore[_storeId].length();
        itemsResult = new ItemResult[](itemCountByStore);

        for (uint256 i = 0; i < itemCountByStore; i++) {
            uint256 itemId = itemsByStore[_storeId].at(i);
            Item memory item = items[itemId];
            itemsResult[i] = ItemResult({
                id: itemId,
                buyer: item.buyer,
                seller: item.seller,
                price: item.price,
                sold: item.sold,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl
            });
        }
        return itemsResult;
    }

    function getItemsBought(address _buyer) external view returns (ItemResult[] memory itemsResult) {
        uint256 itemCountBought = itemsBought[_buyer].length();
        itemsResult = new ItemResult[](itemCountBought);

        for (uint256 i = 0; i < itemCountBought; i++) {
            uint256 itemId = itemsBought[_buyer].at(i);
            Item memory item = items[itemId];

            itemsResult[i] = ItemResult({
                id: itemId,
                buyer: item.buyer,
                seller: item.seller,
                price: item.price,
                sold: item.sold,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl
            });
        }
        return itemsResult;
    }

    // INTERNAL FUNCTIONS

    function storeExists(uint256 _storeId) internal view returns (bool) {
        return _storeId > 0 && _storeId <= storeCount;
    }

    function isStoreOwner(address _owner, uint256 _storeId) internal view returns (bool) {
        return storeIdByOwner[_owner] == _storeId;
    }

    // MODIFIERS

    modifier onlyStoreOwner(uint256 _storeId) {
        require(isStoreOwner(msg.sender, _storeId), "Only the store owner can perform this action");
        _;
    }

    modifier ifValidStore(uint256 _storeId) {
        require(storeExists(_storeId), "Store does not exist");
        _;
    }
}
