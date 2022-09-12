import axios from 'axios';
import { OFFER_GET_SUCCESS, OFFER_GET_SUCCESS_CLEAR, UPDATE_OFFER, UPDATE_CONTACT_OFFER, SOCKET_OFFER, OFFER_SEND_SUCCESS } from '../types/offerType';
import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE
const util = require("util")

export const getContacts = (myId) => async (dispatch) => {
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
        dispatch({
            type: MESSAGE_SEND_SUCCESS,
            payload: {
                offer: response.data.offer
            }
        })
    } catch (error) {
        console.log(error.response.data);
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


export const sendOffer = (offer) => async (dispatch) => {
    // try {
    //     const response = await axios.post(CREATE_ROUTE('messenger/seen-message'), msg);
    //     console.log(response.data);
    // } catch (error) {
    //     console.log(error.response.message)

    // }
}


export const updateOffer = (ofr) => async (dispatch) => {
    try {
        const response = await axios.post(CREATE_ROUTE('offer/delivered-offer'), ofr);
        console.log(response.data);
    } catch (error) {
        console.log(error.response.offer)
    }
}
