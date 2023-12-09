import React, { useState } from 'react';
import { Button, InputNumber, Modal, DatePicker, Typography, Input } from 'antd';
import UploadDropZone from './UploadDropZone';
import styled from 'styled-components';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import TextArea from 'antd/es/input/TextArea';
import { useFormik } from 'formik';

const { RangePicker } = DatePicker;

const UploadModal = (props: {
	isModalOpen: boolean;
	closeModal: () => void;
	onSubmitHandler: (values: { [key: string]: any }) => void;
	initialValues: { name: string; description: string; budget: string; files: any };
}) => {
	const { isModalOpen, closeModal, onSubmitHandler, initialValues } = props;
	const formikForm = useFormik({
		initialValues,
		enableReinitialize: true,
		onSubmit: onSubmitHandler,
	});

	const [formState, setFormState] = useState({
		name: '',
		description: '',
		budget: '',
		files: []
	})

	const { name, description, budget, files } = formikForm.values;

	const handleOk = () => {
		props.onSubmitHandler(formState)
		// formikForm.submitForm();
		closeModal();
		// formikForm.resetForm();
	};

	const handleCancel = () => {
		closeModal();
	};

	return (
		<>
			<StyledModal title="Create Audit Request" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<>
					<span>Project name</span>
					<Input
						name={'name'}
						placeholder="Enter project name"
						onChange={(e) => {
							const updates = {...formState, name: e.target.value};
							setFormState(updates)
						}}
						value={formState.name}
					/>
				</>
				<>
					<span>Description</span>
					<TextArea
						showCount
						maxLength={100}
						placeholder="Enter description"
						style={{ height: 120, resize: 'none' }}
						onChange={(e) => {
							const updates = {...formState, description: e.target.value};
							setFormState(updates)
						}}
						value={formState.description}
						name={'description'}
					/>
				</>
				<>
					<span>Budget</span>
					<Input
						addonBefore={'Budget'}
						prefix="$"
						style={{ width: '100%' }}
						onChange={(e) => {
							const updates = {...formState, budget: e.target.value};
							setFormState(updates)
						}}
						value={formState.budget}
						name={'budget'}
					/>
				</>
				<UploadDropZone />
			</StyledModal>
		</>
	);
};

const StyledModal = styled(Modal)`
	.ant-modal-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 8px 0px;

		.ant-upload-wrapper {
			.ant-upload-list {
				overflow: scroll;
				min-height: 15px;
			}
		}

		/* .ant-input-number-group-wrapper {
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
		} */
	}
	.ant-modal-content {
		padding: 24px;
		width: 600px;
	}
`;

export default UploadModal;
