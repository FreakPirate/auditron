import React, { useState } from 'react';
import { Button, InputNumber, Modal } from 'antd';
import UploadDropZone from './UploadDropZone';
import styled from 'styled-components';

const UploadModal = (props: {
	isModalOpen: boolean;
	closeModal: () => void;
}) => {
	const { isModalOpen, closeModal } = props;

	const handleOk = () => {
		closeModal();
	};

	const handleCancel = () => {
		closeModal();
	};

	return (
		<>
			<StyledModal
				title="Create Audit Request"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<InputNumber
					addonBefore={'Budget'}
					prefix="$"
					style={{ width: '100%' }}
				/>
				<UploadDropZone />
			</StyledModal>
		</>
	);
};

const StyledModal = styled(Modal)`
	.ant-modal-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin: 24px 0px;

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
		padding: 24px;
	}
`;

export default UploadModal;