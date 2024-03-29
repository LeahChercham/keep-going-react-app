import axios from 'axios';
import { USER_LOGOUT, CONTACT_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS } from "../types/messengerType";
import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE


export const getContacts = (myId) => async (dispatch) => {
    try {
        const response = await axios.get(CREATE_ROUTE(`messenger/get-contacts/${myId}`));
        dispatch({
            type: CONTACT_GET_SUCCESS,
            payload: {
                contacts: response.data.contacts
            }
        })

    } catch (error) {
        console.log(error);
    }
}

export const messageSend = (data) => async (dispatch) => {
    try {

        const response = await axios.post(CREATE_ROUTE('messenger/send-message'), data);
        dispatch({
            type: MESSAGE_SEND_SUCCESS,
            payload: {
                message: response.data.message
            }
        })
    } catch (error) {
        console.log(error.response.data);
    }
}

export const messengerActionLogOut = () =>  () => {
    return dispatch => dispatch({ type: USER_LOGOUT })
}


export const getMessage = (expertId, myId) => {

    return async (dispatch) => {
        try {
            const response = await axios.get(CREATE_ROUTE(`messenger/get-message/${expertId}/${myId}`));
            dispatch({

                type: MESSAGE_GET_SUCCESS,
                payload: {
                    message: response.data.message
                }
            })

        } catch (error) {
            console.log("error:" + error)
        }
    }
}

export const seenMessage = (msg) => async (dispatch) => {
    try {
        const response = await axios.post(CREATE_ROUTE('messenger/seen-message'), msg);
        console.log(response.data);
    } catch (error) {
        console.log(error.response.message)

    }
}


export const updateMessage = (msg) => async (dispatch) => {
    try {
        const response = await axios.post(CREATE_ROUTE('messenger/delivered-message'), msg);
        console.log(response.data);
    } catch (error) {
        console.log(error.response.message)

    }
}
