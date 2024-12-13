import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x0498B7c793D7432Cd9dB27fb02fc9cfdBAfA1Fd3';
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "patientID", type: "uint256" },
      { internalType: "string", name: "patientName", type: "string" },
      { internalType: "string", name: "diagnosis", type: "string" },
      { internalType: "string", name: "treatment", type: "string" }
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "provider", type: "address" }],
    name: "authorizeProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "patientID", type: "uint256" }],
    name: "getPatientRecords",
    outputs: [{
      components: [
        { internalType: "uint256", name: "recordID", type: "uint256" },
        { internalType: "string", name: "patientName", type: "string" },
        { internalType: "string", name: "diagnosis", type: "string" },
        { internalType: "string", name: "treatment", type: "string" },
        { internalType: "uint256", name: "timestamp", type: "uint256" }
      ],
      internalType: "struct HealthcareRecords.Record[]",
      name: "",
      type: "tuple[]"
    }],
    stateMutability: "view",
    type: "function"
  }
];

const Healthcare = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [newProvider, setNewProvider] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [searchPatientId, setSearchPatientId] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const healthcareContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        const userAccount = await signer.getAddress();
        const contractOwner = await healthcareContract.getOwner();
        
        setContract(healthcareContract);
        setAccount(userAccount);
        setIsOwner(userAccount.toLowerCase() === contractOwner.toLowerCase());
        setLoading(false);
      } else {
        setError('Please install MetaMask!');
        setLoading(false);
      }
    } catch (err) {
      setError('Error connecting to wallet: ' + err.message);
      setLoading(false);
    }
  };

  const authorizeProvider = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await contract.authorizeProvider(newProvider);
      await tx.wait();
      setNewProvider('');
      setLoading(false);
    } catch (err) {
      setError('Error authorizing provider: ' + err.message);
      setLoading(false);
    }
  };

  const addRecord = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await contract.addRecord(patientId, patientName, diagnosis, treatment);
      await tx.wait();
      setPatientId('');
      setPatientName('');
      setDiagnosis('');
      setTreatment('');
      setLoading(false);
    } catch (err) {
      setError('Error adding record: ' + err.message);
      setLoading(false);
    }
  };

  const getRecords = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const records = await contract.getPatientRecords(searchPatientId);
      setPatientRecords(records);
      setLoading(false);
    } catch (err) {
      setError('Error fetching records: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Healthcare Records DApp</h1>
      
      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      <div className="mb-8">
        <p className="mb-2">Connected Account: {account || 'Not connected'}</p>
        <button 
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>

      {isOwner && (
        <div className="mb-8 p-4 border rounded">
          <h2 className="text-xl font-bold mb-4">Authorize Provider</h2>
          <form onSubmit={authorizeProvider}>
            <input
              type="text"
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              placeholder="Provider Address"
              className="w-full p-2 mb-2 border rounded"
            />
            <button 
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Authorize Provider
            </button>
          </form>
        </div>
      )}

      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Add Patient Record</h2>
        <form onSubmit={addRecord}>
          <input
            type="number"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Patient ID"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Diagnosis"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Treatment"
            className="w-full p-2 mb-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Record
          </button>
        </form>
      </div>

      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">View Patient Records</h2>
        <form onSubmit={getRecords} className="mb-4">
          <input
            type="number"
            value={searchPatientId}
            onChange={(e) => setSearchPatientId(e.target.value)}
            placeholder="Patient ID"
            className="w-full p-2 mb-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Records
          </button>
        </form>

        {patientRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Record ID</th>
                  <th className="p-2 text-left">Patient Name</th>
                  <th className="p-2 text-left">Diagnosis</th>
                  <th className="p-2 text-left">Treatment</th>
                  <th className="p-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {patientRecords.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{record.recordID.toString()}</td>
                    <td className="p-2">{record.patientName}</td>
                    <td className="p-2">{record.diagnosis}</td>
                    <td className="p-2">{record.treatment}</td>
                    <td className="p-2">
                      {new Date(Number(record.timestamp) * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Healthcare;