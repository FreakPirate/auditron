import * as admin from 'firebase-admin';
import {
	User,
	UserRole,
	AuditorStatus,
	AuditStatus,
	Project,
	UserBid,
	AuditFile,
	ProjectWithAuditorBid,
} from './types'; // Import your types here
const serviceAccount = require('../../firebase.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Get list of active projects for a user based on role
export const getActiveProjects = async (userId: string, role: UserRole): Promise<Project[]> => {
	const projectsSnapshot = await db
		.collection('projects')
		.where(role === UserRole.STAKEHOLDER ? 'stakeholderId' : 'auditorId', '==', userId)
		.where('status', 'in', [AuditStatus.IN_PROGRESS, AuditStatus.PENDING])
		.get();

	return projectsSnapshot.docs.map(doc => doc.data() as Project);
};

// Get list of completed projects for a user based on role
export const getCompletedProjects = async (userId: string, role: UserRole): Promise<Project[]> => {
	const projectsSnapshot = await db
		.collection('projects')
		.where(role === UserRole.STAKEHOLDER ? 'stakeholderId' : 'auditorId', '==', userId)
		.where('status', '==', AuditStatus.COMPLETED)
		.get();

	return projectsSnapshot.docs.map(doc => doc.data() as Project);
};

// Get list of active bid projects for a stakeholder
export const getActiveBidProjectsForStakeholder = async (stakeholderId: string): Promise<Project[]> => {
	const projectsSnapshot = await db
		.collection('projects')
		.where('stakeholderId', '==', stakeholderId)
		.where('status', '==', AuditStatus.BID)
		.get();

	return projectsSnapshot.docs.map(doc => doc.data() as Project);
};

// Get list of bids for a project
export const getBidsForProject = async (projectId: string): Promise<UserBid[]> => {
	const bidsSnapshot = await db.collection('bids').where('projectId', '==', projectId).get();
	return bidsSnapshot.docs.map(doc => doc.data() as UserBid);
};

// Get list of available bid projects for an auditor along with the ones they have already bid on
export const getAvailableBidProjectsForAuditor = async (auditorId: string): Promise<ProjectWithAuditorBid[]> => {
	const projectsSnapshot = await db.collection('projects').where('status', '==', AuditStatus.BID).get();
	const bidsSnapshot = await db.collection('bids').where('auditorId', '==', auditorId).get();

	const projects = projectsSnapshot.docs.map(doc => doc.data() as Project);
	const bids = bidsSnapshot.docs.map(doc => doc.data() as UserBid);

	const projectWithAuditorBid: ProjectWithAuditorBid[] = projects.map(project => {
		const bid = bids.find(bid => bid.projectId === project.id && bid.auditorId === auditorId);
		return {
			...project,
			auditorBid: bid ? bid.bidAmount : null,
		};
	});

	return projectWithAuditorBid.sort((a, b) => (a.auditorBid || 0) - (b.auditorBid || 0));
};

// Create new project
export const createNewProject = async (newProject: Project): Promise<void> => {
	await db.collection('projects').doc(newProject.id).set(newProject);
};

// Create new bid
export const createNewBid = async (newBid: UserBid): Promise<void> => {
	await db.collection('bids').doc(newBid.id).set(newBid);
};

// Update project status
export const updateProjectStatus = async (projectId: string, newStatus: AuditStatus): Promise<void> => {
	await db.collection('projects').doc(projectId).update({ status: newStatus });
};

// Update project manual audit status
export const updateProjectManualAuditStatus = async (projectId: string, newStatus: AuditorStatus): Promise<void> => {
	await db.collection('projects').doc(projectId).update({ manualAuditStatus: newStatus });
};

// Update project AI audit status
export const updateProjectAiAuditStatus = async (projectId: string, newStatus: AuditorStatus): Promise<void> => {
	await db.collection('projects').doc(projectId).update({ aiAuditStatus: newStatus });
};

// Update project auditor ID
export const updateProjectAuditorId = async (projectId: string, auditorId: string): Promise<void> => {
	await db.collection('projects').doc(projectId).update({ auditorId: auditorId });
};

// Create new user
export const createNewUser = async (newUser: User): Promise<void> => {
	await db.collection('users').doc(newUser.id).set(newUser);
};

// Create new audit file
export const createNewAuditFile = async (newAuditFile: AuditFile): Promise<void> => {
	await db.collection('auditFiles').doc(newAuditFile.id).set(newAuditFile);
};

// Logic to assign auditor with lowest bid to project once bidding is complete
export const assignAuditorToProject = async (projectId: string): Promise<void> => {
	const bidsSnapshot = await db.collection('bids').where('projectId', '==', projectId).get();
	const bids = bidsSnapshot.docs.map(doc => doc.data() as UserBid);

	const lowestBid = bids.reduce((prev, curr) => (prev.bidAmount < curr.bidAmount ? prev : curr));
	await db.collection('projects').doc(projectId).update({ auditorId: lowestBid.auditorId });
};
