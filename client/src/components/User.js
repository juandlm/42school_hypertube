import React, { Component } from 'react';
import axios from 'axios';
// import { alertSuccess, alertWarning, alertInfo } from '../../../utils/alertUse';
// import API from '../../../utils/API';

import NoMatch from './NoMatch';
// import UserDetails from './UserDetails';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.match.params.user,
            userInfo: [],
            isUserExist: false,
        }
    }

    componentDidMount = () => {
        this.getUserInfo(this.state.username);
    }

    getUserInfo = (username) => {
        axios.post('/api/users/getUserInfo', { 'username': username }, { 'Content-Type': 'application/json' })
        .then((res) => {
            if(res.data != null) {
                this.setState({
                    userInfo: res.data,
                    isUserExist: true
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // ************************************************

    render() {
        const { userInfo, isUserExist } = this.state;
        const ifUser = (!isUserExist) ? <NoMatch /> : ''; //<UserDetails info={userInfo} onClick={this.handleClick} />
        return (
                <div>
                    
                    my username is {userInfo.username}<br />
                    my full name is {userInfo.firstName} {userInfo.lastName}
                    {ifUser}
                </div>
        )
    }
}

export default User