// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Guestbook {
    struct Entry {
        address signer;
        string name;
        string message;
        uint256 timestamp;
    }

    Entry[] public entries;

    event Signed(address indexed signer, string name, string message, uint256 timestamp);

    function sign(string calldata name, string calldata message) external {
        entries.push(Entry(msg.sender, name, message, block.timestamp));
        emit Signed(msg.sender, name, message, block.timestamp);
    }

    function getEntries() external view returns (Entry[] memory) {
        return entries;
    }

    function getEntryCount() external view returns (uint256) {
        return entries.length;
    }
}
