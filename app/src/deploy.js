import { ethers } from 'ethers';
import { Abi, bytecode } from './contractDetails';

export default async function deploy(signer, arbiter, beneficiary, value) {
  const factory = new ethers.Contract(
    Abi,
    bytecode,
    signer
  );
  return factory;
}
