import './App.css';
import { ethers  } from 'ethers';
import ContractAddress from './Artifact/ContractAddress';
import abi from './Artifact/Abi';
import { useEffect, useState } from 'react';
import ContractContext from './Context/ContractContext'
import Nav from './Components/Nav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Compang from './Components/CreateACompagn';

function App() {

  const [Provider, setProvider] = useState();
  const [Contract, setContrcat] = useState();
  const [data, setData] = useState([]);
  const [UserAddress, setUserAddress] = useState("");



  const getdata = async() => {
    if (window.ethereum)
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ContractAddress, abi, signer);
      await contract.wait;
      setContrcat (await contract);
      console.log(Contract);
    }
  }

  useEffect(() => {
    getdata();
  }, [])

  const context = {Provider, Contract, UserAddress, setUserAddress};

  return (
    <ContractContext.Provider value={context}>
      <div className="app">
        <BrowserRouter>
        <Nav></Nav>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/Compagn" element={<Compang/>}></Route>
        </Routes>
        </BrowserRouter>
      </div>
    </ContractContext.Provider>
  );
}

export default App;
