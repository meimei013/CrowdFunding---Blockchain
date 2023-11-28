//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }
    
    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _amountCollected, uint256 _deadline) public returns (uint256){
        //im using storage intead of memory, as this is gonna be a state change
        Campaign storage campaign = campaigns[numberOfCampaigns];
        require(campaign.deadline < block.timestamp, "The deadline must be date in the futre");

        campaign.title = _title;
        campaign.owner = _owner;
        campaign.deadline = _deadline;
        campaign.description = _description;
        campaign.target = _target;
        campaign.amountCollected = _amountCollected;
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateCampaign9(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value:amount}("");
        if(sent){
            campaign.amountCollected += amount;
        }

    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory){
        Campaign[] memory allCampaigns =  new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }




}