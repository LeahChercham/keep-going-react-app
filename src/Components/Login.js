import { Component } from "react";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            error: ""
        }
    }

    render() {
        return(
            <div>

                "Login Page"
            </div>
        )
    }
}

export default Login;