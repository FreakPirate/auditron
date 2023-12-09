// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditEscrow {
    address public stakeholder;
    address public auditor;
    uint public amount;
    bool public auditComplete;

    constructor(address _auditor, uint _amount) {
        stakeholder = msg.sender;
        auditor = _auditor;
        amount = _amount;
    }

    function deposit() external payable {
        require(msg.sender == stakeholder, "Only stakeholder can deposit");
        require(msg.value == amount, "Incorrect deposit amount");
    }

    function releaseFunds() external {
        require(msg.sender == stakeholder, "Only stakeholder can release funds");
        require(auditComplete, "Audit is not complete");
        payable(auditor).transfer(address(this).balance);
    }

    function completeAudit() external {
        require(msg.sender == auditor, "Only auditor can complete audit");
        auditComplete = true;
    }

    function refundStakeholder() external {
        require(msg.sender == stakeholder, "Only stakeholder can refund");
        require(!auditComplete, "Audit is already complete");
        payable(stakeholder).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
