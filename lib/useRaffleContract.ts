import { useChainId } from 'wagmi';
import { chainsToContracts, raffleAbi } from '@/constants';

export function useRaffleContract() {
  const chainId = useChainId();
  const contractAddress = chainsToContracts[chainId]?.raffle;

  return {
    address: contractAddress as `0x${string}` | undefined,
    abi: raffleAbi,
    chainId,
  };
}
