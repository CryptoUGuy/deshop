// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";

import {DeShop} from "../src/DeShop.sol";

contract DeShopScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.rememberKey(deployerPrivateKey);

        vm.startBroadcast(deployer);

        // deploy main instance
        DeShop shop = new DeShop();

        // create store
        uint256 storeId = shop.createStore("My Store", "The most amazing store ever");

        // create items
        shop.createItem(storeId, "Item 1", "The best item ever", "https://picsum.photos/200/300", 0.1 ether);
        shop.createItem(storeId, "Item 2", "The best item ever existed", "https://picsum.photos/200/300", 0.1 ether);
        shop.createItem(storeId, "Item 3", "The only and best item", "https://picsum.photos/200/300", 0.1 ether);
        shop.createItem(storeId, "Item 4", "The item for everyone", "https://picsum.photos/200/300", 0.1 ether);

        vm.stopBroadcast();
    }
}
