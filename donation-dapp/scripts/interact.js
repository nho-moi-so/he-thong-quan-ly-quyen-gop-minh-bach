import { ethers } from "ethers";
import "dotenv/config";

// RPC URL Sepolia và Private Key của bạn
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const CONTRACT_ADDRESS = "0xda20CB062C8003e6b16D6A4B6e30eB74831657f3";
const CONTRACT_ABI = [
  {"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"}],"name":"CampaignClosed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"uint256","name":"goal","type":"uint256"}],"name":"CampaignCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Donated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaigns","outputs":[{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"goal","type":"uint256"},{"internalType":"uint256","name":"fundsRaised","type":"uint256"},{"internalType":"bool","name":"isOpen","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"closeCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_goal","type":"uint256"}],"name":"createCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"donations","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAllCampaigns","outputs":[{"components":[{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"goal","type":"uint256"},{"internalType":"uint256","name":"fundsRaised","type":"uint256"},{"internalType":"bool","name":"isOpen","type":"bool"}],"internalType":"struct Donation.Campaign[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"},{"internalType":"address","name":"_donor","type":"address"}],"name":"getDonationAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}
];


async function main() {
  console.log("Using account:", signer.address);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  // Lấy tất cả campaign
  const campaigns = await contract.getAllCampaigns();
  console.log("All campaigns:", campaigns);

  // Lấy số tiền bạn đã donate vào campaign 0
  const donationAmount = await contract.getDonationAmount(0, signer.address);
  console.log("Your donation to campaign 0:", ethers.formatEther(donationAmount));

  // Ví dụ donate vào campaign 0
  // const tx = await contract.donate(0, { value: ethers.parseEther("0.001") });
  // await tx.wait();
  // console.log("Donated 0.001 ETH to campaign 0");
}

main().catch(console.error);
