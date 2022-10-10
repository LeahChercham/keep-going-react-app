import { EXPERT_GET_SUCCESS } from "../types/expertProfileType";

const expertProfileState = {
    loading: true,
    user: {},
    error: "",
    successMessage: "",
}

export const expertProfileReducer = (state = expertProfileState, action) => {
    const { payload, type } = action;
    switch (type) {
        case EXPERT_GET_SUCCESS:
            return {
                ...state,
                user: payload.user,
            }
        default:
            return state;
    }
}