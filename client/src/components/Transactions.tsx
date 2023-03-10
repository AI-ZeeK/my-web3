import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { dummyData } from "../utils/Dummy";
import { shortenAddress } from "../utils/shortenAddress";
import useFetch from "../hooks/useFetch";

const TransactionCard = ({
	addressTo,
	addressFrom,
	timestamp,
	message,
	url,
	keyword,
	amount,
}: any) => {
	const gifUrl = useFetch({ keyword });
	return (
		<div
			className="bg-[#181918] m-4 flex flex-1 
	2xl:min-w-[450px]
	2xl:max-w-[500px]
	sm:min-w-[270px]
	sm:max-w-[300px]
	flex-col p-3 rounded-md hover:shadow-2xl
">
			<div className="flex flex-col items-center w-full mt-3">
				<div className=" w-full mb-6 p-2 gap-2">
					<a
						target="_blank"
						href={`https://goerli.etherscan.io/address/${addressFrom}`}>
						<p className="text-white text-base ">
							From: {shortenAddress(addressFrom)}
						</p>
					</a>
					<a
						target="_blank"
						href={`https://goerli.etherscan.io/address/${addressTo}`}>
						<p className="text-white text-base ">
							To: {shortenAddress(addressTo)}
						</p>
					</a>
					<p className="text-white text-base">Amount: {amount} ETH</p>
					{message && (
						<>
							<br />
							<p className="text-white text-base">Message: {message}</p>
						</>
					)}
					<img
						src={gifUrl || url}
						alt="gif"
						className="w-full h-64 2x:h-96  rounded-md shadow-lg object-cover"
					/>

					<div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
						<p className="text-[#37c7da] font-bold ">{timestamp} </p>
					</div>
				</div>
			</div>
		</div>
	);
};

const Transactions = () => {
	const { currentAccount }: any = useContext(TransactionContext);
	return (
		<div className="flex w-full justify-center 2xl:px-20 gradient-bg-transactions ">
			<div className="flex flex-col md:p-12 py-12 px-4 ">
				{currentAccount ? (
					<h3 className="text-white text-3xl text-center my-2">
						Latest Transactions
					</h3>
				) : (
					<h3 className="text-white text-3xl text-center my-2">
						Connect your account to see te latest transactions
					</h3>
				)}
				<div className="flex flex-wrap justify-center items-center">
					{dummyData.reverse().map((transaction, index) => (
						<TransactionCard key={index} {...transaction} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Transactions;
