import { CONTACT_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS, SOCKET_MESSAGE, UPDATE_CONTACT_MESSAGE, MESSAGE_SEND_SUCCESS_CLEAR, SEEN_MESSAGE, DELIVERED_MESSAGE, UPDATE, MESSAGE_GET_SUCCESS_CLEAR, SEEN_ALL } from "../types/messengerType";

const messengerState = {
    contacts: [],
    message: [],
    messageSendSuccess: false,
    messageGetSuccess: false
}

export const messengerReducer = (state=messengerState,action) => {
    const {type,payload} = action;



    if(type === CONTACT_GET_SUCCESS){
         return {
              ...state,
              contacts : payload.contacts
         }
    }

    if(type === MESSAGE_GET_SUCCESS){
         return {
              ...state,
              message_get_success : true,
              message : payload.message
         }
    }

    if(type === MESSAGE_SEND_SUCCESS){
         return {
              ...state,
              mesageSendSuccess : true,
              message : [...state.message,payload.message]
         }
    }

    if(type === SOCKET_MESSAGE){
         return {
              ...state,
              message : [...state.message,payload.message]
         }
    }

    if(type === UPDATE_CONTACT_MESSAGE){
         const index = state.contacts.findIndex(c=>c.contactInfo._id === payload.messageInfo.receiverId || c.contactInfo._id === payload.messageInfo.senderId);
         state.contacts[index].messageInfo = payload.messageInfo;
         state.contacts[index].messageInfo.status = payload.status;
         return state;
    }


    
    if(type === MESSAGE_SEND_SUCCESS_CLEAR){
         return {
              ...state,
              mesageSendSuccess : false               
         }
    }


    if(type === SEEN_MESSAGE){
         const index = state.contacts.findIndex(c=>c.contactInfo._id === payload.messageInfo.receiverId || c.contactInfo._id === payload.messageInfo.senderId);
         state.contacts[index].messageInfo.status = 'seen';
        return {
             ...state
        };
    }

    if(type === DELIVERED_MESSAGE){
         const index = state.contacts.findIndex(c=>c.contactInfo._id === payload.messageInfo.receiverId || c.contactInfo._id === payload.messageInfo.senderId);
         state.contacts[index].messageInfo.status = 'delivered';
        return {
             ...state
        };
    }


    if(type === UPDATE){
         const index = state.contacts.findIndex(c=>c.contactInfo._id === payload.id);
         if(state.contacts[index].messageInfo){
              state.contacts[index].messageInfo.status = 'seen';
         }
         return {
              ...state
         }
    }

    if(type === MESSAGE_GET_SUCCESS_CLEAR){
         return {
              ...state,
              messageGetSuccess : false
         }
    }

    if(type === 'SEEN_ALL'){
         const index = state.contacts.contactIndex(c=>c.contactInfo._id === payload.receiverId);
         state.contacts[index].messageInfo.status = 'seen';
         return {
              ...state
         }
    }

    if(type === 'LOGOUT_SUCCESS'){
         return {
              ...state,
              contacts : [],
              message : [],
              mesageSendSuccess : false,
              messageGetSuccess : false,
             
         }
    }

    // if(type === 'NEW_USER_ADD'){
    //      return{
    //           ...state,
    //           new_user_add : payload.new_user_add
    //      }
    // }

    // if(type === 'NEW_USER_ADD_CLEAR'){
    //      return{
    //           ...state,
    //           new_user_add : ''
    //      }
    // }



    return state;
}