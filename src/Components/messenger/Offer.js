import React, { useEffect, useState, useRef } from 'react'
import { st as myStyles } from './styles'
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getOfferContacts, getOffer, offerSend, updateOffer } from '../../store/actions/offerAction';
import { userGet } from '../../store/actions/authActions';

function Offer(props) {

    // const location = useLocation();
    const dispatch = useDispatch();
    const socket = useRef();

    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const { offer, offerContacts, offerSendSuccess, offerGetSuccess } = useSelector(state => state.offer);
    const myInfo = user

    let currentContact = props.currentContact;

    // ACCEPTING OR DECLINING OFFER
    const acceptOffer = () => {
        let acceptedOffer = offer
        acceptedOffer.status = 'accepted'
        const data = {
            senderName: myInfo.username,
            receiverId: currentContact._id,
            offer: acceptedOffer,
            senderId: myInfo.id,
        }

        dispatch(updateOffer(data)).then((res) => {
            console.log("getting user hopefully updated tokens")
            dispatch(userGet(myInfo))
        })

        socket.current.emit('acceptOffer', {
            senderId: myInfo.id,
            receiver: currentContact._id,
            offer: acceptedOffer
        })
        // setNewMessage('');

    }

    // TO DO
    const declineOffer = () => { }


    return (<div style={myStyles.offer}>
        {/* das alles in separate componente */}

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
                        <Button onClick={(e) => { acceptOffer() }}> Accept </Button>
                        <Button onClick={(e) => { declineOffer() }}> Decline </Button>
                    </span> : <span>Offer Accepted! You paid {offer.offer.price} Tokens</span>
            : null}
    </div>
    )
}

export default Offer;