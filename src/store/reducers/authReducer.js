import { REGISTER_FAIL } from "../types/authType";

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
        case REGISTER_FAIL:
            return {
                ...state,
                error: payload.error,
                authenticated: false,
                user:'',
                loading:true
            }
        case "AUTH_LOADING":
            return {
                ...state,
                loading: true,
            }
        case "AUTH_SUCCESS":
            return {
                ...state,
                loading: false,
                authenticated: true,
                error: "",
                successMessage: "",
            }
        case "AUTH_FAILURE":
            return {
                ...state,
                loading: false,
                authenticated: false,
                error: payload,
                successMessage: "",
            }
        case "AUTH_LOGOUT":
            return {
                ...state,
                loading: false,
                authenticated: false,
                error: "",
                successMessage: "",
            }
        case "AUTH_SUCCESS_MESSAGE":
            return {
                ...state,
                successMessage: payload,
            }
        case "AUTH_ERROR_MESSAGE":
            return {
                ...state,
                error: payload,
            }
        default:
            return state;
    }
}