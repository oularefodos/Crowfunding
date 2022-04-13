import { ethers } from "ethers";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import abi from "../Artifact/Abi";
import ContractAddress from "../Artifact/ContractAddress";
import { useState } from "react";
import ContractContext from "../Context/ContractContext";
const Nav = () => {

    const contextValue = useContext(ContractContext)
    const {UserAddress, setUserAddress} = contextValue;
    const [balance, setBalance] = useState();
    const connect = async() => {
        if (UserAddress === "")
        {
          if (window.ethereum)
          {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            setUserAddress(await signer.getAddress());
            const contract = new ethers.Contract(ContractAddress, abi, signer);
            const value = await contract.getBalance();
            await value.wait;
            const rep = parseInt(value._hex) / 10 ** 18;
            setBalance(rep)
          }
        }
        else
          setUserAddress("");
      }
    return (
    <div className="nav">
        <div className="navigation">
        <NavLink to="/Compagn" className="link">Create Compagn</NavLink>
        <NavLink to="/" className="link">Home</NavLink>
        <NavLink to="/MyCompagn" className="link">My Compagn</NavLink>
        </div>
        <button className="connect" onClick={connect}>{UserAddress === "" ? ("Connect Metamask") : ("disconnect")}</button>
        {
          UserAddress === "" ? ("")
           :
           (
            <div className="UserInfo">
            <p className="overflow-ellipsis">address: {UserAddress}</p>
            <p>Balance: {balance} eth</p>
          </div>
          )
        }
     
    </div>
    )
 
}

export default Nav;