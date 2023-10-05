// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {DeShop} from "../src/DeShop.sol";

import {StoreFaker} from "./helpers/StoreFaker.sol";
import {TestTypes} from "./helpers/TestTypes.sol";

contract DeShopTest is Test {
    using StoreFaker for TestTypes.StoreRequest;

    DeShop public deshopInstance;

    address OWNER = vm.addr(1);
    address NON_OWNER = vm.addr(2);

    function setUp() public {
        vm.deal(OWNER, 100 ether);
        vm.deal(NON_OWNER, 100 ether);

        vm.prank(OWNER);
        deshopInstance = new DeShop();
    }

    function testCreateStore() public {
        _createDefaultStore();

        _assertStore(
            ExpectedStoreValues({
                name: _getDefaultStoreValues().name,
                description: _getDefaultStoreValues().description,
                id: 1,
                earnings: 0
            })
        );

        _assertState(ExpectedStateValues({count: 1}));
    }

    function testCreateMultipleStore() public {
        string memory name = "store2";
        string memory description = "My store 2";
        TestTypes.StoreRequest memory params = _getDefaultStoreValues().withName(name).withDescription(description);

        _createDefaultStore();
        _createStoreWith(params);

        _assertStore(
            ExpectedStoreValues({
                id: 1,
                name: _getDefaultStoreValues().name,
                description: _getDefaultStoreValues().description,
                earnings: 0
            })
        );

        _assertStore(ExpectedStoreValues({id: 2, name: name, description: description, earnings: 0}));

        _assertState(ExpectedStateValues({count: 2}));
    }

    function testGetStoresByOwner_singleCase() public {
        _createDefaultStore();

        DeShop.StoreResult memory store = deshopInstance.getStoreByOwner(OWNER);

        assertEq(store.id, 1, "id should be 1");
        assertEq(store.name, _getDefaultStoreValues().name, "name should be the same");
        assertEq(store.description, _getDefaultStoreValues().description, "description should be the same");
        assertEq(store.earnings, 0, "earnings should be 0");
    }

    function testCreateItem() public {
        _createDefaultStore();

        string memory name = "item1";
        string memory description = "My item 1";
        string memory imageUrl = "https://example.com/image1.png";
        uint256 price = 1 ether;

        vm.prank(OWNER);
        deshopInstance.createItem(1, name, description, imageUrl, price);
    }

    function testCreateItem_nonOwner_reverts() public {
        _createDefaultStore();

        string memory name = "item1";
        string memory description = "My item 1";
        string memory imageUrl = "https://example.com/image1.png";
        uint256 price = 1 ether;

        vm.expectRevert("Only the store owner can perform this action");
        vm.prank(NON_OWNER);
        deshopInstance.createItem(1, name, description, imageUrl, price);
    }

    function testBuyItem() public {
        _createDefaultStore();

        string memory name = "item1";
        string memory description = "My item 1";
        string memory imageUrl = "https://example.com/image1.png";
        uint256 price = 1 ether;

        vm.prank(OWNER);
        uint256 newItemId = deshopInstance.createItem(1, name, description, imageUrl, price);

        vm.prank(NON_OWNER);
        deshopInstance.buyItem{value: price}(newItemId);
    }

    function getPurchases() public {
        _createDefaultStore();

        string memory name = "item1";
        string memory description = "My item 1";
        string memory imageUrl = "https://example.com/image1.png";
        uint256 price = 1 ether;

        vm.prank(OWNER);
        uint256 newItemId = deshopInstance.createItem(1, name, description, imageUrl, price);

        vm.prank(NON_OWNER);
        deshopInstance.buyItem{value: price}(newItemId);

        vm.prank(NON_OWNER);
        DeShop.ItemResult[] memory purchases = deshopInstance.getItemsBought(NON_OWNER);

        assertEq(purchases.length, 1, "should have 1 purchase");
    }

    function testGetItems() public {
        _createDefaultStore();

        string memory name = "item1";
        string memory description = "My item 1";
        string memory imageUrl = "https://example.com/image1.png";
        uint256 price = 1 ether;

        vm.prank(OWNER);
        deshopInstance.createItem(1, name, description, imageUrl, price);

        DeShop.ItemResult[] memory items = deshopInstance.getAllItems();

        assertEq(items.length, 1, "should have 1 item");
        assertEq(items[0].name, name, "name should be the same");
        assertEq(items[0].description, description, "description should be the same");
        assertEq(items[0].imageUrl, imageUrl, "imageUrl should be the same");
        assertEq(items[0].price, price, "price should be the same");
        assertEq(items[0].sold, false, "sold should be false");
    }

    // HELPERS

    function _getDefaultStoreValues() internal pure returns (TestTypes.StoreRequest memory) {
        return StoreFaker.init();
    }

    function _createDefaultStore() internal {
        vm.startPrank(OWNER);
        TestTypes.StoreRequest memory storeParams = _getDefaultStoreValues();
        deshopInstance.createStore(storeParams.name, storeParams.description);
        vm.stopPrank();
    }

    function _createStoreWith(TestTypes.StoreRequest memory _storeParams) internal {
        deshopInstance.createStore(_storeParams.name, _storeParams.description);
    }

    struct ExpectedStateValues {
        uint256 count;
    }

    struct ExpectedStoreValues {
        uint256 id;
        string name;
        string description;
        uint256 earnings;
    }

    function _assertStore(ExpectedStoreValues memory _expectedValues) internal {
        DeShop.StoreResult memory store = deshopInstance.getStore(_expectedValues.id);

        assertEq(store.id, _expectedValues.id, "id should be the same");
        assertEq(store.name, _expectedValues.name, "name should be the same");
        assertEq(store.description, _expectedValues.description, "description should be the same");
        assertEq(store.earnings, _expectedValues.earnings, "earnings should be 0");
    }

    function _assertState(ExpectedStateValues memory _expectedValues) internal {
        assertEq(deshopInstance.storeCount(), _expectedValues.count, "storeCount should be 1");
    }
}
