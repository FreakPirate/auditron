import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import pinataSDK from '@pinata/sdk';
import cors from 'cors';
import { UserRole } from './firestore/types';
import {
	assignAuditorToProject,
	createNewAuditFile,
	createNewBid,
	createNewProject,
	createNewUser,
	getActiveBidProjectsForStakeholder,
	getActiveProjects,
	getAvailableBidProjectsForAuditor,
	getBidsForProject,
	getCompletedProjects,
	updateProjectAiAuditStatus,
	updateProjectAuditorId,
	updateProjectManualAuditStatus,
	updateProjectStatus,
} from './firestore/adapter';
import { generateAuditReport } from './gpt';

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
app.use(cors());

const InfuraAuth = Buffer.from(process.env.INFURA_API_KEY + ':' + process.env.INFURA_API_KEY_SECRET).toString('base64');

// The chain ID of the supported network
const lineaChainId = '59140';

app.get('/', (req, res) => {
	res.send('Hello, TypeScript with Express!');
});

app.post('/file/upload', upload.single('file'), async (req, res) => {
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
	const fileUrl = `https://gateway.pinata.cloud/ipfs/${pinataRes.IpfsHash}`;
	return res.status(200).json({ ...pinataRes, url: fileUrl });
});

app.get('/api/audit-report/:fileUrl', async (req: Request, res: Response) => {
	try {
		const fileUrl = req.params.fileUrl as string;
		const auditReport = await generateAuditReport(fileUrl);
		res.status(200).json({
			data: auditReport,
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.get('/api/active-projects/:userId/:role', async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId as string;
		const role = req.params.role as UserRole;
		const projects = await getActiveProjects(userId, role);
		res.status(200).json({
			data: projects,
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.get('/api/completed-projects/:userId/:role', async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId as string;
		const role = req.params.role as UserRole;
		const projects = await getCompletedProjects(userId, role);
		res.status(200).json({
			data: projects,
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.get('/api/active-bid-projects/stakeholder/:stakeholderId', async (req: Request, res: Response) => {
	try {
		const stakeholderId = req.params.stakeholderId as string;
		const projects = await getActiveBidProjectsForStakeholder(stakeholderId);
		res.status(200).json({
			data: projects,
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.get('/api/bids/project/:projectId', async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId as string;
		const bids = await getBidsForProject(projectId);
		res.status(200).json({
			data: bids,
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.get('/api/available-bid-projects/auditor/:auditorId', async (req: Request, res: Response) => {
	try {
		const auditorId = req.params.auditorId as string;
		const projects = await getAvailableBidProjectsForAuditor(auditorId);
		res.status(200).json({
			data: projects,
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.post('/api/project', async (req: Request, res: Response) => {
	try {
		const newProject = req.body;
		await createNewProject(newProject);
		res.status(200).json({
			message: 'Project created successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.post('/api/bid', async (req: Request, res: Response) => {
	try {
		const newBid = req.body;
		await createNewBid(newBid);
		res.status(200).json({
			message: 'Bid created successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.patch('/api/project/status/:projectId', async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId as string;
		const status = req.body.status;
		updateProjectStatus(projectId, status);
		res.status(200).json({
			message: 'Project status updated successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.patch('/api/project/manual-audit-status/:projectId', async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId as string;
		const status = req.body.status;
		updateProjectManualAuditStatus(projectId, status);
		res.status(200).json({
			message: 'Project manual audit status updated successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.patch('/api/project/ai-audit-status/:projectId', async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId as string;
		const status = req.body.status;
		updateProjectAiAuditStatus(projectId, status);
		res.status(200).json({
			message: 'Project AI audit status updated successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.patch('/api/project/auditor/:projectId', async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId as string;
		const auditorId = req.body.auditorId;
		updateProjectAuditorId(projectId, auditorId);
		res.status(200).json({
			message: 'Project auditor ID updated successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.post('/api/user', async (req: Request, res: Response) => {
	try {
		const newUser = req.body;
		await createNewUser(newUser);
		res.status(200).json({
			message: 'User created successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.post('/api/audit-file', async (req: Request, res: Response) => {
	try {
		const newAuditFile = req.body;
		await createNewAuditFile(newAuditFile);
		res.status(200).json({
			message: 'Audit file created successfully',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.patch('/api/project/assign-auditor/:projectId', async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId as string;
		await assignAuditorToProject(projectId);
		res.status(200).json({
			message: 'Auditor assigned successfully!',
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

app.get('/api/estimated-gas', async (req: Request, res: Response) => {
	try {
		const { data } = await axios.get(`https://gas.api.infura.io/networks/${lineaChainId}/suggestedGasFees`, {
			headers: {
				Authorization: `Basic ${InfuraAuth}`,
			},
		});
		console.log('Suggested gas fees:', data);
		return res.status(200).json(data);
	} catch (error) {
		console.log('Server responded with:', error);
		return res.status(500).json({ message: error });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
