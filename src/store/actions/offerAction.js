import axios from 'axios';
import { CONTACT_GET_SUCCESS, OFFER_GET_SUCCESS, OFFER_GET_SUCCESS_CLEAR, UPDATE_OFFER, UPDATE_CONTACT_OFFER, SOCKET_OFFER, OFFER_SEND_SUCCESS } from '../types/offerType';
import { USER_UPDATE_SUCCESS } from '../types/authType'
import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE
const util = require("util")

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

export const offerSend = (data) => async (dispatch) => {
    try {
        const response = await axios.post(CREATE_ROUTE('offer/send-offer'), data);
        // console.log("response offer send")
        // console.log("===============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================")
        // console.log(response.data.offer)

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
    console.log("updateOffer")
    console.log(ofr)
    try {
        const response = await axios.post(CREATE_ROUTE('offer/delivered-offer'), ofr);
        console.log(response.data);
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
