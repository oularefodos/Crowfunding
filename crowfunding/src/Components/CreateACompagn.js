import { useContext, useState } from "react";
import ContractContext from "../Context/ContractContext";
import { ethers } from "ethers";
import ContractAddress from "../Artifact/ContractAddress";
import abi from "../Artifact/Abi";

const Compang = () => {

    const [name, setName] = useState('');
    const [Amount, setAmount] = useState(0);
    const [deadline, setDeadline] = useState(0);
    const [email, setEmail] = useState('');
    const [des, setDes] = useState('');
    const ContextValue = useContext(ContractContext)
    const {Provider, Contract, UserAddress} = ContextValue;


    const HandleChange = (value, n) => {
        if (isNaN(value))
            alert ("erreur");
        else if (n)
            setAmount (parseInt(value))
        else if (!n)
            setDeadline (parseInt(value))
    }

    const submit = async (e) => {
        e.preventDefault();
        if (name === '' || Amount <= 0 || Amount > 100  || deadline <= 0 || deadline > 90 ||  email === '' || des == '')
            alert ("erreur");
        else
        {
            const signer = Provider.getSigner();
            const contract = new ethers.Contract(ContractAddress, abi, signer);
            const ret = await contract.createCampaign(name, email, des, Amount, deadline)
            await ret.wait;
        }
    }
    return (
        <div className="form">
            <form>
              <input type="text" placeholder="ProjectName" onChange={e => setName(e.target.value)}></input> <br/>
              <input type="text" placeholder="Amount" onChange={e => HandleChange(e.target.value, 1)} ></input> <br/>
              <input type="text" placeholder="Deadline in days" onChange={e => HandleChange(e.target.value, 0)}></input> <br/>
              <input  type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}></input> <br/>
              <textarea className="descp"  type="text" placeholder="Description" onChange={e => setDes(e.target.value)}></textarea> <br/>
              <button onClick={e => submit(e)}>Create Compagn</button>
          </form>
        </div>
    )
}

export default Compang;