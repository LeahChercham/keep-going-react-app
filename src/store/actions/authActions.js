import Axios from 'axios';
import consts from '../../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE
import { REGISTER_FAIL } from '../types/authType';
export const userRegister = (user) => {

    return async (dispatch) => {

        try {
            const response = await Axios.post(CREATE_ROUTE("user"), user)
            console.log(response)
        } catch (error) {
            console.log(error.response.data)
            dispatch({
                type: REGISTER_FAIL,
                payload: { error: error.response.data.error.errorMessage }
            })
        }

    }
}