import OpenAI from 'openai';
import axios from 'axios';

export const callGPT = async (prompt: string): Promise<string | null> => {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'user', content: prompt }],
	});
	return response.choices[0].message.content;
};

export const generateAuditReport = async (fileUrl: string): Promise<AuditReport | null> => {
	try {
		const response = await axios.get(fileUrl);
		const fileContent = response.data;

		const prompt = `Analyze the following smart contract code (delimited by triple quotes) and provide an audit report in JSON format.
		'''
		${fileContent}
		'''

		Please provide the audit report in the following JSON format:
		{
		"security": "Details about security aspects of the contract...",
		"functionality": "Insights into the functionality and how it meets the intended use cases...",
		"gasOptimization": "Analysis of gas usage and potential optimizations...",
		"codeQuality": "Evaluation of the code quality, readability, and maintainability...",
		"designConsiderations": "Discussion on the contract design and architecture...",
		"complianceAndStandards": "Assessment of adherence to industry standards and regulatory compliance...",
		"conclusion": "Overall summary of the contract's robustness and recommendations...",
		"score": "Overall score out of 10 based on the audit findings",
		"recommendations": ["List of recommendations to improve the score to 10..."]
		}`;

		const auditReportStr = await callGPT(prompt);
		if (!auditReportStr) {
			return null;
		}

		const auditReport = JSON.parse(auditReportStr);
		// write a validator for parsed audit report
		validateAuditReport(auditReport);
		return auditReport;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const validateAuditReport = (auditReport: any) => {
	const keys = [
		'security',
		'functionality',
		'gasOptimization',
		'codeQuality',
		'designConsiderations',
		'complianceAndStandards',
		'conclusion',
		'score',
	];
	keys.forEach(key => {
		if (!auditReport[key]) {
			throw new Error(`Invalid audit report. Missing key: ${key}`);
		}
	});
};

export type AuditReport = {
	security: string;
	functionality: string;
	gasOptimization: string;
	codeQuality: string;
	designConsiderations: string;
	complianceAndStandards: string;
	conclusion: string;
	score: string;
	recommendations: string[];
};
