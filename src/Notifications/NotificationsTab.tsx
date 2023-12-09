import React, { useEffect, useState } from "react";
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb';
import { PushAPI } from "@pushprotocol/restapi";


type Props = {
	pushUser: PushAPI;
};

const NotificationsTab = (props: Props) => {

	const { pushUser } = props;
	const [notificationsList, setNotificationsList] = useState<any>([]);
	
	useEffect(() => {
		const fetchNotifications = async () => {

			const inboxNotifications = await pushUser.notification.list("INBOX");
			console.log('inboxNotifications: ', inboxNotifications);
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