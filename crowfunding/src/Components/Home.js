import { useContext, useEffect, useState } from "react";
import ContractContext from "../Context/ContractContext";
import { ethers } from "ethers";
import ContractAddress from "../Artifact/ContractAddress";
import abi from "../Artifact/Abi";

const Home = () => {


    const hide = "hide"
    const show = "show"
    const [isShow, setIsShow] = useState('');
    const [Amount, setAmount] = useState (0);
    const [datas, setdata] = useState([]);



    const HandleChange = (value) => {
        if (isNaN(value))
            alert ("erreur");
        else
        {
            console.log(value);
            setAmount (Number.parseFloat(value).toFixed(5))
            console.log(Amount);
        }
    }

    const MakeDon = async (e, address) => {
        e.preventDefault();
        console.log(Amount);
        if (Amount <= 0 || Amount > 100)
            alert ("erreur");
        else
        {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(ContractAddress, abi, signer);
            const amount = BigNumber.from(Amount).mul(BigNumber.from(10).pow(18));
            console.log(typeof(amount))
            const ret = await contract.donate(amount, address);
            await ret.wait;
        }
    }

    const getdata = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const data = await contract.getAllCompagn();
        await data.wait;
        setdata(data);

        // const datap = await contract.getContractBalance();
        // await datap.wait;
        // console.log(parseInt(datap) / 10**18)
   }

   const displayDon = (e) => {
       if (e === isShow)
            setIsShow('')
        else
            setIsShow(e);
   }

   useEffect(() => {
       getdata();
       console.log(datas)
   }, [])

    return (
        <div className="formation">
            { datas.map(data => {
                   return (
                    <div>
                        <h1> {data.name}</h1>
                        <p className="desp"> {data.description} </p>
                        <span> Valeur: {parseInt(data.Amount._hex) / 10 ** 18} ethers</span>
                        <span> {data.imageLink} </span>
                        <span>Valeur recolté: {parseInt(data.currentAmount._hex) / 10 ** 18} ethers </span>
                        <button className="donate" onClick={() => displayDon(data.owner)}>Donate</button>
                        <form className={isShow === data.owner ? (show) : (hide)}>
                            <input type="text" placeholder="Amount" onChange={e => HandleChange(e.target.value)}></input> <br/>
                            <button className="donate" onClick={e => MakeDon(e, data.owner)}>Confirm</button>
                        </form>
                    </div>
               )
            })
            }
        </div>
    )
}

export default Home;