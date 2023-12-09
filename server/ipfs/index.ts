import axios from 'axios';

export async function uploadToIpfs(file: File) {
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

	let data = new FormData();
	data.append('file', file);

	const metadata = JSON.stringify({
		name: 'File name',
	});
	data.append('pinataMetadata', metadata);

	const options = JSON.stringify({
		cidVersion: 0,
	});
	data.append('pinataOptions', options);

	const res = await axios.post(url, data, {
		maxBodyLength: 10000000000,
		headers: {
			Authorization: `Bearer ${process.env.PINATA_JWT}`,
		},
	});
	return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}
