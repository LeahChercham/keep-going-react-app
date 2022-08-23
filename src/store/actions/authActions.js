import Axios from 'axios';
import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE

export const userRegister = (user) => {


    return async (dispatch) => {
        dispatch({ type: "AUTH_LOADING" })
        try {
            const response = await Axios.post(CREATE_ROUTE("user/register"), user)
            dispatch({ type: "AUTH_SUCCESS", payload: response.data })
        } catch (error) {
            dispatch({ type: "AUTH_FAILURE", payload: error.response.data })
        }
    }

}