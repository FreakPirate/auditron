import { PushAPI } from '@pushprotocol/restapi';
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb';
import { useEffect, useState } from "react";


type Props = {
	signedPushUser: PushAPI; // This needs to be the one with login details
};

const NotificationsTab = (props: Props) => {

	const { signedPushUser } = props;
	const [notificationsList, setNotificationsList] = useState<any>([]);
	
	useEffect(() => {
		const fetchNotifications = async () => {
			if (signedPushUser) {
				const inboxNotifications = await signedPushUser.notification.list("INBOX");
				console.log('inboxNotifications: ', inboxNotifications);
				setNotificationsList(inboxNotifications);
			}
		};
		fetchNotifications();
	}, [signedPushUser]);

	return (
		<div style={{width:'100%'}}>
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