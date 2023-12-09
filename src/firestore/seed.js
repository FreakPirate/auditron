const admin = require('firebase-admin');
const serviceAccount = require('../../firebase.json');

// Initialize Firebase Admin with service account
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function deleteCollection(collectionPath) {
	const collectionRef = db.collection(collectionPath);
	const snapshot = await collectionRef.get();

	const batch = db.batch();
	snapshot.docs.forEach(doc => {
		batch.delete(doc.ref);
	});

	await batch.commit();
	console.log(`Deleted all documents in ${collectionPath}`);
}

async function seedUsers() {
	// Your data to seed
	const data = [
		{
			id: 'user123',
			safeGlobalId: 'safe123',
			username: 'stakesholder1',
			email: 'stakesholder1@gmail.com',
			displayName: 'Stakeholder 1',
			profilePicture: 'https://example.com/profile.jpg',
			signUpDate: admin.firestore.Timestamp.fromDate(new Date('2023-01-01T12:00:00Z')),
			lastLogin: admin.firestore.Timestamp.fromDate(new Date('2023-01-01T12:00:00Z')),
			role: 'stakesholder',
			bio: 'stakesholder1',
		},
		{
			id: 'user124',
			safeGlobalId: 'safe124',
			username: 'auditor1',
			email: 'auditor1@gmail.com',
			displayName: 'Auditor 1',
			profilePicture: 'https://example.com/profile.jpg',
			signUpDate: admin.firestore.Timestamp.fromDate(new Date('2023-01-01T12:00:00Z')),
			lastLogin: admin.firestore.Timestamp.fromDate(new Date('2023-01-01T12:00:00Z')),
			role: 'auditor',
			bio: 'Experienced smart contract auditor...',
		},
		{
			id: 'user125',
			safeGlobalId: 'safe125',
			username: 'auditor2',
			email: 'auditor2@gmail.com',
			displayName: 'Auditor 2',
			profilePicture: 'https://example.com/profile.jpg',
			signUpDate: admin.firestore.Timestamp.fromDate(new Date('2023-01-01T12:00:00Z')),
			lastLogin: admin.firestore.Timestamp.fromDate(new Date('2023-01-01T12:00:00Z')),
			role: 'auditor',
			bio: 'Experienced smart contract auditor...',
		},
	];

	// delete users collection if exists
	await deleteCollection('users');

	// Choose your collection
	const collection = db.collection('users');

	data.forEach(async item => {
		await collection.doc(item.id).set(item);
		console.log(`Document with ID ${item.id} added.`);
	});
}

async function seedProjects() {
	// Your data to seed
	const data = [
		{
			id: 'proj123',
			projectName: 'Smart Audit 1',
			stakeholderId: 'user123',
			description: 'Audit of a new DeFi protocol...',
			submissionDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			deadline: admin.firestore.Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
			budget: 1000,
			status: 'in_progress',
			aiAuditStatus: 'pending',
			manualAuditStatus: 'pending',
			auditorId: 'user124',
		},
		{
			id: 'proj124',
			projectName: 'Smart Audit 2',
			stakeholderId: 'user123',
			description: 'Audit of a new DeFi protocol...',
			submissionDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			deadline: admin.firestore.Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
			budget: 500,
			status: 'in_progress',
			aiAuditStatus: 'completed',
			manualAuditStatus: 'completed',
			auditorId: 'user125',
		},
		{
			id: 'proj125',
			projectName: 'Smart Audit 3',
			stakeholderId: 'user123',
			description: 'Audit of a new DeFi protocol...',
			submissionDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			deadline: admin.firestore.Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
			budget: 300,
			status: 'completed',
			aiAuditStatus: 'completed',
			manualAuditStatus: 'completed',
			auditorId: 'user124',
		},
		{
			id: 'proj126',
			projectName: 'Smart Audit 4',
			stakeholderId: 'user123',
			description: 'Audit of a new DeFi protocol...',
			submissionDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			deadline: admin.firestore.Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
			budget: 1000,
			status: 'completed',
			aiAuditStatus: 'completed',
			manualAuditStatus: 'completed',
			auditorId: 'user125',
		},
		{
			id: 'proj127',
			projectName: 'Smart Audit 5',
			stakeholderId: 'user123',
			description: 'Audit of a new DeFi protocol...',
			submissionDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			deadline: admin.firestore.Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
			budget: 1000,
			status: 'bid',
			aiAuditStatus: 'pending',
			manualAuditStatus: 'pending',
			auditorId: null,
		},
		{
			id: 'proj128',
			projectName: 'Smart Audit 6',
			stakeholderId: 'user123',
			description: 'Audit of a new DeFi protocol...',
			submissionDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			deadline: admin.firestore.Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
			budget: 1000,
			status: 'bid',
			aiAuditStatus: 'pending',
			manualAuditStatus: 'pending',
			auditorId: null,
		},
	];

	await deleteCollection('projects');
	// Choose your collection
	const collection = db.collection('projects');

	data.forEach(async item => {
		const stakeholderRef = db.collection('users').doc(item.stakeholderId);
		const auditorRef = item.auditorId ? db.collection('users').doc(item.auditorId) : null;
		await collection.doc(item.id).set({
			...item,
			stakeholderId: stakeholderRef,
			auditorId: auditorRef,
		});
		console.log(`Document with ID ${item.id} added.`);
	});
}

async function seedAuditFiles() {
	// Your data to seed
	const data = [
		{
			id: 'file123',
			projectId: 'proj123',
			fileName: 'smart_contract_1.sol',
			fileType: 'solidity',
			url: 'https://example.com/file123',
			ipfsHash: 'QmZ4Y7i9Z...',
			uploadedDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
		},
		{
			id: 'file124',
			projectId: 'proj124',
			fileName: 'smart_contract_2.sol',
			fileType: 'solidity',
			url: 'https://example.com/file124',
			ipfsHash: 'QmZ4Y7i9Z...',
			uploadedDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
		},
		{
			id: 'file125',
			projectId: 'proj125',
			fileName: 'smart_contract_3.sol',
			fileType: 'solidity',
			url: 'https://example.com/file125',
			ipfsHash: 'QmZ4Y7i9Z...',
			uploadedDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
		},
		{
			id: 'file126',
			projectId: 'proj126',
			fileName: 'smart_contract_4.sol',
			fileType: 'solidity',
			url: 'https://example.com/file126',
			ipfsHash: 'QmZ4Y7i9Z...',
			uploadedDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
		},
		{
			id: 'file127',
			projectId: 'proj127',
			fileName: 'smart_contract_5.sol',
			fileType: 'solidity',
			url: 'https://example.com/file127',
			ipfsHash: 'QmZ4Y7i9Z...',
			uploadedDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
		},
		{
			id: 'file128',
			projectId: 'proj128',
			fileName: 'smart_contract_6.sol',
			fileType: 'solidity',
			url: 'https://example.com/file128',
			ipfsHash: 'QmZ4Y7i9Z...',
			uploadedDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
		},
	];

	await deleteCollection('auditFiles');
	// Choose your collection
	const collection = db.collection('auditFiles');

	data.forEach(async item => {
		const projectRef = db.collection('projects').doc(item.projectId);
		await collection.doc(item.id).set({
			...item,
			projectId: projectRef,
		});
		console.log(`Document with ID ${item.id} added.`);
	});
}

async function seedUserBids() {
	// Your data to seed
	const data = [
		{
			id: 'bid123',
			projectId: 'proj127',
			timestamp: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			auditorId: 'user124',
			bidAmount: 900,
		},
		{
			id: 'bid124',
			projectId: 'proj127',
			timestamp: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			auditorId: 'user125',
			bidAmount: 800,
		},
		{
			id: 'bid125',
			projectId: 'proj128',
			timestamp: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			auditorId: 'user124',
			bidAmount: 700,
		},
		{
			id: 'bid126',
			projectId: 'proj128',
			timestamp: admin.firestore.Timestamp.fromDate(new Date('2023-12-01T10:00:00Z')),
			auditorId: 'user125',
			bidAmount: 800,
		},
	];

	await deleteCollection('userBids');
	// Choose your collection
	const collection = db.collection('userBids');

	data.forEach(async item => {
		const projectRef = db.collection('projects').doc(item.projectId);
		const auditorRef = db.collection('users').doc(item.auditorId);
		await collection.doc(item.id).set({
			...item,
			projectId: projectRef,
			auditorId: auditorRef,
		});
		console.log(`Document with ID ${item.id} added.`);
	});
}

async function seedData() {
	await seedUsers();
	await seedProjects();
	await seedAuditFiles();
	await seedUserBids();
}

seedData().then(() => console.log('Data seeding completed!'));
