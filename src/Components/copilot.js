class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            error: "",
            username:""
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                error: "Passwords do not match"
            })
        } else {
            this.props.signUp(this.state.email, this.state.password, this.state.username);
        }
    }


    render() {
        return (
            <div>
                <div>
                    <TextField
                        id="email"
                        label="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        style={{ width: "100%" }}
                    />
                </div>
                <div>
                    <TextField
                        id="password"
                        label="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        style={{ width: "100%" }}
                    />
                </div>
                <div>
                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        style={{ width: "100%" }}
                    />
                </div>
                <div>
                    <TextField
                        id="username"
                        label="Username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        style={{ width: "100%" }}
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                        Sign Up
                    </Button>
                </div>
                <div>
                    {this.state.error}
                </div>
            </div>
        )
    }

}