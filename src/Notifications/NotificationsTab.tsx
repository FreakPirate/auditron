import React, { useEffect, useState } from "react";
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb';
import { PushAPI, CONSTANTS, SignerType } from "@pushprotocol/restapi";
import * as ethers from "ethers";


type Props = {
	// signer: SignerType;
};

const NotificationsTab = (props: Props) => {

	// const { signer } = props;
	// const userId = '0x4D92c9a3Db746bD0Fb65957eA6054D9d07d90412';
	const PK = '42b625180101ea78fa3df31daa5f3ce99b3062c8ac514e0f762f2f46599eece6'; // channel private key
	const Pkey = `0x${PK}`;
	const signer = new ethers.Wallet(Pkey);
	const [pushUserDetails, setPushUserDetails] = useState<PushAPI | null>(null);
	const [notificationsList, setNotificationsList] = useState<any>([]);
	
	useEffect(() => {
		const fetchNotifications = async () => {
			const pushUser = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
			setPushUserDetails(pushUser);

			const inboxNotifications = await pushUser.notification.list("INBOX");
			console.log('inboxNotifications: ', inboxNotifications);
			setNotificationsList(inboxNotifications);
		};
		fetchNotifications();
	}, [signer]);

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