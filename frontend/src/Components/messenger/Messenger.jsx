
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Sidebar, Search, ConversationList, Conversation, ExpansionPanel, ConversationHeader, VoiceCallButton, VideoCallButton, InfoButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import { useDispatch, useSelector } from 'react-redux';

import toast, { Toaster } from 'react-hot-toast';
import { getContacts, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, } from '../../store/actions/messengerAction';
import { getOfferContacts, getOffer, offerSend, updateOffer } from '../../store/actions/offerAction';
import { userGet } from '../../store/actions/authActions';

import { SocketContext } from '../../socketContext';

import { st as myStyles } from './styles'
import Offer from './Offer';
const util = require("util")


function Messenger(props) {
    const socket = useContext(SocketContext)
    const location = useLocation();

    const dispatch = useDispatch();
    const scrollRef = useRef();
    // const socket = useRef();

    const { contacts, message, messageSendSuccess, messageGetSuccess, new_user_add } = useSelector(state => state.messenger);
    let expert = location.state ? location.state.expert : contacts && contacts.length > 0 ? contacts[0].contactInfo : "";
    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const { offer, offerContacts, offerSendSuccess, offerGetSuccess } = useSelector(state => state.offer);
    let myInfo = user


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

    const [askerId, setAskerId] = useState("")
    const [answererId, setAnswererId] = useState("")

    useEffect(() => {
        myInfo = user
    }, [user])


    useEffect(() => {

        socket.on('getMessage', (data) => {
            setSocketMessage(data)
        })

        socket.on('getOffer', (data) => {
            setSocketOffer(data)
        })

        socket.on('typingMessageGet', (data) => {
            setTypingMessage(data)
        })

        socket.on('msgSeenResponse', msg => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    messageInfo: msg
                }
            })
        })

        socket.on('msgDeliveredResponse', msg => {
            dispatch({
                type: 'DELIVERED_MESSAGE',
                payload: {
                    messageInfo: msg
                }
            })
        })

        socket.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })

        return () => { socket.current?.disconnect() }
    }, []);

    useEffect(() => {
        let myId = myInfo.id ? myInfo.id : myInfo._id
        dispatch(getContacts(myId))
    }, [])

    useEffect(() => {
        if (socketMessage && currentContact !== "") {
            let myId = myInfo.id ? myInfo.id : myInfo._id
            if (socketMessage.senderId === currentContact._id && socketMessage.receiverId === myId) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
                dispatch(seenMessage(socketMessage));
                socket.emit('messageSeen', socketMessage);
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
            let myId = myInfo.id ? myInfo.id : myInfo._id
            if (socketOffer.senderId === currentContact._id && socketOffer.receiverId === myId) {
                dispatch({
                    type: 'SOCKET_OFFER',
                    payload: {
                        offer: socketOffer
                    }
                })
            }
        }
        setSocketOffer('')
    }, [socketOffer]);


    useEffect(() => {
        let myId = myInfo.id ? myInfo.id : myInfo._id
        socket.emit('addUser', myId, myInfo)
    }, []);

    useEffect(() => {
        socket.on('getUser', (users) => {
            let myId = myInfo.id ? myInfo.id : myInfo._id
            const activeUser = users.filter(u => u.userId !== myId)
            setActiveUser(activeUser)
        })

        socket.on('new_user_add', data => {
            dispatch({
                type: 'NEW_USER_ADD',
                payload: {
                    new_user_add: data
                }
            })
        })
    }, []);


    useEffect(() => {
        let myId = myInfo.id ? myInfo.id : myInfo._id
        if (socketMessage && socketMessage.senderId !== currentContact._id && socketMessage.receiverId === myId) {
            //  notificationSPlay();
            toast.success(`${socketMessage.senderName} Send a New Message`)
            dispatch(updateMessage(socketMessage));
            socket.emit('deliveredMessage', socketMessage);
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
        let myId = myInfo.id ? myInfo.id : myInfo._id
        if (socketOffer && socketOffer.senderId !== currentContact._id && socketOffer.receiverId === myId) {
            toast.success(`${socketOffer.senderName} Send a New Offer`)
            dispatch(updateOffer(socketOffer));
            socket.emit('deliveredOffer', socketOffer);

        }
    }, [socketOffer]);


    const handleInput = (newMessage) => { // TODO need main in here then
        let myId = myInfo.id ? myInfo.id : myInfo._id
        setNewMessage(newMessage)
        socket.emit('typingMessage', {
            senderId: myId,
            receiverId: currentContact._id,
            msg: newMessage
        })

    }

    useEffect(() => {
        if (offerSendSuccess) {

            let sendId
            user.id ? sendId = user.id : sendId = user._id
            socket.emit('sendOffer', {
                senderName: user.username,
                receiverId: currentContact._id,
                offer: { price: price },
                askerId: askerId,
                senderId: sendId,
                answererId: answererId,
                status: "false"
            })
            dispatch({
                type: 'OFFER_SEND_SUCCESS_CLEAR'
            })
        }
    }, [offerSendSuccess])

    const sendOffer = (type) => {

        let askId
        let answId
        let myId
        user.id ? myId = user.id : myId = user._id

        if (type === 'asker') {
            setAskerId(myId)
            askId = myId
            answId = currentContact._id
            setAnswererId(currentContact._id)

        } else {
            askId = currentContact._id
            setAskerId(currentContact._id)
            answId = myId
            setAnswererId(myId)
        }



        const data = {
            senderName: user.username,
            senderId: myId,
            receiverId: currentContact._id,
            offer: { price: price },
            askerId: askId,
            answererId: answId,
            status: "false"
        }

        dispatch(offerSend(data));


        socket.emit('sendOffer', {
            senderName: user.username,
            senderId: myId,
            receiverId: currentContact._id,
            offer: { price: price },
            askerId: askId,
            answererId: answId,
            status: "false"
        })


        setNewOffer(true)
        setOfferFromMe(true)
    }

    const sendMessage = (msg) => {
        let myId = myInfo.id ? myInfo.id : myInfo._id

        const data = {
            senderName: myInfo.username,
            receiverId: currentContact._id,
            message: newMessage ? newMessage : '❤',
            senderId: myId
        }

        setTypingMessage('')

        socket.emit('typingMessage', {
            senderId: myId,
            receiver: currentContact._id,
            receiverId: currentContact._id,
            msg: ''
        })

        dispatch(messageSend(data));
        setNewMessage('');
    }

    useEffect(() => {
        if (messageSendSuccess) { // from redux state
            socket.emit('sendMessage', message[message.length - 1]);
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
        console.log(myInfo)
        let myId = myInfo.id ? myInfo.id : myInfo._id
        dispatch(getContacts(myId))
        dispatch({ type: 'NEW_USER_ADD_CLEAR' })
    }, [new_user_add]);

    useEffect(() => {
        let myId = myInfo.id ? myInfo.id : myInfo._id
        dispatch(getMessage(currentContact._id, myId));
        dispatch(getOffer(currentContact._id, myId));
    }, [currentContact?._id]);


    useEffect(() => {
        if (message.length > 0) {
            let myId = myInfo.id ? myInfo.id : myInfo._id
            if (message[message.length - 1].senderId !== myId && message[message.length - 1].status !== 'seen') {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: currentContact._id
                    }
                })
                socket.emit('seen', { senderId: currentContact._id, receiverId: myId })
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
                                (msg.senderId === myInfo.id || msg.senderId === myInfo._id ?
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
                        <ExpansionPanel open title="Create new offer">
                            <div style={styles.offerContainer}>
                                <div style={styles.offerButtons}>
                                    <Button style={styles.button} onClick={() => updatePrice("down")}>-</Button>
                                    <div style={styles.price}>{price}</div>
                                    <Button style={styles.button} onClick={() => updatePrice("up")}>+</Button>

                                </div>
                                <Button style={styles.button} onClick={(e) => sendOffer("asker")}>Send Offer (I need help!) </Button>
                                <Button style={styles.button} onClick={(e) => sendOffer("answerer")}>Send Offer (I'll help!)</Button>
                            </div>
                        </ExpansionPanel>
                        {/* <ExpansionPanel open title="Older Offers">
                        

                            {offerContacts && offerContacts.length > 0 ? offerContacts.map((contact, index) => {
                                <div>
                                    <div>

                                         asker : {contact.offerInfo.askerId} 
                    </div>
                    <div>
                        price : {contact.offerInfo.offer.price}

                    </div>
                    <div>

                    </div>
                    <div>
                        status : {contact.offerInfo.status}
                    </div>
            </div>
                            }) : null}

        </ExpansionPanel> */}
                    </Sidebar>
                </MainContainer >
            </div >
        </div ></div >
    )
}
export default Messenger;