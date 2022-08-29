import axios from 'axios';
import { CONTACT_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS } from "../types/messengerType";

export const getContacts = () => async (dispatch) => {
    try {
        const response = await axios.get('/api/messenger/get-contacts');
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

export const messageSend = (data) => async (dispatch) => {
    try {
        const response = await axios.post('/api/messenger/send-message', data);
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


export const getMessage = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/api/messenger/get-message/${id}`)
            dispatch({
                type: MESSAGE_GET_SUCCESS,
                payload: {
                    message: response.data.message
                }
            })
        } catch (error) {
            console.log(error.response.data)
        }
    }
}

// Not in use
// export const ImageMessageSend = (data) => async(dispatch)=>{

//      try{
//           const response = await axios.post('/api/messenger/image-message-send',data);
//           dispatch({
//                type: MESSAGE_SEND_SUCCESS,
//                payload : {
//                     message : response.data.message
//                }
//           })
//      }catch (error){
//           console.log(error.response.data);

//      }

// }

export const seenMessage = (msg) => async (dispatch) => {
    try {
        const response = await axios.post('/api/messenger/seen-message', msg);
        console.log(response.data);
    } catch (error) {
        console.log(error.response.message)

    }
}


export const updateMessage = (msg) => async (dispatch) => {
    try {
        const response = await axios.post('/api/messenger/delivared-message', msg);
        console.log(response.data);
    } catch (error) {
        console.log(error.response.message)

    }
}
