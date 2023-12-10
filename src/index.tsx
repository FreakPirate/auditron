import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { theme } from 'antd';

const { darkAlgorithm, compactAlgorithm } = theme;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#5274FF',
					colorInfo: '#5274FF',
				},
				algorithm: [darkAlgorithm, compactAlgorithm],
			}}
		>
			<App role="auditor" stakeholderId="user124" userId="user124" />
		</ConfigProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
