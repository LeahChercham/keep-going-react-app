import React, { useEffect, useState, useRef, useContext } from 'react'
import { st as myStyles } from './styles'
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getOfferContacts, getOffer, offerSend, updateOffer } from '../../store/actions/offerAction';
import { userGet } from '../../store/actions/authActions';
import { SocketContext } from '../../socketContext'

function Offer(props) {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
    const { offer, offerContacts, offerSendSuccess, offerGetSuccess } = useSelector(state => state.offer);
    let myInfo = user

    const [socketOffer, setSocketOffer] = useState('');
    let currentContact = props.currentContact;

    useEffect(() => {
        myInfo = user
    }, [user])

    useEffect(() => {
        socket.on('getOffer', (data) => { // OK
            dispatch({
                type: 'OFFER_GET_SUCCESS',
                payload: {
                    offer: data
                }
            })
            dispatch(userGet(myInfo))

        })

        socket.on('ofrDeliveredResponse', ofr => {
            dispatch({
                type: 'DELIVERED_OFFER',
                payload: {
                    offerInfo: ofr
                }
            })
        })

    }, []);

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

    const respondToOffer = (response) => {
        let status
        response === 'accept' ? status = 'accepted' : status = 'declined'

        let myId = myInfo.id ? myInfo.id : myInfo._id
        const data = { ...offer, status: status }


        dispatch(updateOffer(data)).then((res) => {

            dispatch(userGet(myInfo))
        })



        socket.emit('respondToOffer', {
            senderId: myId,
            askerId: offer.askerId,
            answererId: offer.answererId,
            senderName: myInfo.username,
            receiverId: currentContact._id,
            offer: { price: offer.offer.price },
            status: status,

        })
    }


    return (<div style={myStyles.offer}>
        {offer?.offer ?
            <div>
                <div>
                    {offer.status === "false" ? <span>
                        {offer.senderName === myInfo.username ? <span>Offer send</span>
                            : <span>Offer received</span>}
                    </span>
                        :
                        <span>
                            {offer.status === 'accepted' ? <span>Offer accepted</span> :
                                <span>
                                    {offer.status === "false" ? <span>Offer delivered</span> : <span>Offer declined</span>}
                                </span>
                            }
                        </span>}
                </div>
                <div>
                    {offer.status === "false" ?
                        (offer.askerId === myInfo.id || offer.askerId === myInfo._id) ? <span>You will pay {offer.offer.price} tokens in order for {currentContact.username} to help you. </span>
                            : <span>You will receive {offer.offer.price} tokens in order to help {currentContact.username}.</span>
                        : <span>{offer.status === 'declined' ? <span></span> :

                            (offer.askerId === myInfo.id || offer.askerId === myInfo._id) ? <span>You paid {currentContact.username} {offer.offer.price} tokens. </span>
                                : <span>You received {offer.offer.price} tokens to help {currentContact.username}.</span>
                        }
                        </span>
                    }

                </div>
                <div>
                    {offer.status === "false" ? <span>
                        {offer.senderName === myInfo.username ? <span>... Waiting for an answer</span>
                            : <span>
                                <Button onClick={(e) => { respondToOffer('accept') }}> Accept </Button>
                                <Button onClick={(e) => { respondToOffer('decline') }}> Decline </Button>
                            </span>
                        }</span>
                        : null}
                </div>

            </div>
            : null
        }
    </div>
    )
}

export default Offer;