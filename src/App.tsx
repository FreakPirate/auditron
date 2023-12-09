import React, { useEffect, useState } from 'react';
import { Tag, Layout, Menu, Tooltip, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AuditorItems, LOGO, OwnerItems } from './constants';
import { Header } from 'antd/es/layout/layout';
import UploadModal from './UploadModal';
import AuditRequestCard from './AuditRequestCard';
import NotificationsTab from './Notifications/NotificationsTab';
import BidModal from './BidModal';
import * as ethers from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { getActiveBidProjectsForStakeholder } from './firestore/adapter';

const { Content, Sider } = Layout;

let pushUser: PushAPI;
const App = (props: { role: string }) => {
	const PK = '42b625180101ea78fa3df31daa5f3ce99b3062c8ac514e0f762f2f46599eece6'; // channel private key
	const Pkey = `0x${PK}`;
	const signer = new ethers.Wallet(Pkey);

	const [selectedView, setSelectedView] = useState('currReqs');
	// const [isLoading, setIsLoading] = useState(true);

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

	const getActiveBidProjectsForStakeholderUI = async () => {
		const activeBidProjects = await getActiveBidProjectsForStakeholder(props.stakeholderId);
		return activeBidProjects;
	};
	const getRightSideContent = (selectedView: string) => {
		switch (selectedView) {
			case 'currReqs':
				const activeBidProjects = getActiveBidProjectsForStakeholderUI();
				return (
					<CardContainer>
						<>
							{
								// @ts-ignore
								activeBidProjects.map(item => {
									<AuditRequestCard
										role={props.role}
										openBidModal={() => setIsBidModalVisible(true)}
										name={item.projectName}
										description={item.description}
									/>;
								})
							}
						</>
					</CardContainer>
				);
			case 'notifications': {
				return <NotificationsTab pushUser={pushUser} />;
			}
			default:
				return (
					<CardContainer>
						<AuditRequestCard role={props.role} openBidModal={() => setIsBidModalVisible(true)} sendNotification={async () => {
							console.log('Sending notification');
							const sendNotifRes = await pushUser.channel.send(["*"], {
								notification: { title: "This is title", body: "This is body" },
							});
						}}/>
					</CardContainer>
				);
		}
	};

	useEffect(() => {
		const setPushUser = async () => {
			pushUser = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
		};
		setPushUser();
	}, []);

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
