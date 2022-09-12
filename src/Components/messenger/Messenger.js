
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

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
    offerContainer: {
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
        width: "100%",
        height: "100%",
    },
    button: {
        fontWeight: 500,
        fontSize: "1em",
    },
    price: {
        display: 'flex',
        alignSelf: 'center',
        fontSize: "1em",
        fontWeight: 900,
    }, sidebar: {
        display: 'flex'

    }
}

function Messenger(props) {
    const location = useLocation();
    let expert = location.state ? location.state.expert : "";

    const dispatch = useDispatch();
    const scrollRef = useRef();
    const socket = useRef();

    const { contacts, message, messageSendSuccess, messageGetSuccess, new_user_add } = useSelector(state => state.messenger);
    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const { offer } = useSelector(state => state.offer);
    const myInfo = user


    const [currentContact, setCurrentContact] = useState(expert);
    const [socketMessage, setSocketMessage] = useState("");
    const [socketOffer, setSocketOffer] = useState("");
    const [activeUser, setActiveUser] = useState("");
    const [hide, setHide] = useState(true);

    const [typingMessage, setTypingMessage] = useState('');

    const [newMessage, setNewMessage] = useState('');

    const [price, setPrice] = useState(0);
    const [offerFromMe, setOfferFromMe] = useState(false);
    const [newOffer, setNewOffer] = useState(false) // gibt es ein offer ? // Das alles in Redux

    // DAS HIER TESTEN
    useEffect(() => {
        if (contacts && contacts.length > 0) {
            let currentContact = contacts[0].contactInfo
            setCurrentContact(currentContact)
        }
    }, [contacts]);


    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        socket.current.on('getMessage', (data) => {

            setSocketMessage(data)
        })

        socket.current.on('typingMessageGet', (data) => {
            // console.log("typingMessage: " + util.inspect(data, false, 7))
            setTypingMessage(data)
        })

        socket.current.on('getOffer', (data) => {
            setSocketOffer(data)
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

        socket.current.on('ofrDeliveredResponse', ofr => {
            dispatch({
                type: 'DELIVERED_OFFER',
                payload: {
                    messageInfo: ofr
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
        if (socketMessage && currentContact !== "") {
            if (socketMessage.senderId === currentContact._id && socketMessage.receiverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
                dispatch(seenMessage(socketMessage));
                socket.current.emit('messageSeen', socketMessage);
                dispatch({
                    type: 'UPDATE_CONTACT_MESSAGE',
                    payload: {
                        messageInfo: socketMessage,
                        status: 'seen'
                    }
                })
            }
        }
        setSocketMessage('')
    }, [socketMessage]);
    // end second use effect


    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []);
    // end third use effect

    useEffect(() => {
        socket.current.on('getUser', (users) => {
            const activeUser = users.filter(u => u.userId !== myInfo.id)
            setActiveUser(activeUser)
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
        if (socketMessage && socketMessage.senderId !== currentContact._id && socketMessage.receiverId === myInfo.id) {
            //  notificationSPlay();
            toast.success(`${socketMessage.senderName} Send a New Message`)
            dispatch(updateMessage(socketMessage));
            socket.current.emit('deliveredMessage', socketMessage);
            dispatch({
                type: 'UPDATE_CONTACT_MESSAGE',
                payload: {
                    messageInfo: socketMessage,
                    status: 'delivered'
                }
            })

        }
    }, [socketMessage]);
    
    useEffect(() => {
        if (socketOffer && socketOffer.senderId !== currentContact._id && socketOffer.receiverId === myInfo.id) {
            //  notificationSPlay();
            toast.success(`${socketOffer.senderName} Send a New Offer`)
            dispatch(updateOffer(socketOffer));
            socket.current.emit('deliveredOffer', socketOffer);
            dispatch({
                type: 'UPDATE_CONTACT_OFFER',
                payload: {
                    offerInfo: socketOffer,
                    status: 'delivered'
                }
            })

        }
    }, [socketOffer]);


    const handleInput = (newMessage) => { // TODO need main in here then
        setNewMessage(newMessage)
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentContact._id,
            msg: newMessage
        })

    }
    const sendOffer = () => {
        const data = {
            senderName: myInfo.username,
            senderId: myInfo.id,
            receiverId: currentContact._id,
            price: price,
            senderId: myInfo.id,
        }

        socket.current.emit('sendOffer', {
            senderId: myInfo.id,
            receiverId: currentContact._id,
            price: price
        })

        dispatch(sendOffer(data));
        setNewOfferFromMe(true)
        setOffer(true)
    }

    const sendMessage = (msg) => {
        // sendingSPlay();

        const data = {
            senderName: myInfo.username,
            receiverId: currentContact._id,
            message: newMessage ? newMessage : '❤',
            senderId: myInfo.id,
        }


        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiver: currentContact._id,
            msg: ''
        })

        dispatch(messageSend(data));
        setNewMessage('');
    }

    useEffect(() => {
        // console.log("messageSendSuccess: " + messageSendSuccess)
        // console.log("message: " + message)
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
        // console.log(myInfo.id)
        dispatch(getContacts(myInfo.id))
        dispatch({ type: 'NEW_USER_ADD_CLEAR' })
    }, [new_user_add]);





    useEffect(() => {
        dispatch(getMessage(currentContact._id, myInfo.id));
        if (contacts.length > 0) {

        }
    }, [currentContact?._id]);

    useEffect(() => {
        if (message.length > 0) {
            if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: currentContact._id
                    }
                })
                socket.current.emit('seen', { senderId: currentContact._id, receiverId: myInfo.id })
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

    const updatePrice = (updateDirection) => {
        debugger
        let newPrice
        let oldPrice = price
        if (updateDirection === "up") {

            newPrice = ++oldPrice
            setPrice(newPrice)
        }
        if (updateDirection === "down") {
            newPrice = --oldPrice
            setPrice(newPrice)
        }

    }

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

                        {contacts && contacts.length > 0 ? contacts.map((contact, index) =>
                            contact.messageInfo ?
                                <Conversation
                                    key={index}
                                    onClick={() => { setCurrentContact(contact.contactInfo) }}
                                    active={currentContact._id === contact.contactInfo._id ? true : false}
                                    // activeUser={activeUser} 
                                    name={contact.contactInfo.username} info={contact.messageInfo ? contact.messageInfo.message.text : "no messages yet"}>

                                </Conversation> : null
                        ) : <Conversation name={"No Contacts"} info="No Messages">

                        </Conversation>}

                    </ConversationList>
                </Sidebar>

                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        {/* <Avatar src={zoeIco} name="Zoe" /> */}
                        <ConversationHeader.Content userName={currentContact.username}
                        // info="Active 10 mins ago" 
                        />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <InfoButton />
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList typingIndicator={typingMessage ? <TypingIndicator content={currentContact.username + " is typing"} /> : false} >
                        {/* 
                        {typingMessage.senderId === currentContact._id ? <TypingIndicator content=" is typing" /> : null} */}


                        {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}
                        {message && message.length > 0 ?

                            message.map((msg, index) =>
                            (msg.senderId === myInfo.id ?
                                < Message key={index}
                                    model={{
                                        message: msg.message.text,
                                        sentTime: "15 mins ago",
                                        sender: msg.senderName,
                                        direction: "outgoing",
                                        position: "normal"
                                    }} avatarSpacer /> :
                                <Message key={index}
                                    model={{
                                        message: msg.message.text,
                                        sentTime: "15 mins ago",
                                        sender: msg.senderName,
                                        direction: "incoming",
                                        position: "single"
                                    }} avatarSpacer />
                            ))



                            : null}




                    </MessageList>
                    <MessageInput placeholder="Type message here"
                        onSend={(e) => sendMessage(e)}
                        onChange={(e) => handleInput(e)}
                    />
                </ChatContainer>

                <Sidebar position="right" style={styles.sidebar}>
                    <div style={styles.offerContainer}>
                        <Button style={styles.button} onClick={() => updatePrice("down")}>-</Button>
                        <div style={styles.price}>{price}</div>
                        <Button style={styles.button} onClick={() => updatePrice("up")}>+</Button>
                        <Button style={styles.button} onClick={(e) => sendOffer(e)}>Send Offer</Button>
                    </div>
                </Sidebar>
            </MainContainer>
        </div></div >
    )
}
export default Messenger;
