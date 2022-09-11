import axios from 'axios';
import { OFFER_GET_SUCCESS, OFFER_GET_SUCCESS_CLEAR, UPDATE_OFFER, UPDATE_CONTACT_OFFER, SOCKET_OFFER, OFFER_SEND_SUCCESS } from '../types/offerType';
import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE
const util = require("util")

export const getContacts = (myId) => async (dispatch) => {
    // try {
    //     const response = await axios.get(CREATE_ROUTE(`messenger/get-contacts/${myId}`));
    //     dispatch({
    //         type: CONTACT_GET_SUCCESS,
    //         payload: {
    //             contacts: response.data.contacts
    //         }
    //     })

    // } catch (error) {
    //     console.log(error.response.data);
    // }
}

export const offerSend = (data) => async (dispatch) => {
    // try {
    //     const response = await axios.post(CREATE_ROUTE('messenger/send-message'), data);
    //     dispatch({
    //         type: MESSAGE_SEND_SUCCESS,
    //         payload: {
    //             message: response.data.message
    //         }
    //     })
    // } catch (error) {
    //     console.log(error.response.data);
    // }
}


export const getOffer = (expertId, myId) => {

    // return async (dispatch) => {
    //     try {
    //         const response = await axios.get(CREATE_ROUTE(`messenger/get-message/${expertId}/${myId}`));
    //         dispatch({

    //             type: MESSAGE_GET_SUCCESS,
    //             payload: {
    //                 message: response.data.message
    //             }
    //         })

    //     } catch (error) {
    //         console.log("error:" + error)
    //     }
    // }
}


export const sendOffer = (offer) => async (dispatch) => {
    // try {
    //     const response = await axios.post(CREATE_ROUTE('messenger/seen-message'), msg);
    //     console.log(response.data);
    // } catch (error) {
    //     console.log(error.response.message)

    // }
}


export const updateOffer = (msg) => async (dispatch) => {
    // try {
    //     const response = await axios.post(CREATE_ROUTE('messenger/delivered-message'), msg);
    //     console.log(response.data);
    // } catch (error) {
    //     console.log(error.response.message)

    // }
}
