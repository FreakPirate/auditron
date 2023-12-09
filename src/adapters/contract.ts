import { ethers } from 'ethers';
import AuditFactoryABI from '../../contracts/AuditFactoryABI.json';
import AuditEscrowABI from '../../contracts/AuditEscrowABI.json';

const CONTRACT_ADDRESS = '0x931f9FB16f8a5260CfE66E290C2284a6575Fdecf';

export class ContractAdapter {
	private signer: ethers.Signer;
	private contract: ethers.Contract;

	constructor(signer: ethers.Signer) {
		this.signer = signer;
		this.contract = new ethers.Contract(CONTRACT_ADDRESS, AuditFactoryABI, signer);
	}

	async createProject(auditor: string, amount: number) {
		try {
			const tx = await this.contract.createProject(auditor, amount);
			await tx.wait();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async getProject(projectId: string) {
		const escrowAddress = await this.contract.getEscrowAddress(projectId);
		// check if address is valid
		if (escrowAddress === ethers.constants.AddressZero) {
			return null;
		}

		return new ethers.Contract(escrowAddress, AuditEscrowABI, this.signer);
	}

	async deposit(projectId: string, amount: number) {
		try {
			const project = await this.getProject(projectId);
			if (!project) {
				throw new Error('Invalid project ID');
			}

			const tx = await project.deposit({ value: amount });
			await tx.wait();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async completeAudit(projectId: string) {
		try {
			const project = await this.getProject(projectId);
			if (!project) {
				throw new Error('Invalid project ID');
			}

			const tx = await project.completeAudit();
			await tx.wait();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async releaseFunds(projectId: string) {
		try {
			const project = await this.getProject(projectId);
			if (!project) {
				throw new Error('Invalid project ID');
			}

			const tx = await project.releaseFunds();
			await tx.wait();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async refundStakeholder(projectId: string) {
		try {
			const project = await this.getProject(projectId);
			if (!project) {
				throw new Error('Invalid project ID');
			}

			const tx = await project.refundStakeholder();
			await tx.wait();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}

export const getSigner = async () => {
	// Connect to Ethereum using Ethers.js and MetaMask
	if (!window.ethereum) {
		throw new Error('MetaMask is not installed!');
	}

	const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	await provider.send('eth_requestAccounts', []); // Request access to MetaMask
	return provider.getSigner();
};
