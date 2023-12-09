import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal } from 'antd';
import UploadDropZone from './UploadDropZone';
import styled from 'styled-components';
import { getBidsForProject, getEstimatedGas } from './API';
import { UserBid } from './types';
import GasInfoComponent from './GasInfo';

const AllBidsModal = (props: {
	isModalOpen: boolean;
	closeModal: () => void;
	onSubmitHandler: (projectId: string, id: string) => void;
	projectId: string;
	bids: UserBid[];
}) => {
	const { isModalOpen, closeModal, projectId } = props;
	const [gasData, setGasData] = useState<any>(null);
	useEffect(() => {
		async function fetchData() {
			const gasData = await getEstimatedGas();
			console.log('gasData', gasData);
			setGasData(gasData);
		}
		fetchData();
	}, [isModalOpen]);

	const handleOk = () => {
		// props.onSubmitHandler(formState);
		closeModal();
	};

	const handleCancel = () => {
		closeModal();
	};

	return (
		<>
			<StyledModal title="All bids" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
				<StyledContainer>
					<div>
						<h4>Auditor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bid</h4>
					</div>
					{props.bids.map(bid => {
						return (
							<>
								<StyledBidContainer>
									<p>
										{bid.auditorId}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{bid.bidAmount}
									</p>
									<Button
										type="primary"
										onClick={() => props.onSubmitHandler(projectId, bid.auditorId)}
									>
										Accept
									</Button>
								</StyledBidContainer>
							</>
						);
					})}
				</StyledContainer>
				<GasInfoComponent gasData={gasData} />
			</StyledModal>
		</>
	);
};

const StyledModal = styled(Modal)`
	.ant-modal-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		/* margin: 24px 0px; */

		.ant-upload-wrapper {
			.ant-upload-list {
				overflow: scroll;
				min-height: 15px;
			}
		}

		.ant-input-number-group-wrapper {
			height: 50px;

			.ant-input-number-wrapper {
				height: 100%;

				.ant-input-number-group-addon {
					height: 100%;
				}

				.ant-input-number-affix-wrapper {
					height: 100%;
				}
			}
		}
	}
	.ant-modal-content {
		/* padding: 24px; */
		width: 680px;
	}
`;

const StyledContainer = styled.div`
	display: flex;
	/* justify-content: space-between; */
	padding: 10px 31px;
	flex-direction: column;
`;

const StyledBidContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;
export default AllBidsModal;
