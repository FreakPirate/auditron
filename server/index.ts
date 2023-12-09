import express from 'express';
import 'dotenv/config';
import multer from 'multer';
import fs from 'fs';
import pinataSDK from '@pinata/sdk';

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

app.get('/', (req, res) => {
	res.send('Hello, TypeScript with Express!');
});

app.post('/ipfs/upload', upload.single('file'), async (req, res) => {
	console.log('received file to be uploaded on IPFS => ', req.file?.path, req.body);

	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}

	const stream = fs.createReadStream(req.file.path);
	const pinataRes = await pinata.pinFileToIPFS(stream, {
		pinataMetadata: {
			name: req.file.originalname,
		},
		pinataOptions: {
			cidVersion: 0,
		},
	});
	console.log('Response from Pinata => ', pinataRes);
	return res.status(200).json({ ...pinataRes, url: `https://gateway.pinata.cloud/ipfs/${pinataRes.IpfsHash}` });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
