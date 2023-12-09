import { CONSTANTS } from '@pushprotocol/restapi';
import { ChatUIProvider, ChatView, darkChatTheme } from "@pushprotocol/uiweb";

const ChatWrapper = (props: {}) => {

    return <ChatUIProvider theme={darkChatTheme} env={CONSTANTS.ENV.STAGING}>
                <ChatView
                    chatId="b356e90b3e8c7077ba8ceaadebbbffb8fce079a1b8e061c1fd217a6dc0f8ffbe"
                    limit={10}
                    autoConnect={true}
                />
        </ChatUIProvider>

};

export default ChatWrapper;