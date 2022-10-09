import { USER_LOGOUT, OFFER_GET_SUCCESS, OFFER_SEND_SUCCESS_CLEAR, OFFER_GET_SUCCESS_CLEAR, CONTACT_GET_SUCCESS, DELIVERED_OFFER, UPDATE_OFFER, UPDATE_CONTACT_OFFER, SOCKET_OFFER, OFFER_SEND_SUCCESS } from '../types/offerType';



const offerState = {
    offerContacts: [],
    offer: [],
    offerSendSuccess: false,
    offerGetSuccess: false,
    // price: 0,
    // senderName: "",
    // senderId: "",
    // receiverId: "",
    // status: "",
}

export const offerReducer = (state = offerState, action) => {
    const { type, payload } = action;

    if (type === CONTACT_GET_SUCCESS) {
        return {
            ...state,
            offerContacts: payload.contacts
        }
    }



    if (type === OFFER_GET_SUCCESS) {
        return {
            ...state,
            offerGetSuccess: true,
            offer: payload.offer
        }
    }

    if (type === OFFER_SEND_SUCCESS) {
        return {
            ...state,
            offerSendSuccess: true,
            offer: payload.offer
        }
    }

    if (type === SOCKET_OFFER) {
        return {
            ...state,
            offer: payload.offer
        }
    }

    if (type === UPDATE_CONTACT_OFFER) { // hier bug receiverId undefined
        const index = state.offerContacts.findIndex(c => c.contactInfo._id === payload.offerInfo.receiverId || c.contactInfo._id === payload.offerInfo.senderId);
        state.offerContacts[index].offerInfo = payload.offerInfo;
        state.offerContacts[index].offerInfo.status = payload.status;
        return state;
    }



    if (type === OFFER_SEND_SUCCESS_CLEAR) {
        return {
            ...state,
            offerSendSuccess: false
        }
    }


    if (type === DELIVERED_OFFER) {
        const index = state.offerContacts.findIndex(c => c.contactInfo._id === payload.offerInfo.receiverId || c.contactInfo._id === payload.offerInfo.senderId);
        state.offerContacts[index].offerInfo.status = 'delivered';
        return {
            ...state
        };
    }

    if (type === USER_LOGOUT) {
        return {
            ...state,
            offerContacts: [],
            offer: [],
            offerSendSuccess: false,
            offerGetSuccess: false,
        }
    }


    if (type === OFFER_GET_SUCCESS_CLEAR) {
        return {
            ...state,
            offerGetSuccess: false
        }
    }


    return state;
}