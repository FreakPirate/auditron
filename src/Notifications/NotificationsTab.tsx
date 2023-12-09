import React, { useEffect, useState } from "react";
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb';
import * as ethers from 'ethers';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';


type Props = {
	pushUser: PushAPI; // This needs to be the one with login details
};

const NotificationsTab = (props: Props) => {

	const { pushUser } = props;
	const [notificationsList, setNotificationsList] = useState<any>([]);
	
	useEffect(() => {
		const fetchNotifications = async () => {
			// if (pushUser) {
			// 	const inboxNotifications = await pushUser.notification.list("INBOX");
			// 	console.log('inboxNotifications: ', inboxNotifications);
			// 	setNotificationsList(inboxNotifications);
			// }
			const PK = '42b625180101ea78fa3df31daa5f3ce99b3062c8ac514e0f762f2f46599eece6'; // channel private key (Already compromised)
			const Pkey = `0x${PK}`;
			const signer = new ethers.Wallet(Pkey);
			const pushUser = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
			const inboxNotifications = await pushUser.notification.list("INBOX");
			setNotificationsList(inboxNotifications);
		};
		fetchNotifications();
	}, [pushUser]);

	return (
		<div>
			{notificationsList.map((oneNotification: any, id: number) => {
				const { 
					cta,
					title,
					message,
					app,
					icon,
					image,
					url,
					blockchain,
					notification
				} = oneNotification;

				return (
					<NotificationItem
						key={id} // any unique id
						notificationTitle={title}
						notificationBody={message}
						cta={cta}
						app={app}
						icon={icon}
						image={image}
						url={url}
						// theme={theme}
						chainName={blockchain as chainNameType} // if using Typescript
					/>
					);
				}
			)}
		</div>
	);
};

export default NotificationsTab;