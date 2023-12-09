import { ethers } from 'ethers';
import AuditFactoryABI from './AuditFactoryABI.json';
import AuditEscrowABI from './AuditEscrowABI.json';

const CONTRACT_ADDRESS = '0x390B9D0aF4b4F0cE5E1ACB3CbB9304141C0FA6FD';

export class ContractAdapter {
	private signer: ethers.Signer;
	private contract: ethers.Contract;

	constructor(signer: ethers.Signer) {
		this.signer = signer;
		this.contract = new ethers.Contract(CONTRACT_ADDRESS, AuditFactoryABI, signer);
	}

	public async createProject(projectId: string, auditor: string, amount: number) {
		try {
			const tx = await this.contract.createProject(projectId, auditor, amount);
			await tx.wait();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	public async getProject(projectId: string) {
		const escrowAddress = await this.contract.getEscrowAddress(projectId);
		// check if address is valid
		if (escrowAddress === ethers.constants.AddressZero) {
			return null;
		}

		return new ethers.Contract(escrowAddress, AuditEscrowABI, this.signer);
	}

	public async deposit(projectId: string, amount: number) {
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

	public async completeAudit(projectId: string) {
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

	public async releaseFunds(projectId: string) {
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

	public async refundStakeholder(projectId: string) {
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
	//@ts-ignore
	if (!window.ethereum) {
		throw new Error('MetaMask is not installed!');
	}

	//@ts-ignore
	const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	await provider.send('eth_requestAccounts', []); // Request access to MetaMask
	return provider.getSigner();
};
