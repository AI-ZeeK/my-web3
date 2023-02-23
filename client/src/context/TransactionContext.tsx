import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../utils/constants";

export const TransactionContext: any = React.createContext([]);

const { ethereum }: any = window;
const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const transactionContract = new ethers.Contract(
		contractAddress,
		contractAbi,
		signer
	);
	console.log({ provider, signer, transactionContract });
	return transactionContract;
};

const TransactionProvider = ({ children }: any) => {
	const [currentAccount, setCurrentAccount] = useState("");
	const [formData, setFormData] = useState({
		addressTo: "",
		amount: "",
		keyword: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [transactionCount, setTransactionCount] = useState(
		localStorage.getItem("transactionCount")
	);
	const handleChange = (e: any, name: any) => {
		setFormData((prevState) => ({
			...prevState,
			[name]: e.target.value,
		}));
	};
	const checkIfWalletIsConnected = async () => {
		try {
			if (!ethereum) return alert("Please install Metmask");
			const accounts = await ethereum.request({
				method: "eth_accounts",
			});
			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log(" no accounts found");
			}
			console.log(accounts);
		} catch (error) {
			console.log(error);
			throw new Error("No Ethereum Object");
		}
	};
	const sendTransaction = async () => {
		try {
			if (!ethereum) return alert("PLease Install Metamask");
			const { addressTo, amount, keyword, message } = formData;
			const transactionContract = getEthereumContract();
			const parsedAmount = ethers.utils.parseEther(amount);
			await ethereum.request({
				method: "eth_sendTransaction",
				params: [
					{
						from: currentAccount,
						to: addressTo,
						gas: "0x5208", // 21000 gwei,
						value: parsedAmount._hex, // 0.0001
					},
				],
			});
			const transactionHash = await transactionContract.addToBlockchain(
				addressTo,
				parsedAmount,
				message,
				keyword
			);
			setIsLoading(true);
			console.log(`loading - ${transactionHash.hash}`);
			await transactionHash.wait();
			setIsLoading(false);
			console.log(`Success - ${transactionHash.hash}`);

			const transactionCount = await transactionContract.getTransactionCount();
			setTransactionCount(transactionCount.toNumber());
		} catch (error) {
			console.log(error);
			throw new Error("No Ethereum Object");
		}
	};
	const connectWallet = async () => {
		try {
			if (!ethereum) return alert("Please install Metmask");
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
			throw new Error("No Ethereum Object");
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<TransactionContext.Provider
			value={{
				connectWallet,
				currentAccount,
				formData,
				setFormData,
				handleChange,
				sendTransaction,
			}}>
			{children}
		</TransactionContext.Provider>
	);
};

export default TransactionProvider;
