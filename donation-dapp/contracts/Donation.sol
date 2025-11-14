// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
// Thêm dòng này để import ReentrancyGuard từ OpenZeppelin
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Contract kế thừa từ ReentrancyGuard
contract Donation is ReentrancyGuard { 
    struct Campaign {
        address payable owner;    
        string title;             
        string description;       
        uint256 goal;             
        uint256 fundsRaised;      
        bool isOpen;              
    }

    Campaign[] public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;

    event CampaignCreated(uint256 campaignId, address owner, string title, uint256 goal);
    event Donated(uint256 campaignId, address from, uint256 amount);
    event Withdrawn(uint256 campaignId, uint256 amount);
    event CampaignClosed(uint256 campaignId); // Đã thêm event mới

    function createCampaign(string memory _title, string memory _description, uint256 _goal) external {
        require(_goal > 0, "Goal must be > 0");
        campaigns.push(Campaign(payable(msg.sender), _title, _description, _goal, 0, true));
        emit CampaignCreated(campaigns.length - 1, msg.sender, _title, _goal);
    }

    function donate(uint256 _campaignId) external payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(_campaignId < campaigns.length, "Invalid campaign ID"); 
        require(campaign.isOpen, "Campaign closed");
        require(msg.value > 0, "Donation > 0");

        campaign.fundsRaised += msg.value;
        donations[_campaignId][msg.sender] += msg.value;

        emit Donated(_campaignId, msg.sender, msg.value);
    }

    // Đã thay uint255 thành uint256 và thêm nonReentrant
    function withdraw(uint256 _campaignId) external nonReentrant { 
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.owner, "Not owner");
        require(campaign.fundsRaised > 0, "No funds");
        require(campaign.isOpen, "Campaign closed");

        uint256 amount = campaign.fundsRaised;
        campaign.fundsRaised = 0;

        // Sử dụng .call thay vì .transfer để tránh giới hạn Gas
        (bool success, ) = payable(campaign.owner).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(_campaignId, amount);
    }
    
    function closeCampaign(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.owner, "Not owner");
        require(campaign.isOpen, "Campaign already closed");
        
        campaign.isOpen = false;
        emit CampaignClosed(_campaignId);
    }

    function getDonationAmount(uint256 _campaignId, address _donor) 
        external view returns (uint256) 
    {
        return donations[_campaignId][_donor];
    }
    
    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }
}