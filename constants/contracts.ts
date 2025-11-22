// AaveLottery Contract Configuration
// ⚠️ WARNING: This address is from Sepolia - you need to deploy to Base Mainnet and update this!
export const AAVE_LOTTERY_ADDRESS = "0x4a5551407D6DbB026E29A8f53fBA7215945cd5f8" as const;

// USDC Token on Base Mainnet (Production)
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const; // Base Mainnet USDC

// USDC Token on Base Sepolia (Testnet)
// export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const; // Base Sepolia USDC

export const AAVE_LOTTERY_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_roundDuration", "type": "uint256" },
      { "internalType": "address", "name": "_underlying", "type": "address" },
      { "internalType": "address", "name": "_aavePool", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "roundId", "type": "uint256" }],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "enter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "roundId", "type": "uint256" }],
    "name": "exit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "roundId", "type": "uint256" }],
    "name": "getRound",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "uint256", "name": "totalStake", "type": "uint256" },
          { "internalType": "uint256", "name": "award", "type": "uint256" },
          { "internalType": "uint256", "name": "winnerTicket", "type": "uint256" },
          { "internalType": "address", "name": "winner", "type": "address" },
          { "internalType": "uint256", "name": "scaledBalanceStake", "type": "uint256" }
        ],
        "internalType": "struct AaveLottery.Round",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getTicker",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "stake", "type": "uint256" },
          { "internalType": "uint256", "name": "segmentStart", "type": "uint256" },
          { "internalType": "bool", "name": "exited", "type": "bool" }
        ],
        "internalType": "struct AaveLottery.Ticket",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "roundDuration",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "rounds",
    "outputs": [
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "totalStake", "type": "uint256" },
      { "internalType": "uint256", "name": "award", "type": "uint256" },
      { "internalType": "uint256", "name": "winnerTicket", "type": "uint256" },
      { "internalType": "address", "name": "winner", "type": "address" },
      { "internalType": "uint256", "name": "scaledBalanceStake", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "tickets",
    "outputs": [
      { "internalType": "uint256", "name": "stake", "type": "uint256" },
      { "internalType": "uint256", "name": "segmentStart", "type": "uint256" },
      { "internalType": "bool", "name": "exited", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "underlying",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
