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
	budget: number;
	status: AuditStatus;
	aiAuditStatus: AuditorStatus;
	manualAuditStatus: AuditorStatus;
	auditorId: string;
};

export type ProjectWithAuditorBid = Project & {
	auditorBid: number | null;
};

export type UserBid = {
	id: string;
	projectId: string;
	auditorId: string;
	bidAmount: number;
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

export type AuditReport = {
	security: string;
	functionality: string;
	gasOptimization: string;
	codeQuality: string;
	designConsiderations: string;
	complianceAndStandards: string;
	conclusion: string;
	score: string;
	recommendations: string[];
};