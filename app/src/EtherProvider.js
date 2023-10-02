import {ethers} from 'ethers'
import { factoryAddress, factoryAbi } from './Factory';
import Swal from 'sweetalert2';
export const etherConnection = async() => {
  let userAddress = null; 
  let escrowAddress = null;
  let signer = null;
  let provider = null

  if (window.ethereum) {
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((error) => {
        console.error("Error connecting to Metamask:", error);
      });

    try{
  provider = new ethers.providers.Web3Provider(window.ethereum);
     signer = await provider.getSigner();
     userAddress = await signer.getAddress();

    const factoryInstance = new ethers.Contract(factoryAddress, factoryAbi, provider);
    escrowAddress = await factoryInstance.getDeployedEscrows();
    

    } catch(err){
      Swal.fire({
        text: `${err}`,
        icon: "error",
        padding: "3em",
        color: "#716add",
        backdrop: `rgba(0,0,0,0.8)`,
      });
    }
    return {provider, signer, userAddress, escrowAddress};

  } else {
    alert("Metamask Not Found");
  }
}