
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Sidebar, Search, ConversationList, Conversation, ExpansionPanel, ConversationHeader, VoiceCallButton, VideoCallButton, InfoButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import { useDispatch, useSelector } from 'react-redux';

import toast, { Toaster } from 'react-hot-toast';
import { getContacts, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, } from '../../store/actions/messengerAction';
import { getOfferContacts, getOffer, offerSend, updateOffer } from '../../store/actions/offerAction';
import { userGet } from '../../store/actions/authActions';

import { io } from 'socket.io-client';
import { st as myStyles } from './styles'
import Offer from './Offer';
const util = require("util")


function Messenger(props) {
    const location = useLocation();

    const dispatch = useDispatch();
    const scrollRef = useRef();
    const socket = useRef();

    const { contacts, message, messageSendSuccess, messageGetSuccess, new_user_add } = useSelector(state => state.messenger);
    let expert = location.state ? location.state.expert : contacts && contacts.length > 0 ? contacts[0].contactInfo : "";
    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const { offer, offerContacts, offerSendSuccess, offerGetSuccess } = useSelector(state => state.offer);
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


    useEffect(() => {

        socket.current = io('ws://localhost:8000');



        socket.current.on('getMessage', (data) => {

            setSocketMessage(data)
        })

        // socket.current.on('getOffer', (data) => {
        //     setSocketOffer(data)
        // })


        socket.current.on('typingMessageGet', (data) => {
            // console.log("typingMessage: " + util.inspect(data, false, 7))
            setTypingMessage(data)
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

        // socket.current.on('ofrDeliveredResponse', ofr => {
        //     dispatch({
        //         type: 'DELIVERED_OFFER',
        //         payload: {
        //             messageInfo: ofr
        //         }
        //     })
        // })

        socket.current.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })

        return () => { socket.current?.disconnect() }
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


    useEffect(() => {
        if (socketOffer && currentContact !== "") {
            if (socketOffer.senderId === currentContact._id && socketOffer.receiverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_OFFER',
                    payload: {
                        offer: socketOffer
                    }
                })
                // dispatch(seenOffer(socketOffer));
                // socket.current.emit('messageSeen', socketMessage);
                // dispatch({
                //     type: 'UPDATE_CONTACT_MESSAGE',
                //     payload: {
                //         messageInfo: socketMessage,
                //         status: 'seen'
                //     }
                // })
            }
        }
        setSocketOffer('')
    }, [socketOffer]);


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
            dispatch({
                type: 'UPDATE_CONTACT_OFFER',
                payload: {
                    offerInfo: socketOffer,
                    status: 'delivered'
                }
            })
            socket.current.emit('deliveredOffer', socketOffer);

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

    const sendOffer = (type) => {
        let askerId
        let answererId

        console.log('user: ' + user)

        if (type === 'asker') {
            askerId = user.id
            answererId = currentContact._id
        } else {
            askerId = currentContact._id
            answererId = user.id
        }

        const data = {
            senderName: user.username,
            senderId: user.id,
            receiverId: currentContact._id,
            price: price,
            senderId: user.id,
            askerId: askerId,
            answererId: answererId
        }

        dispatch(offerSend(data));


        socket.current.emit('sendOffer', {
            senderId: user.id,
            receiverId: currentContact._id,
            price: price,
            askerId: askerId,
            answererId: answererId
        })


        setNewOffer(true)
        setOfferFromMe(true)
    }

    const sendMessage = (msg) => {
        // sendingSPlay();

        const data = {
            senderName: myInfo.username,
            receiverId: currentContact._id,
            message: newMessage ? newMessage : '❤',
            senderId: myInfo.id,
        }

        setTypingMessage('')

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiver: currentContact._id,
            receiverId: currentContact._id,
            msg: ''
        })

        console.log('messenger 283')
        console.log(data);
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
        dispatch(getOffer(currentContact._id, myInfo.id));
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
        <div style={myStyles.container}>
            <Offer currentContact={currentContact} />
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
                        <MessageList typingIndicator={typingMessage.msg ? <TypingIndicator content={currentContact.username + " is typing"} /> : false} >
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
                            <div style={styles.offerButtons}>
                                <Button style={styles.button} onClick={() => updatePrice("down")}>-</Button>
                                <div style={styles.price}>{price}</div>
                                <Button style={styles.button} onClick={() => updatePrice("up")}>+</Button>

                            </div>
                            <Button style={styles.button} onClick={(e) => sendOffer("asker")}>Send Offer (I need help!) </Button>
                            <Button style={styles.button} onClick={(e) => sendOffer("answerer")}>Send Offer (I'll help!)</Button>
                        </div>
                    </Sidebar>
                </MainContainer>
            </div>
        </div></div >
    )
}
export default Messenger;
