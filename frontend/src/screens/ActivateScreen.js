import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import axios from "axios";
import {useDispatch} from "react-redux";
import {getUserDetails} from "../actions/userActions";

const ActivateScreen = ({match}) => {
    const activateId = match.params.id
    const dispatch = useDispatch()
    useEffect( async () => {
        await axios.get(`http://localhost:3000/api/users/activate/${activateId}`)
        dispatch(getUserDetails(activateId))

    }, [])
    return (
        <div>
            3
        </div>
    );
};

export default ActivateScreen;