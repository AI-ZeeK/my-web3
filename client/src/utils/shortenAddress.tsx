export const shortenAddress = (address: string) =>
	`${address.slice(0, 5)}...${address.length - 4}`;
