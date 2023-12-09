// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AuditEscrow.sol"; // Import your AuditEscrow contract

contract ProjectFactory {
    AuditEscrow[] public deployedProjects;
    mapping(string => address) public projectToEscrow;

    function createProject(string memory projectId, address _auditor, uint _amount) public {
        AuditEscrow newProject = new AuditEscrow(msg.sender, _auditor, _amount);
        deployedProjects.push(newProject);
        projectToEscrow[projectId] = address(newProject);
    }

    function getDeployedProjects() public view returns (AuditEscrow[] memory) {
        return deployedProjects;
    }

    function getEscrowAddress(string memory projectId) public view returns (address) {
        return projectToEscrow[projectId];
    }
}
