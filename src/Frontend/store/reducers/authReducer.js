import { USER_GET_FAIL, USER_GET_SUCCESS, AUTH_FAIL, AUTH_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, CLEAR_ERROR, USER_LOGOUT, USER_UPDATE_FAIL, USER_UPDATE_SUCCESS } from "../types/authType";

const authState = {
    loading: true,
    authenticated: false,
    error: "",
    successMessage: "",
    user: '',
}

export const authReducer = (state = authState, action) => {
    const { payload, type } = action;
    switch (type) {
        case AUTH_FAIL:
            return {
                ...state,
                error: payload.error,
                authenticated: false,
                user: '',
                loading: true
            }
        case USER_LOGIN_FAIL:
            return {
                ...state,
                error: payload.error,
                authenticated: false,
                user: '',
                loading: true
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                error: "",
                successMessage: payload.successMessage,
                user: payload.user,
            }

        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                error: "",
                successMessage: payload.successMessage,
                user: payload.user,
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: ""
            }
        case USER_LOGOUT:
            return {
                ...state,
                loading: true,
                authenticated: false,
                error: "",
                successMessage: "",
                user: '',
            }
        case USER_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                error: "",
                successMessage: payload.successMessage,
                user: payload.user,
            }
        case USER_UPDATE_FAIL:
            return {
                ...state,
                error: payload.error,
                authenticated: true,
                loading: true
            }
        case USER_GET_FAIL:
            return {
                ...state,
                error: payload.error,
            }
        
        case USER_GET_SUCCESS:
            return{
                ...state,
                error: "",
                successMessage: payload.successMessage,
                user: payload.user,
            }
        default:
            return state;
    }
}