
import React from 'react'
import { useLocation } from 'react-router-dom';

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, VoiceCallButton, MessageSeparator, TypingIndicator, ConversationHeader, Avatar, VideoCallButton, InfoButton } from '@chatscope/chat-ui-kit-react';

const myStyles = {
    main: {
        // display: "flex",
        // flexFlow: "row",
        // justifyContent: "space-evenly",
        // alignContent: "center",
        width: "100%",
    },
}

function Main(props) {

    return (
        <div style={myStyles.main}>

            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Back />
                    {/* <Avatar src={zoeIco} name="Zoe" /> */}
                    <ConversationHeader.Content userName="Zoe" info="Active 10 mins ago" />
                    <ConversationHeader.Actions>
                        <VoiceCallButton />
                        <VideoCallButton />
                        <InfoButton />
                    </ConversationHeader.Actions>
                </ConversationHeader>
                <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>

                    <MessageSeparator content="Saturday, 30 November 2019" />






                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Patrik",
                        direction: "outgoing",
                        position: "single"
                    }} avatarSpacer />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Zoe",
                        direction: "incoming",
                        position: "first"
                    }} avatarSpacer />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Zoe",
                        direction: "incoming",
                        position: "normal"
                    }} avatarSpacer />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Zoe",
                        direction: "incoming",
                        position: "normal"
                    }} avatarSpacer />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Zoe",
                        direction: "incoming",
                        position: "last"
                    }}>
                        {/* <Avatar src={zoeIco} name="Zoe" /> */}
                    </Message>

                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Patrik",
                        direction: "outgoing",
                        position: "first"
                    }} />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Patrik",
                        direction: "outgoing",
                        position: "normal"
                    }} />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Patrik",
                        direction: "outgoing",
                        position: "normal"
                    }} />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Patrik",
                        direction: "outgoing",
                        position: "last"
                    }} />

                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Zoe",
                        direction: "incoming",
                        position: "first"
                    }} avatarSpacer />
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "15 mins ago",
                        sender: "Zoe",
                        direction: "incoming",
                        position: "last"
                    }}>
                        {/* <Avatar src={zoeIco} name="Zoe" /> */}
                    </Message>
                </MessageList>
                <MessageInput placeholder="Type message here" />
            </ChatContainer>
        </div>
    )
}

export default Main;