import * as ethers from 'ethers';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';

const useSendNotifications = () => {
	const sendNotification = async ({title, body, recipient}: {
		title: string;
		body: string;
		recipient: string[];
	}) => {
		console.log('Sending notification');
		// Hardcoding the Admin details because only Admin can send notifications to the channel
		const PK = '42b625180101ea78fa3df31daa5f3ce99b3062c8ac514e0f762f2f46599eece6'; // channel private key (Already compromised)
		const Pkey = `0x${PK}`;
		const signer = new ethers.Wallet(Pkey);
		const pushUser = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
		const sendNotifRes = await pushUser.channel.send(recipient, {
			notification: { title, body },
		});
		console.log('sendNotifRes: ', sendNotifRes);
	}

	return [sendNotification] as const;
};

export { useSendNotifications };
