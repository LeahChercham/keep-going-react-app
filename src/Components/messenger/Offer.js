import React, { useEffect, useState, useRef } from 'react'
import { st as myStyles } from './styles'
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getOfferContacts, getOffer, offerSend, updateOffer } from '../../store/actions/offerAction';
import { userGet } from '../../store/actions/authActions';
import { io } from 'socket.io-client';

function Offer(props) {


    const dispatch = useDispatch();
    const socket = useRef();
    
    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const { offer, offerContacts, offerSendSuccess, offerGetSuccess } = useSelector(state => state.offer);
    const myInfo = user
    
    let currentContact = props.currentContact;
    
    useEffect(() => {
        socket.current = io('ws://localhost:8000');

        socket.current.on('getOffer', (data) => {
            // dispatch({
            //     type: 'OFFER_GET_SUCCESS',
            //     payload: {
            //         offer: data
            //     }
            // })
            console.log(data)
        })

        socket.current.on('ofrDeliveredResponse', ofr => {
            dispatch({
                type: 'DELIVERED_OFFER',
                payload: {
                    messageInfo: ofr
                }
            })
        })

    }, []);

    const respondToOffer = (response) => {
        let responseOffer = offer
        response === 'accept' ? offer.status = 'accepted' : offer.status = 'declined'

        const data = {
            senderName: myInfo.username,
            receiverId: currentContact._id,
            offer: responseOffer,
            senderId: myInfo.id,
        }

        dispatch(updateOffer(data)).then((res) => {
            console.log("getting user hopefully updated tokens")
            dispatch(userGet(myInfo))
        })

        socket.current.emit('respondToOffer', {
            senderId: myInfo.id,
            receiver: currentContact._id,
            offer: responseOffer
        })
    }


    return (<div style={myStyles.offer}>

        {offer?.offer ?

            offer.senderName === myInfo.username ?
                offer.status !== 'accepted' ?
                    <span
                        style={{ height: "2em", alignItems: 'center', display: 'flex' }}>
                        You send a new offer:
                        <span style={{ color: 'darkBlue' }}>
                            {offer.offer.price} Tokens
                        </span>
                        <span>...waiting for answer</span>
                    </span> : <span>Offer Accepted! You received {offer.offer.price} Tokens</span>
                :
                offer.status !== 'accepted' ?
                    <span
                        style={{ height: "2em", alignItems: 'center', display: 'flex' }}>
                        {offer.senderName} send you a new offer:
                        <span style={{ color: 'darkBlue' }}>
                            {offer.offer.price} Tokens
                        </span>
                        <Button onClick={(e) => { respondToOffer('accept') }}> Accept </Button>
                        <Button onClick={(e) => { respondToOffer('decline') }}> Decline </Button>
                    </span> : <span>Offer Accepted! You paid {offer.offer.price} Tokens</span>
            : null}
    </div>
    )
}

export default Offer;