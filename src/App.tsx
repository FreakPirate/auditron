import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { Button, Drawer, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import * as ethers from 'ethers';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AuditRequestCard from './AuditRequestCard';
import BidModal from './BidModal';
import ChatWrapper from './Chatting/ChatWrapper';
import Login from './Login';
import NotificationsTab from './Notifications/NotificationsTab';
import { useSendNotifications } from './Notifications/useSendNotifications';
import UploadModal from './UploadModal';
import {
	assignAuditor,
	createAuditFile,
	createBid,
	createProject,
	getActiveBidProjectsForStakeholder,
	getActiveProjects,
	getAvailableBidProjectsForAuditor,
	getBidsForProject,
	getCompletedProjects,
	sourceUrl,
	updateProjectManualAuditStatus,
	updateProjectStatus,
} from './API';
import { AuditorStatus, Project, UserRole, AuditStatus, UserBid, AuditReport } from './types';
import AllBidsModal from './AllBidsModal';
import { AuditorItems, CHANNEL_ADDRESS, CHAT_ID, IPFS_FILE_URL, LOGO, OwnerItems, ROLE_ADDRESS_MAP, AI_BOT_PRIVATE_KEY } from './constants';
import { MetaMaskButton, MetaMaskUIProvider } from '@metamask/sdk-react-ui';
import { ContractAdapter, getSigner } from './adapters/contract';
// import { getActiveBidProjectsForStakeholder } from './firestore/adapter';

const { Content, Sider } = Layout;

let signedPushUser: PushAPI;
let signedUserWalletAddress: string;
const App = (props: { role: string; stakeholderId: string; userId: string }) => {
	const [selectedView, setSelectedView] = useState('currReqs');
	const [isConnected, setIsConnected] = useState(false);
	const [open, setDrawerOpen] = useState(false);
	const [sendNotification] = useSendNotifications();

	const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
	const [isBidModalVisible, setIsBidModalVisible] = useState(false);

	const [activeBidProjectsForStakeholder, setActiveBidProjectsforStakeholder] = useState<Project[]>([]);
	const [activeProjects, setActiveProjects] = useState<Project[]>([]);
	const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
	const [activeBidProjectsForAuditor, setActiveBidProjectsForAuditor] = useState<Project[]>([]);

	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const [isAllBidsModalVisible, setIsAllBidsModalVisible] = useState(false);
	const [allBids, setAllBids] = useState<UserBid[]>([]);

	const getSidebarItems = () => {
		switch (props.role) {
			case 'stakeholder':
			case 'developer':
				return OwnerItems;
			case 'auditor':
				return AuditorItems;
		}
	};
	const handleMenuItemSelect = ({ key }: { key: string }) => {
		setSelectedView(key);
	};

	const showDrawer = () => {
		setDrawerOpen(true);
	};

	const onClose = () => {
		setDrawerOpen(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			const bids = await getBidsForProject(selectedProject?.id!);
			setAllBids(bids);
		};
		fetchData();
	}, [selectedProject]);

	useEffect(() => {
		if (props.role === 'stakeholder') {
			const fetchActiveBidProjectsforStakeholder = async () => {
				const activeBidProjects = await getActiveBidProjectsForStakeholder(props.stakeholderId);
				setActiveBidProjectsforStakeholder(activeBidProjects);
			};

			fetchActiveBidProjectsforStakeholder();
		} else if (props.role === 'auditor') {
			const fetchActiveBidProjectsForAuditor = async () => {
				const activeBidProjects = await getAvailableBidProjectsForAuditor(props.stakeholderId);
				setActiveBidProjectsForAuditor(activeBidProjects);
			};

			fetchActiveBidProjectsForAuditor();
			setSelectedView('availableBids');
		}

		const fetchActiveProjects = async () => {
			const activeProjects = await getActiveProjects(props.userId, props.role as UserRole);
			setActiveProjects(activeProjects);
		};

		fetchActiveProjects();

		const fetchCompletedProjects = async () => {
			const completedProjects = await getCompletedProjects(props.userId, props.role as UserRole);
			setCompletedProjects(completedProjects);
		};

		fetchCompletedProjects();
	}, []);

	// const getActiveBidProjectsForStakeholderUI = async () => {
	// 	const activeBidProjects = await getActiveBidProjectsForStakeholder(props.stakeholderId);
	// 	return activeBidProjects;
	// };
	const getRightSideContent = (selectedView: string) => {
		let rightContent = null;
		switch (selectedView) {
			case 'currReqs':
				rightContent = (
					<CardContainer>
						<>
							{activeBidProjectsForStakeholder?.map(item => {
								return (
									<AuditRequestCard
										role={props.role}
										openBidModal={() => {
											setSelectedProject(item);
											setIsBidModalVisible(true);
										}}
										name={item.projectName}
										showDrawer={showDrawer}
										description={item.description}
										sendNotification={async () => {
											await sendNotification({
												title: 'Event Triggered',
												body: 'You have been notified regarding the click on ellipsis icon in the card',
												recipient: [signedUserWalletAddress],
											});
										}}
										src="https://rocketium.com/images/v2/609213e3d560562f9508621f/resized/661eded7-4633-42ea-b717-7da6dac98c66_1702072772932.png"
										showBids={() => {
											setSelectedProject(item);
											setIsAllBidsModalVisible(true);
										}}
									/>
								);
							})}
						</>
					</CardContainer>
				);
				break;

			case 'undergoingAudits':
				rightContent = (
					<CardContainer>
						<>
							{activeProjects?.map(item => {
								return (
									<AuditRequestCard
										role={props.role}
										showDrawer={showDrawer}
										openBidModal={() => {
											setSelectedProject(item);
											setIsBidModalVisible(true);
										}}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											await sendNotification({
												title: 'Event Triggered',
												body: 'You have been notified regarding the click on ellipsis icon in the card',
												recipient: [signedUserWalletAddress],
											});
										}}
										src="https://media-public.canva.com/2BiPA/MAFhRB2BiPA/1/tl.png"
										updateStatus={async () => {
											await updateProjectStatus(item.id, 'completed');
											setCompletedProjects([...completedProjects, item]);
											setActiveProjects(activeProjects.filter(project => project.id !== item.id));
										}}
									/>
								);
							})}
						</>
					</CardContainer>
				);
				break;

			case 'completedAudits':
				rightContent = (
					<CardContainer>
						<>
							{completedProjects?.map(item => {
								return (
									<AuditRequestCard
										role={props.role}
										showDrawer={showDrawer}
										openBidModal={() => {
											setSelectedProject(item);
											setIsBidModalVisible(true);
										}}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											await sendNotification({
												title: 'Event Triggered',
												body: 'You have been notified regarding the click on ellipsis icon in the card',
												recipient: [signedUserWalletAddress],
											});
										}}
										src="https://media-public.canva.com/eVBaE/MAE2LjeVBaE/1/tl.png"
									/>
								);
							})}
						</>
					</CardContainer>
				);
				break;

			case 'availableBids':
				rightContent = (
					<CardContainer>
						<>
							{activeBidProjectsForAuditor?.map(item => {
								return (
									<AuditRequestCard
										role={props.role}
										showDrawer={showDrawer}
										openBidModal={() => {
											setSelectedProject(item);
											setIsBidModalVisible(true);
										}}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											await sendNotification({
												title: 'Event Triggered',
												body: 'You have been notified regarding the click on ellipsis icon in the card',
												recipient: [signedUserWalletAddress],
											});
										}}
										src="https://rocketium.com/images/v2/609213e3d560562f9508621f/resized/661eded7-4633-42ea-b717-7da6dac98c66_1702072772932.png"
									/>
								);
							})}
						</>
					</CardContainer>
				);
				break;
			case 'notifications': {
				rightContent = <NotificationsTab signedPushUser={signedPushUser} />;
				break;
			}
			default:
				rightContent = (
					<CardContainer>
						<AuditRequestCard
							showDrawer={showDrawer}
							role={props.role}
							openBidModal={() => setIsBidModalVisible(true)}
							name={''}
							description={''}
							sendNotification={async () => {
								await sendNotification({
									title: 'Event Triggered',
									body: 'You have been notified regarding the click on ellipsis icon in the card',
									recipient: [signedUserWalletAddress],
								});
							}}
							src=""
						/>
					</CardContainer>
				);
				break;
		}

		return rightContent;
	};

	let rightContent = getRightSideContent(selectedView);

	console.log('rightContent', rightContent);
	// Button handler button for handling a
	// request event for metamask
	const authenticate = () => {
		// Asking if metamask is already present or not
		//@ts-ignore
		if (window.ethereum) {
			// res[0] for fetching a first wallet
			//@ts-ignore
			window.ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => accountChangeHandler(res[0]));
		} else {
			alert('install metamask extension!!');
		}
	};

	// Function for getting handling all events
	const accountChangeHandler = async (account: any) => {
		// Setting an address data
		setIsConnected(true);
		console.log('Account: ', account);
		signedUserWalletAddress = account;
		// Creating a signer object based on the connected account
		//@ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner(account);
		console.log('Signer: ', signer);
		signedPushUser = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
		console.log('signedPushUser: ', signedPushUser);
		// Add the user to the notification channel
		// and store the pushUser object in the state
		// Build a logout button to setIsConnected(false)
		const res = await signedPushUser.notification.subscribe(
			`${CHANNEL_ADDRESS}`, // channel address in CAIP format
		);
		console.log('res: ', res);
	};

	const sendReportToGroupChat = async () => {
		// Initializing the AI BOT Push user to make it able to send messages in the chat
		//@ts-ignore
		const aiPK = AI_BOT_PRIVATE_KEY; // channel private key (Already compromised)
		const Pkey = `0x${aiPK}`;
		const aiSigner = new ethers.Wallet(Pkey);
		const aiPushUser = await PushAPI.initialize(aiSigner, { env: CONSTANTS.ENV.STAGING });

		setDrawerOpen(true);
		const chatMsgP0 = 'AUTOMATED AUDIT REPORT:';
		await aiPushUser.chat.send(CHAT_ID, {
			type: 'Text',
			content: chatMsgP0,
		});

		const fileUrl = IPFS_FILE_URL;
		const res = await fetch(`${sourceUrl}/api/audit-report?url=${fileUrl}`);
		const apiRes: { data: AuditReport | null } = await res.json();
		const report = apiRes.data;
		console.log('apiRes: ', apiRes);
		await sendNotification({
			title: 'We have reviewed your smart contract',
			body: 'Our AI bot has reviewed your smart contract and has generated a report. Please check it out!',
			recipient: [ROLE_ADDRESS_MAP.STAKEHOLDER],
		});
		if (report) {
			const chatMsgP1 = `
				SECURITY:
				${report.security}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP1,
			});
			const chatMsgP2 = `
				FUNCTIONALITY:
				${report.functionality}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP2,
			});
			const chatMsgP3 = `
				GAS OPTIMIZATION:
				${report.gasOptimization}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP3,
			});
			const chatMsgP4 = `
				CODE QUALITY:
				
				${report.codeQuality}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP4,
			});
			const chatMsgP5 = `
				DESIGN CONSIDERATIONS:
				${report.designConsiderations}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP5,
			});
			const chatMsgP6 = `
				COMPLIANCE AND STANDARDS:
				${report.complianceAndStandards}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP6,
			});
			const chatMsgP7 = `CONCLUSION OF THE REPORT:
				${report.conclusion}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP7,
			});
			const chatMsgP8 = `MY SCORE FOR YOUR REPORT: ${report.score}/10`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP8,
			});
			const chatMsgP9 = `MY RECOMMENDATIONS:
				${report.recommendations.map((item, index) => `${index + 1}. ${item}\n`)}
			`;
			await aiPushUser.chat.send(CHAT_ID, {
				type: 'Text',
				content: chatMsgP9,
			});
		}
	};

	const onCreateProjectHandler = async (values: any) => {
		const projectId = generateId();
		const projectState = {
			id: projectId,
			status: AuditStatus.BID,
			stakeholderId: props.stakeholderId,
			auditorId: '',
			aiAuditStatus: AuditorStatus.PENDING,
			manualAuditStatus: AuditorStatus.PENDING,
			projectName: values.name as string,
			budget: values.budget as number,
			description: values.description as string,
		};

		console.log('projectState', projectState);
		await createProject(projectState);
		setActiveBidProjectsforStakeholder([...activeBidProjectsForStakeholder, projectState]);
		await sendNotification({
			title: 'New Smart Contract Audit Request!',
			body: 'A new smart contract audit request has been created on the marketplace. Place a bid now!',
			recipient: [ROLE_ADDRESS_MAP.AUDITOR],
		});
		await createAuditFile({
			id: generateId(),
			projectId: selectedProject?.id!,
			filename: 'test',
			fileType: 'solidity',
			ipfsHash: 'test123',
			url: 'https://gateway.pinata.cloud/ipfs/QmTZc3kvBfiag2KjVvzFMQ4Vgv61an61MaqtftAujCNu6J',
		});
		await sendReportToGroupChat();
		// TODO
		// await createAuditFile('https://gateway.pinata.cloud/ipfs/QmTZc3kvBfiag2KjVvzFMQ4Vgv61an61MaqtftAujCNu6J');

		// 	stakeholderId: string;
		// description: string;
		// submissionDate: admin.firestore.Timestamp;
		// deadline: admin.firestore.Timestamp;
		// budget: number;
		// status: AuditStatus;
		// aiAuditStatus: AuditorStatus;
		// manualAuditStatus: AuditorStatus;
		// auditorId: string;

		const signer = await getSigner();
		const adapter = new ContractAdapter(signer);
		const response = await adapter.createProject(projectId, '0x3f72d7fEa67B2DFf18dA7c0e3BdE2a09938E0e32', values.budget);
		console.log('response', response);
	};

	// function to genrate random 10 digit id
	const generateId = () => {
		return 'a' + Math.floor(Math.random() * Math.floor(Date.now()));
	};

	const onSubmitBidHandler = async (values: any) => {
		const bidId = generateId();
		const bidState = {
			id: bidId,
			projectId: selectedProject?.id!,
			auditorId: props.userId,
			bidAmount: values.budget as number,
			description: '',
		};
		console.log('bidState', bidState);
		await createBid(bidState);
		await sendNotification({
			title: 'You have a new bid!',
			body: 'Your smart contract is popular. You have a new bid. Review and accept it now!',
			recipient: [ROLE_ADDRESS_MAP.STAKEHOLDER],
		});
	};

	const showBids = () => {
		setIsAllBidsModalVisible(true);
	};

	const onBidSelect = async (projectId: string, auditorId: string, bidAmount: number) => {
		setIsAllBidsModalVisible(false);
		await assignAuditor(projectId, auditorId);
		await updateProjectStatus(projectId, AuditStatus.PENDING);
		await sendNotification({
			title: 'Congratulations and Celebrations!',
			body: 'We have a great news for you! Your bid has been accepted by the stakeholder. You can now start auditing the smart contract',
			recipient: [ROLE_ADDRESS_MAP.AUDITOR],
		});
		setActiveProjects([...activeProjects, selectedProject!]);
		setActiveBidProjectsforStakeholder(activeBidProjectsForStakeholder.filter(project => project.id !== projectId));
		showDrawer();
	};

	return (
		<React.StrictMode>
			<MetaMaskUIProvider
				sdkOptions={{
					dappMetadata: {
						name: 'Auditron',
					},
				}}
			>
				<StyledApp>
					{isConnected && (
						<Layout>
							<StyledSider width={250}>
								<AppLogo className="logo">
									<LogoWrapper src={LOGO} alt="dAd Space" />
								</AppLogo>
								<StyledMenu
									theme="dark"
									defaultSelectedKeys={[selectedView]}
									mode="inline"
									items={getSidebarItems()}
									selectedKeys={[selectedView]}
									onClick={handleMenuItemSelect}
								/>
							</StyledSider>
							<Layout style={{ height: '100vh', background: 'rgb(25, 25, 25)' }}>
								<Header
									style={{
										padding: '2rem',
										background: 'transparent',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<div style={{ fontSize: '20px', fontWeight: '700' }}>
										{getSidebarItems()?.filter(item => item.key === selectedView)[0].label}
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '310px'
										}}
									>
										<Button type="primary" onClick={() => setIsUploadModalVisible(true)}>
											{' '}
											Add new{' '}
										</Button>
										<MetaMaskButton theme={'light'} color="white"></MetaMaskButton>
									</div>
								</Header>

								{
									<Content style={{ display: 'flex' }}>
										{rightContent}
										<Drawer
											title="Discussions"
											placement={'right'}
											onClose={onClose}
											open={open}
											key={'right'}
											size={'large'}
										>
											<ChatWrapper />
										</Drawer>
									</Content>
								}
							</Layout>
							<UploadModal
								isModalOpen={isUploadModalVisible}
								closeModal={() => setIsUploadModalVisible(false)}
								onSubmitHandler={onCreateProjectHandler}
								initialValues={{ name: '', description: '', budget: '0', files: [] }}
							/>
							<BidModal
								isModalOpen={isBidModalVisible}
								closeModal={() => setIsBidModalVisible(false)}
								onSubmitHandler={onSubmitBidHandler}
							/>
							<AllBidsModal
								isModalOpen={isAllBidsModalVisible}
								closeModal={() => setIsAllBidsModalVisible(false)}
								projectId={selectedProject?.id!}
								onSubmitHandler={onBidSelect}
								bids={allBids}
							/>
						</Layout>
					)}
					{!isConnected && <Login handleLogin={authenticate} />}
				</StyledApp>
			</MetaMaskUIProvider>
		</React.StrictMode>
	);
};

export default App;

const StyledSider = styled(Sider)`
	height: 100vh;
	background: #171717 !important;
	box-shadow: 0.2px 0px #8d9093 !important;

	.ant-layout-sider-children {
		display: flex;
		flex-direction: column;
	}
`;

const StyledMenu = styled(Menu)`
	background: #171717;
	color: #fff;

	.ant-menu-item {
		margin: 8px 11px;
		width: 90%;
		font-size: 17px;
		&:hover {
			/* background: #f73859 !important; */
		}
	}
	.ant-menu-item-selected {
		/* background-color: #f73859 !important; */
	}
`;

const StyledApp = styled.div`
	height: 100vh;
	width: 100vw;
	/* color: #ffffff; */
`;
const AppLogo = styled.div`
	margin: 12px;
	display: flex;
	justify-content: center;
`;
const LogoWrapper = styled.img`
	width: 90%;
`;

const CardContainer = styled.div`
	display: flex;
	padding: 1rem;
	flex-wrap: wrap;
	gap: 1rem;
	overflow: scroll;
`;
