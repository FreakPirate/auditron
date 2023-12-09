import React from 'react';
import { EditOutlined, EllipsisOutlined, CommentOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;

const AuditRequestCard = (props: {
	role: string;
	openBidModal: () => void;
	name: string;
	description: string;
	sendNotification: () => void;
	src: string;
	showDrawer: () => void;
}) => (
	<Card
		style={{ width: 273, height: 'fit-content' }}
		cover={
			<img
				alt="example"
				src={props.src}
			/>
		}
		actions={[
			<CommentOutlined key="comment" onClick={props.showDrawer}/>,
			props.role === 'owner' ? (
				<EditOutlined key="edit" />
			) : (
				<MoneyCollectOutlined key="money" onClick={props.openBidModal} />
			),
			<EllipsisOutlined key="ellipsis" onClick={props.sendNotification} />,
		]}
	>
		<Meta avatar={<Avatar>U</Avatar>} title={props.name} description={props.description} />
	</Card>
);

export default AuditRequestCard;
