import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from ethers;
import { CrowdFunding, abi } from "./constants";

const fetchContract = (signerProvider) => 
    new ethers.Contract(CrowdFunding, abi, signer, signerProvider);

export const CrowdFundingContext = React.createContext();
export const CrowdFundingProvider = ({ children }) => {
    const titleData = "Crowd Funding Data";
    const [currentAccount, setCurrentAccount] = useState("");
    const createCampaign = async (campaign) => {
        const { title, description, amount, deadline } = campaign;
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        console.log("contract>>>", contract);
        console.log("currentAccount>>>", currentAccount)

        try {
            const transaction = await contract.createCampaign(
                currentAccount,
                title,
                description,
                ethers.utils.parseUnits(amount, 18),
                new Date(deadline).getTime()
            )
            await transaction.wait();
            console.log("contract call success>>>", transaction);
            
        } catch (error) {
            console.log("contract call failure")
        }
    }

    const getCampaign = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaign();

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.stoString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString(),
            ),
            pId: i,

        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const provider = new ethers.provider.JsonRpcProvider();
        console.log("provider", provider);
        const contract = fetchContract(provider);

        const allCampaigns = await contract.getCampaign();

        const accounts = await window.ethereum.request({
            method:"eth_accounts",
        })
        const currentUser = accounts[0];
        const filteredCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        );

        const userData = filteredCampaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.stoString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString(),
            ),
            pId: i,
        }))

    }
}    


