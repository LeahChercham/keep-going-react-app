
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';


import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Sidebar, Search, ConversationList, Conversation, ExpansionPanel, ConversationHeader, VoiceCallButton, VideoCallButton, InfoButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import { useDispatch, useSelector } from 'react-redux';

import toast, { Toaster } from 'react-hot-toast';
import { getContacts, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, } from '../../store/actions/messengerAction';

import { io } from 'socket.io-client';
const util = require("util")

const myStyles = {
    main: {
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
        width: "100%",
        height: "100%",
    },
}

function Messenger(props) {
    const location = useLocation();
    const expert = location.state.expert;
    const dispatch = useDispatch();
    const scrollRef = useRef();
    const socket = useRef();

    const { contacts, message, messageSendSuccess, messageGetSuccess, new_user_add } = useSelector(state => state.messenger);
    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const myInfo = user

    const [state, setState] = useState({
        currentContact: expert,
        newMessage: "",
        socketMessage: "",
        typingMessage: "",
        activeUser: "",
        hide: true,
    })


    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        socket.current.on('getMessage', (data) => {
            setState({ ...state, socketMessage: data })
            // setSocketMessage(data);
        })

        socket.current.on('typingMessageGet', (data) => {
            // setTypingMessage(data);
            setState({ ...state, typingMessage: data })
        })

        socket.current.on('msgSeenResponse', msg => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    messageInfo: msg
                }
            })
        })

        socket.current.on('msgDeliveredResponse', msg => {
            dispatch({
                type: 'DELIVERED_MESSAGE',
                payload: {
                    messageInfo: msg
                }
            })
        })

        socket.current.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })

    }, []);
    // end first use effect

    useEffect(() => {
        if (state.socketMessage && state.currentContact) {
            if (state.socketMessage.senderId === state.currentContact._id && state.socketMessage.receiverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: state.socketMessage
                    }
                })
                dispatch(seenMessage(state.socketMessage));
                socket.current.emit('messageSeen', state.socketMessage);
                dispatch({
                    type: 'UPDATE_CONTACT_MESSAGE',
                    payload: {
                        messageInfo: state.socketMessage,
                        status: 'seen'
                    }
                })
            }
        }
        // setSocketMessage('')
        setState({ ...state, socketMessage: '' })
    }, [state.socketMessage]);
    // end second use effect


    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []);
    // end third use effect

    useEffect(() => {
        socket.current.on('getUser', (users) => {
            const filterUser = users.filter(u => u.userId !== myInfo.id)
            // setActiveUser(filterUser);
            setState({ ...state, activeUser: filterUser })
        })

        socket.current.on('new_user_add', data => {
            dispatch({
                type: 'NEW_USER_ADD',
                payload: {
                    new_user_add: data
                }
            })
        })
    }, []);
    // end fourth use effect

    useEffect(() => {
        if (state.socketMessage && state.socketMessage.senderId !== state.currentContact._id && state.socketMessage.receiverId === myInfo.id) {
            //  notificationSPlay();
            toast.success(`${state.socketMessage.senderName} Send a New Message`)
            dispatch(updateMessage(state.socketMessage));
            socket.current.emit('deliveredMessage', state.socketMessage);
            dispatch({
                type: 'UPDATE_CONTACT_MESSAGE',
                payload: {
                    messageInfo: state.socketMessage,
                    status: 'delivered'
                }
            })

        }
    }, [state.socketMessage]);
    // end fith use effect

    const handleInput = (newMessage) => { // TODO need main in here then
        setState({ ...state, newMessage })

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: state.currentContact._id,
            msg: newMessage
        })

    }

    const sendMessage = (msg) => { //TODO need button here
        // sendingSPlay();
        const data = {
            senderName: myInfo.username,
            receiverId: state.currentContact._id,
            message: state.newMessage ? state.newMessage : '❤',
            senderId: myInfo.id,
        }


        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiver: state.currentContact._id,
            msg: ''
        })

        dispatch(messageSend(data));
        setState({ ...state, newMessage: '' })
    }

    useEffect(() => {
        debugger
        console.log("messageSendSuccess: " + messageSendSuccess)
        console.log("message: " + message)
        if (messageSendSuccess) { // from redux state
            socket.current.emit('sendMessage', message[message.length - 1]);
            dispatch({
                type: 'UPDATE_CONTACT_MESSAGE',
                payload: {
                    messageInfo: message[message.length - 1]
                }
            })
            dispatch({
                type: 'MESSAGE_SEND_SUCCESS_CLEAR'
            })
        }
    }, [messageSendSuccess]);

    useEffect(() => {
        // let data = myInfo.id
        console.log(myInfo.id)
        dispatch(getContacts(myInfo.id));
        dispatch({ type: 'NEW_USER_ADD_CLEAR' })
    }, [new_user_add]);

    useEffect(() => {
        if (contacts && contacts.length > 0)
            setState({ ...state, currentContact: contacts[0].contactInfo })
    }, [contacts]);


    useEffect(() => {
        dispatch(getMessage(state.currentContact._id, myInfo.id));
        if (contacts.length > 0) {

        }
    }, [state.currentContact?._id]);

    useEffect(() => {
        if (message.length > 0) {
            if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: state.currentContact._id
                    }
                })
                socket.current.emit('seen', { senderId: state.currentContact._id, receiverId: myInfo.id })
                dispatch(seenMessage({ _id: message[message.length - 1]._id }))
            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR'
        })

    }, [messageGetSuccess]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message]);




    return (<div>
        <Toaster // notification
            position={'top-right'}
            reverseOrder={false}
            toastOptions={{
                style: {
                    display: 'absolute',
                    fontSize: '18px'
                }
            }}

        />
        <div style={myStyles.main}>

            <MainContainer responsive style={{ width: '100%' }}>
                <Sidebar position="left" scrollable={true}>
                    {/* <Search placeholder="Search..." /> */}
                    <ConversationList>
                        {/* Map conversations here */}

                        {contacts && contacts.length > 0 ? contacts.map((contact, index) =>

                            <Conversation
                                key={index}
                                onClick={() => { setState({ ...state, currentContact: contact.contactInfo }) }}
                                active={state.currentContact._id === contact.contactInfo._id ? true : false}
                                // activeUser={state.activeUser} 
                                name={contact.username} info="Last Message">
                                {/* <Avatar src={lillyIco} name="Lilly" status="available" /> */}
                            </Conversation>
                        ) : <Conversation name={"No Contacts"} info="No Messages">
                            {/* <Avatar src={lillyIco} name="Lilly" status="available" /> */}
                        </Conversation>}

                    </ConversationList>
                </Sidebar>
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        {/* <Avatar src={zoeIco} name="Zoe" /> */}
                        <ConversationHeader.Content userName={state.currentContact.username}
                        // info="Active 10 mins ago" 
                        />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <InfoButton />
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList typingIndicator={state.typingMessage ? <TypingIndicator content={state.currentContact.username + " is typing"} /> : false} >

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
                    <MessageInput placeholder="Type message here"
                        onSend={(e) => sendMessage(e)}
                        onChange={(e) => handleInput(e)}
                    />
                </ChatContainer>

                <Sidebar position="right">
                    <ExpansionPanel open title="INFO">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                    </ExpansionPanel>
                    <ExpansionPanel title="LOCALIZATION">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                    </ExpansionPanel>
                    <ExpansionPanel title="MEDIA">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                    </ExpansionPanel>
                    <ExpansionPanel title="SURVEY">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                    </ExpansionPanel>
                    <ExpansionPanel title="OPTIONS">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum</p>
                    </ExpansionPanel>
                </Sidebar>
            </MainContainer>
        </div></div>
    )
}
export default Messenger;
