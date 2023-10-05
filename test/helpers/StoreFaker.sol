// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./DefaultValues.sol";
import "./TestTypes.sol";

library StoreFaker {
    function init() external pure returns (TestTypes.StoreRequest memory) {
        return TestTypes.StoreRequest({name: DefaultValues.STORE_NAME, description: DefaultValues.STORE_DESCRIPTION});
    }

    function withName(TestTypes.StoreRequest memory _params, string memory _name)
        external
        pure
        returns (TestTypes.StoreRequest memory)
    {
        _params.name = _name;
        return _params;
    }

    function withDescription(TestTypes.StoreRequest memory _params, string memory _description)
        external
        pure
        returns (TestTypes.StoreRequest memory)
    {
        _params.description = _description;
        return _params;
    }
}
