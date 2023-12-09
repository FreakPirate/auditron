import * as admin from 'firebase-admin';

export enum UserRole {
	STAKEHOLDER = 'stakeholder',
	AUDITOR = 'auditor',
	DEVELOPER = 'developer',
}

export type User = {
	id: string;
	safeGlobalId: string;
	username: string;
	email: string;
	displayName: string;
	profilePicture: string;
	signUpDate: admin.firestore.Timestamp;
	lastLogin: admin.firestore.Timestamp;
	role: UserRole;
	bio: string;
};

export enum AuditorStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}

export enum AuditStatus {
	BID = 'bid',
	PENDING = 'pending',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
}

export type Project = {
	id: string;
	projectName: string;
	stakeholderId: string;
	description: string;
	submissionDate: admin.firestore.Timestamp;
	deadline: admin.firestore.Timestamp;
	budget: number;
	status: AuditStatus;
	aiAuditStatus: AuditorStatus;
	manualAuditStatus: AuditorStatus;
	auditorId: string;
};

export type ProjectWithAuditorBid = Project & {
	auditorBid: number | null;
};

export type Bid = {
	id: string;
	projectId: string;
	auditorId: string;
	bidAmount: number;
	timestamp: admin.firestore.Timestamp;
};

export type AuditFile = {
	id: string;
	projectId: string;
	filename: string;
	fileType: string;
	ipfsHash: string;
	url: string;
	uploadedDate: admin.firestore.Timestamp;
};
