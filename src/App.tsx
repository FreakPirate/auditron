import { MetaMaskButton, MetaMaskUIProvider } from '@metamask/sdk-react-ui';
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import * as ethers from 'ethers';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getActiveBidProjectsForStakeholder, getActiveProjects, getCompletedProjects } from './API';
import AuditRequestCard from './AuditRequestCard';
import BidModal from './BidModal';
import ChatWrapper from './Chatting/ChatWrapper';
import Login from './Login';
import NotificationsTab from './Notifications/NotificationsTab';
import { useSendNotifications } from './Notifications/useSendNotifications';
import UploadModal from './UploadModal';
import { AuditorItems, CHANNEL_ADDRESS, LOGO, OwnerItems } from './constants';
import { Project, UserRole } from './types';

const { Content, Sider } = Layout;

let signedPushUser: PushAPI;
let signedUserWalletAddress: string;
const App = (props: { role: string; stakeholderId: string; userId:string }) => {

	const [selectedView, setSelectedView] = useState('currReqs');
	const [isConnected, setIsConnected] = useState(false);
	const [sendNotification] = useSendNotifications();

	const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
	const [isBidModalVisible, setIsBidModalVisible] = useState(false);

	const [activeBidProjectsForStakeholder, setActiveBidProjectsforStakeholder] = useState<Project[]>([]);
	const [activeProjects, setActiveProjects] = useState<Project[]>([]);
	const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
	const [activeBidProjectsForAuditor, setActiveBidProjectsForAuditor] = useState<Project[]>([]);
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
				const activeBidProjects = await getActiveBidProjectsForStakeholder(props.stakeholderId);
				setActiveBidProjectsForAuditor(activeBidProjects);
			};

			fetchActiveBidProjectsForAuditor();
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
										openBidModal={() => setIsBidModalVisible(true)}
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
											await sendNotification({
												title: 'Event Triggered',
												body: 'You have been notified regarding the click on ellipsis icon in the card',
												recipient: [signedUserWalletAddress],
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
										openBidModal={() => setIsBidModalVisible(true)}
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
				rightContent = <NotificationsTab signedPushUser={signedPushUser}/>;
				break;
			}
			case 'chat': {
				rightContent = <ChatWrapper />;
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
		const res = await signedPushUser.notification.subscribe(
			`${CHANNEL_ADDRESS}`, // channel address in CAIP format
		);
		console.log('res: ', res);
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
					<Layout>
						<StyledSider width={250}>
							<AppLogo className="logo">
								<LogoWrapper src={LOGO} alt="dAd Space" />
							</AppLogo>
							<StyledMenu
								theme="dark"
								defaultSelectedKeys={[selectedView]}
								mode="inline"
								items={OwnerItems}
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
									{OwnerItems.filter(item => item.key === selectedView)[0].label}
								</div>
								<div>
									<Button type="primary" onClick={() => setIsUploadModalVisible(true)}>
										{' '}
										Add new{' '}
									</Button>
									<MetaMaskButton theme={'light'} color="white"></MetaMaskButton>
								</div>
							</Header>

							{<Content style={{ display: 'flex' }}>{rightContent}</Content>}
						</Layout>
						<UploadModal
							isModalOpen={isUploadModalVisible}
							closeModal={() => setIsUploadModalVisible(false)}
						/>
						<BidModal isModalOpen={isBidModalVisible} closeModal={() => setIsBidModalVisible(false)} />
					</Layout>
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
