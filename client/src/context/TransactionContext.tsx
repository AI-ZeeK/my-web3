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
	const [transactions, setTransactions] = useState([]);
	const handleChange = (e: any, name: any) => {
		setFormData((prevState) => ({
			...prevState,
			[name]: e.target.value,
		}));
	};

	const getAllTransactions = async () => {
		try {
			if (!ethereum) return alert("Please install Metamask");
			if (ethereum) {
				const transactionsContract = getEthereumContract();

				const availableTransactions =
					await transactionsContract.getAllTransactions();
				const structuredTransactions = availableTransactions.map(
					(transaction: any) => ({
						addressTo: transaction.receiver,
						addressFrom: transaction.sender,
						timestamp: new Date(
							transaction.timestamp.toNumber() * 1000
						).toLocaleString(),
						message: transaction.message,
						keyword: transaction.keyword,
						amount: parseInt(transaction.amount._hex) / 10 ** 18,
					})
				);

				console.log(structuredTransactions);

				setTransactions(structuredTransactions);
			} else {
				console.log("Ethereum is not present");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const checkIfWalletIsConnected = async () => {
		try {
			if (!ethereum) return alert("Please install Metmask");
			const accounts = await ethereum.request({
				method: "eth_accounts",
			});
			if (accounts.length) {
				setCurrentAccount(accounts[0]);
				getAllTransactions();
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
		// try {0x923219D7868143fAa5c40d21C4755074A8Cf57d2
		try {
			if (!ethereum) return alert("Please Install Metamask");
			const { addressTo, amount, keyword, message } = await formData;
			const transactionContract = await getEthereumContract();
			const parsedAmount = await ethers.utils.parseEther(amount);
			console.log(transactionContract, parsedAmount);
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
			const transactionHash = await transactionContract.addtoblockchain(
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
			window.location.reload();
		} catch (error) {
			console.log(error);
			throw new Error("No Ethereum Object");
		}
	};
	const checkIfTransactionsExists = async () => {
		try {
			if (ethereum) {
				const transactionsContract = getEthereumContract();
				const currentTransactionCount =
					await transactionsContract.getTransactionCount();

				window.localStorage.setItem(
					"transactionCount",
					currentTransactionCount
				);
			}
		} catch (error) {
			console.log(error);

			throw new Error("No ethereum object");
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
