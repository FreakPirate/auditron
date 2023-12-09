import React from 'react';
import styled from 'styled-components';
// import { LOGO } from '../constants';
import { Button } from 'antd';

const Login = ({handleLogin}) => {

	return (
		<Wrapper>
			<ImageContainer>
				<Logo
					src={'https://rocketium.com/images/v2/609213e3d560562f9508621f/resized/d238962e-7870-482b-a64c-5917af20d8a1_1702066344117.png'}
					alt="Auditron"
				/>
			</ImageContainer>
			<TextContainer>
				The auditor marketplace 🚀
			</TextContainer>
			<LoginButton type="primary" shape="round" size='large' onClick={handleLogin}>
				Let's get started!
			</LoginButton>
		</Wrapper>
	);
};

export default Login;

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	flex-direction: column;
	background: rgb(25, 25, 25);
	height: 100vh;
`;

const Logo = styled.img`
	width: 450px;
	height: 165px;
`;

const ImageContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const TextContainer = styled.div`
	font-size: 50px;
	color: white;
	font-weight: 800;
	margin-bottom: 50px;
	line-height: 1.2;
	font-family: Inter,Helvetica,sans-serif;
`;

const LoginButton = styled(Button)`
	font-size: 26px !important;
	height: 60px !important;
	background-color: #F73859 !important;
	font-weight: 600 !important;
`;
