import React from 'react';
import {
	EditOutlined,
	EllipsisOutlined,
	CommentOutlined,
	MoneyCollectOutlined,
} from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;

const AuditRequestCard = (props: {
	role: string;
	openBidModal: () => void;
	sendNotification: () => void;
}) => (
	<Card
		style={{ width: 273, height: 'fit-content' }}
		cover={
			<img
				alt="example"
				src="https://rocketium.com/images/v2/609213e3d560562f9508621f/resized/661eded7-4633-42ea-b717-7da6dac98c66_1702072772932.png"
			/>
		}
		actions={[
			<CommentOutlined key="comment" />,
			props.role === 'owner' ? (
				<EditOutlined key="edit" />
			) : (
				<MoneyCollectOutlined
					key="money"
					onClick={props.openBidModal}
				/>
			),
			<EllipsisOutlined key="ellipsis" onClick={props.sendNotification}/>,
		]}
	>
		<Meta
			avatar={<Avatar>U</Avatar>}
			title="Smart Contract for News"
			description="AI and Manual Audit Required "
		/>
	</Card>
);

export default AuditRequestCard;
