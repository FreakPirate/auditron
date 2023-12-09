import { Project, UserBid, UserRole } from "./types";

export const sourceUrl = 'http://localhost:3001';
// /api/active-projects/:userId/:role
export const getActiveProjects = async (userId: string, role: UserRole): Promise<Project[]> => {
    const response = await fetch(`${sourceUrl}/api/active-projects/${userId}/${role}`);
    const data = await response.json();
    return data.data;
}

// /api/completed-projects/:userId/:role
export const getCompletedProjects = async (userId: string, role: UserRole): Promise<Project[]> => {
    const response = await fetch(`${sourceUrl}/api/completed-projects/${userId}/${role}`);
    const data = await response.json();
    return data.data;
}

// /api/active-bid-projects/stakeholder/:stakeholderId
export const getActiveBidProjectsForStakeholder = async (stakeholderId: string): Promise<Project[]> => {
    const response = await fetch(`${sourceUrl}/api/active-bid-projects/stakeholder/${stakeholderId}`);
    const data = await response.json();
    return data.data;
}

// /api/bids/project/:projectId
export const getBidsForProject = async (projectId: string): Promise<Project[]> => {
    const response = await fetch(`/api/bids/project/${projectId}`);
    const data = await response.json();
    return data.data;
}   

// /api/available-bid-projects/auditor/:auditorId
export const getAvailableBidProjectsForAuditor = async (auditorId: string): Promise<Project[]> => {
    const response = await fetch(`${sourceUrl}/api/available-bid-projects/auditor/${auditorId}`);
    const data = await response.json();
    return data.data;
}

// /api/project
export const createProject = async (project: Project): Promise<Project> => {
    const response = await fetch(`${sourceUrl}/api/project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
    });
    const data = await response.json();
    return data.data;
}

// /api/project/status/:projectId
export const updateProjectStatus = async (projectId: string, status: string): Promise<Project> => {
    const response = await fetch(`${sourceUrl}/api/project/status/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data.data;
}

// /api/project/manual-audit-status/:projectId
export const updateProjectManualAuditStatus = async (projectId: string, manualAuditStatus: string): Promise<Project> => {
    const response = await fetch(`${sourceUrl}/api/project/manual-audit-status/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manualAuditStatus }),
    });
    const data = await response.json();
    return data.data;
}

// /api/project/ai-audit-status/:projectId
export const updateProjectAIAuditStatus = async (projectId: string, aiAuditStatus: string): Promise<Project> => {
    const response = await fetch(`${sourceUrl}/api/project/ai-audit-status/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiAuditStatus }),
    });
    const data = await response.json();
    return data.data;
}

// /api/project/auditor/:projectId
export const updateProjectAuditor = async (projectId: string, auditorId: string): Promise<Project> => {
    const response = await fetch(`${sourceUrl}/api/project/auditor/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditorId }),
    });
    const data = await response.json();
    return data.data;
}

// /api/user
export const createUser = async (user: any): Promise<any> => {
    const response = await fetch(`${sourceUrl}/api/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const data = await response.json();
    return data.data;
}

// /api/audit-file
export const createAuditFile = async (auditFile: any): Promise<any> => {
    const response = await fetch(`${sourceUrl}/api/audit-file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditFile),
    });
    const data = await response.json();
    return data.data;
}

// /api/project/assign-auditor/:projectId
export const assignAuditor = async (projectId: string, auditorId: string): Promise<Project> => {
    const response = await fetch(`${sourceUrl}/api/project/assign-auditor/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditorId }),
    });
    const data = await response.json();
    return data.data;
}


// /api/bid
export const createBid = async (bid: UserBid): Promise<any> => {
    const response = await fetch(`${sourceUrl}/api/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bid),
    });
    const data = await response.json();
    return data.data;
}