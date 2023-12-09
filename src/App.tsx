import { PushAPI } from '@pushprotocol/restapi';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import AuditRequestCard from './AuditRequestCard';
import BidModal from './BidModal';
import ChatWrapper from './Chatting/ChatWrapper';
import NotificationsTab from './Notifications/NotificationsTab';
import { useSendNotifications } from './Notifications/useSendNotifications';
import UploadModal from './UploadModal';
import { AuditorItems, LOGO, OwnerItems } from './constants';
import {
	createAuditFile,
	createBid,
	createProject,
	getActiveBidProjectsForStakeholder,
	getActiveProjects,
	getAvailableBidProjectsForAuditor,
	getCompletedProjects,
} from './API';
import { AuditorStatus, Project, UserRole, AuditStatus } from './types';
import Login from './Login';
// import { getActiveBidProjectsForStakeholder } from './firestore/adapter';

const { Content, Sider } = Layout;

let pushUser: PushAPI;
const App = (props: { role: string; stakeholderId: string; userId: string }) => {
	const [selectedView, setSelectedView] = useState('undergoingAudits');
	const [isConnected, setIsConnected] = useState(false);
	const [sendNotification] = useSendNotifications();

	const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
	const [isBidModalVisible, setIsBidModalVisible] = useState(false);

	const [activeBidProjectsForStakeholder, setActiveBidProjectsforStakeholder] = useState<Project[]>([]);
	const [activeProjects, setActiveProjects] = useState<Project[]>([]);
	const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
	const [activeBidProjectsForAuditor, setActiveBidProjectsForAuditor] = useState<Project[]>([]);

	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
											setIsBidModalVisible(true);}}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											console.log('Sending notification');
											const sendNotifRes = await pushUser.channel.send(['*'], {
												notification: { title: 'This is title', body: 'This is body' },
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

			case 'undergoingAudits':
				rightContent = (
					<CardContainer>
						<>
							{activeProjects?.map(item => {
								return (
									<AuditRequestCard
										role={props.role}
										openBidModal={() => setIsBidModalVisible(true)}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											console.log('Sending notification');
											const sendNotifRes = await pushUser.channel.send(['*'], {
												notification: { title: 'This is title', body: 'This is body' },
											});
										}}
										src="https://media-public.canva.com/2BiPA/MAFhRB2BiPA/1/tl.png"
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
										openBidModal={() => setIsBidModalVisible(true)}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											const sendNotifRes = await pushUser.channel.send(['*'], {
												notification: { title: 'This is title', body: 'This is body' },
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
										openBidModal={() => setIsBidModalVisible(true)}
										name={item.projectName}
										description={item.description}
										sendNotification={async () => {
											console.log('Sending notification');
											const sendNotifRes = await pushUser.channel.send(['*'], {
												notification: { title: 'This is title', body: 'This is body' },
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
				rightContent = <NotificationsTab pushUser={pushUser} />;
				break;
			}
			case 'chat': {
				rightContent = <ChatWrapper pushUser={pushUser} />;
				break;
			}
			default:
				rightContent = (
					<CardContainer>
						<AuditRequestCard
							role={props.role}
							openBidModal={() => setIsBidModalVisible(true)}
							name={''}
							description={''}
							sendNotification={async () => {
								await sendNotification({
									title: 'This is title',
									body: 'This is body',
									recipient: ['*'],
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
	const accountChangeHandler = (account: any) => {
		// Setting an address data
		setIsConnected(true);
		console.log('Account: ', account);

		// TODO:
		// Add the user to the notification channel
		// and store the pushUser object in the state
		// Build a logout button to setIsConnected(false)
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
	}
	return (
		<StyledApp>
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
						<Button type="primary" onClick={() => setIsUploadModalVisible(true)}>
							{' '}
							Add new{' '}
						</Button>
					</Header>

					{<Content style={{ display: 'flex' }}>{rightContent}</Content>}
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
			</Layout>
			{!isConnected && <Login handleLogin={authenticate} />}
		</StyledApp>
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
