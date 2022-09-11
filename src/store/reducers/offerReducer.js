import { OFFER_GET_SUCCESS, OFFER_GET_SUCCESS_CLEAR, DELIVERED_OFFER, UPDATE_OFFER, UPDATE_CONTACT_OFFER, SOCKET_OFFER, OFFER_SEND_SUCCESS } from '../types/offerType';



const offerState = {
    contacts: [],
    offer: "",
    offerSendSuccess: false,
    offerGetSuccess: false,
    price: 0,
    senderId: "",
    receiverId: "",
    acceptedFromReceiver: false,
    declinedFromReceiver: false,

}

export const offerReducer = (state = offerState, action) => {
    const { type, payload } = action;





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
            offer: [...state.offer, payload.offer]
        }
    }

    if (type === SOCKET_OFFER) {
        return {
            ...state,
            offer: [...state.offer, payload.offer]
        }
    }

    if (type === UPDATE_CONTACT_OFFER) { // ? Needed ?
        const index = state.contacts.findIndex(c => c.contactInfo._id === payload.offerInfo.receiverId || c.contactInfo._id === payload.offerInfo.senderId);
        state.contacts[index].offerInfo = payload.offerInfo;
        state.contacts[index].offerInfo.status = payload.status;
        return state;
    }



    if (type === OFFER_SEND_SUCCESS_CLEAR) {
        return {
            ...state,
            offerSendSuccess: false
        }
    }


    if (type === DELIVERED_OFFER) {
        const index = state.contacts.findIndex(c => c.contactInfo._id === payload.offerInfo.receiverId || c.contactInfo._id === payload.offerInfo.senderId);
        state.contacts[index].offerInfo.status = 'delivered';
        return {
            ...state
        };
    }


    if (type === UPDATE) {
        const index = state.contacts.findIndex(c => c.contactInfo._id === payload.id);
        if (state.contacts[index].offerInfo) {
            state.contacts[index].offerInfo.status = 'seen';
        }
        return {
            ...state
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