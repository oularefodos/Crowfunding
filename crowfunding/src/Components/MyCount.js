import { useContext, useEffect } from "react";
import ContractContext from "../Context/ContractContext";
import { ethers } from "ethers";
import ContractAddress from "../Artifact/ContractAddress";
import abi from "../Artifact/Abi";
import { useState } from "react";

const MyCount = () => {

    const ContextValue = useContext(ContractContext)
    const [show, setShow] = useState('hide');
    const {Provider, Contract, UserAddress} = ContextValue;
    const [balance, setBalance] = useState(0)

    const getUserInfo = async() => {
        if (UserAddress != '')
        {
            const signer = Provider.getSigner();
            const contract = new ethers.Contract(ContractAddress, abi, signer);
            const value = await contract.getBalance();
            await value.wait;
            const rep = parseInt(value._hex) / 10 ** 18;
            setBalance(rep);
        }
    }

    const ChangeClass = () => {
        if (show === 'hide')
            setShow('show')
        else
            setShow('hide');
    }

    useEffect(() => {
        getUserInfo();
    })

    if (UserAddress === '')
    {
        return (
            <div>
                <h1>Veillez vous Connecter a metamask</h1>
            </div>
        )
    }
    else
    {
        return (
            <div className="profile">
                <div className="wallet">
                    <h1 className="addr"> <span>Mon Compt:</span> {UserAddress} </h1>
                    <p className="balance"> Mon solde: {balance} eth</p>
                    <button onClick={ChangeClass}>Retrait</button>
                    <form className={show}>
                        <input type="text" placeholder="Amount"></input> <br/>
                        <button className="donate" onClick={e => {}}>Confirm</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default MyCount;