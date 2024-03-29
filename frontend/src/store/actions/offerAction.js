import axios from 'axios';
import { USER_LOGOUT, CONTACT_GET_SUCCESS, OFFER_GET_SUCCESS, OFFER_SEND_SUCCESS } from '../types/offerType';

import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE


export const getOfferContacts = (myId) => async (dispatch) => {
    try {
        const response = await axios.get(CREATE_ROUTE(`offer/get-contacts/${myId}`));
        dispatch({
            type: CONTACT_GET_SUCCESS,
            payload: {
                contacts: response.data.contacts
            }
        })

    } catch (error) {
        console.log(error.response.data);
    }
}

export const offerActionLogOut = () => {
    return dispatch => dispatch({ type: USER_LOGOUT })
}

export const offerSend = (data) => async (dispatch) => {
    try {
        const response = await axios.post(CREATE_ROUTE('offer/send-offer'), data);
        dispatch({
            type: OFFER_SEND_SUCCESS,
            payload: {
                offer: response.data.offer
            }
        })
    } catch (error) {
        console.log(error);
    }
}


export const getOffer = (expertId, myId) => {

    return async (dispatch) => {
        try {
            const response = await axios.get(CREATE_ROUTE(`offer/get-offer/${expertId}/${myId}`));
            dispatch({

                type: OFFER_GET_SUCCESS,
                payload: {
                    offer: response.data.offer
                }
            })

        } catch (error) {
            console.log("error:" + error)
        }
    }
}

export const updateOffer = (ofr) => async (dispatch) => {

    try {
        const response = await axios.post(CREATE_ROUTE('offer/delivered-offer'), ofr);

        dispatch({

            type: OFFER_GET_SUCCESS,
            payload: {
                offer: response.data.offer
            }
        })

    } catch (error) {
        console.log(error.response.offer)
    }
}
