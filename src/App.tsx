import { PushAPI } from '@pushprotocol/restapi';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useState } from 'react';
import styled from 'styled-components';
import AuditRequestCard from './AuditRequestCard';
import BidModal from './BidModal';
import ChatWrapper from './Chatting/ChatWrapper';
import NotificationsTab from './Notifications/NotificationsTab';
import { useSendNotifications } from './Notifications/useSendNotifications';
import UploadModal from './UploadModal';
import { AuditorItems, LOGO, OwnerItems } from './constants';
import Login from './Login';
// import { getActiveBidProjectsForStakeholder } from './firestore/adapter';

const { Content, Sider } = Layout;

let pushUser: PushAPI;
const App = (props: { role: string; stakeholderId: string }) => {

	const [selectedView, setSelectedView] = useState('currReqs');
	const [isConnected, setIsConnected] = useState(false);
	const [sendNotification] = useSendNotifications();

	const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
	const [isBidModalVisible, setIsBidModalVisible] = useState(false);

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

	const getRightSideContent = (selectedView: string) => {
		switch (selectedView) {
			// case 'currReqs':
			// 	const activeBidProjects = getActiveBidProjectsForStakeholderUI();
			// 	return (
			// 		<CardContainer>
			// 			<>
			// 				{
			// 					// @ts-ignore
			// 					activeBidProjects.map(item => {
			// 						<AuditRequestCard
			// 							role={props.role}
			// 							openBidModal={() => setIsBidModalVisible(true)}
			// 							name={item.projectName}
			// 							description={item.description}
			// 							sendNotification={async () => {
			// 								console.log('Sending notification');
			// 								const sendNotifRes = await pushUser.channel.send(['*'], {
			// 									notification: { title: 'This is title', body: 'This is body' },
			// 								});
			// 							}}
			// 						/>;
			// 					})
			// 				}
			// 			</>
			// 		</CardContainer>
			// 	);
			case 'notifications': {
				return <NotificationsTab pushUser={pushUser} />;
			}
			case 'chat': {
				return <ChatWrapper pushUser={pushUser}/>;
			}
			default:
				return (
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
						/>
					</CardContainer>
				);
		}
	};

	// Button handler button for handling a
    // request event for metamask
    const authenticate = () => {
        // Asking if metamask is already present or not
		//@ts-ignore
        if (window.ethereum) {
            // res[0] for fetching a first wallet
			//@ts-ignore
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res: any) =>
                    accountChangeHandler(res[0])
                );
        } else {
            alert("install metamask extension!!");
        }
    };

	// Function for getting handling all events
    const accountChangeHandler = (account: any) => {
        // Setting an address data
		setIsConnected(true);
		console.log('Account: ', account);
    };

	return (
		<StyledApp>
			{isConnected && <>
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
							<Button type="primary" onClick={() => setIsUploadModalVisible(true)}>
								{' '}
								Add new{' '}
							</Button>
						</Header>

						<Content style={{ display: 'flex' }}>{getRightSideContent(selectedView)}</Content>
					</Layout>
				</Layout>
				<UploadModal isModalOpen={isUploadModalVisible} closeModal={() => setIsUploadModalVisible(false)} />
				<BidModal isModalOpen={isBidModalVisible} closeModal={() => setIsBidModalVisible(false)} />
			</>}
			{!isConnected && <Login handleLogin={authenticate}/>}
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
