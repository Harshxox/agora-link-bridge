// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgoraVault
 * @dev A compliance-locked vault that releases funds only after AI approval.
 */
contract AgoraVault is Ownable, ReentrancyGuard {
    
    // Mapping to track if a transaction ID has passed AI Compliance
    mapping(bytes32 => bool) public compliancePassed;
    
    event Deposit(address indexed user, uint256 amount, bytes32 indexed txId);
    event Settlement(address indexed user, uint256 amount, bytes32 indexed txId);
    event ComplianceFlagged(bytes32 indexed txId, string reason);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Escrow funds for a transaction.
     */
    function depositFunds(bytes32 txId) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        emit Deposit(msg.sender, msg.value, txId);
    }

    /**
     * @dev Gateway marks a transaction as AI-Cleared.
     */
    function setComplianceStatus(bytes32 txId, bool status) external onlyOwner {
        compliancePassed[txId] = status;
        if (!status) {
            emit ComplianceFlagged(txId, "AI Engine detected high risk");
        }
    }

    /**
     * @dev Releases funds to the recipient only if compliance check is passed.
     */
    function settlePayment(address payable recipient, uint256 amount, bytes32 txId) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(compliancePassed[txId], "Compliance check not passed for this TX");
        require(address(this).balance >= amount, "Insufficient vault balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit Settlement(recipient, amount, txId);
    }

    // Function to check vault balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}