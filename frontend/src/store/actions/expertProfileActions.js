import Axios from 'axios';
import consts from '../../consts'

export const getExpertProfile = (username) => {

    return async (dispatch) => {
        try {
            let response = await Axios.get(CREATE_ROUTE(`user/username/${username}`))
            let user = { ...response.data }
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    user
                }
            })
        } catch {

        }
    }
}