import React from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';

const { Meta } = Card;

const GasInfoComponent = (props: { gasData: any }) => {
	const { gasData } = props;
	const containerStyle = { transform: 'scale(0.9)' }; // Adjust the scaling factor as needed

	return (
		<div style={containerStyle}>
			<h4 style={{ marginBottom: '16px' }}>Gas Fee Information</h4>

			<Row gutter={16}>
				<Col span={8}>
					<Card title="Low Priority">
						<Meta
							title={`Suggested Max Priority Fee Per Gas: ${gasData.low.suggestedMaxPriorityFeePerGas}`}
							description={`Suggested Max Fee Per Gas: ${gasData.low.suggestedMaxFeePerGas}`}
						/>
						<p>
							Max Wait Time Estimate: <Green>{gasData.low.maxWaitTimeEstimate} ms</Green>
						</p>
					</Card>
				</Col>

				<Col span={8}>
					<Card title="Medium Priority">
						<Meta
							title={`Suggested Max Priority Fee Per Gas: ${gasData.medium.suggestedMaxPriorityFeePerGas}`}
							description={`Suggested Max Fee Per Gas: ${gasData.medium.suggestedMaxFeePerGas}`}
						/>
						<p>
							Max Wait Time Estimate: <Green>{gasData.medium.maxWaitTimeEstimate} ms</Green>
						</p>
					</Card>
				</Col>

				<Col span={8}>
					<Card title="High Priority">
						<Meta
							title={`Suggested Max Priority Fee Per Gas: ${gasData.high.suggestedMaxPriorityFeePerGas}`}
							description={`Suggested Max Fee Per Gas: ${gasData.high.suggestedMaxFeePerGas}`}
						/>
						<p>
							Max Wait Time Estimate: <Green>{gasData.high.maxWaitTimeEstimate} ms</Green>
						</p>
					</Card>
				</Col>
			</Row>

			<Card style={{ marginTop: '16px' }} title="General Information">
				<p>
					Estimated Base Fee: <Green>{gasData.estimatedBaseFee}</Green>
				</p>
				<p>
					Network Congestion: <Green>{gasData.networkCongestion}</Green>
				</p>
				<p>
					Latest Priority Fee Range: <Green>{gasData.latestPriorityFeeRange.join(' - ')}</Green>
				</p>
			</Card>
		</div>
	);
};

const Green = styled.span`
	color: #1bce1b;
`;

export default GasInfoComponent;
