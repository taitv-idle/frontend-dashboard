import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {admin_login, messageClear} from "../../store/Reducers/authReducer";
import { PropagateLoader } from "react-spinners"
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const AdminLogin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);

    const [state, setState] = useState({
        email: '',
        password: '',
    });
    const inputHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };
    const submit = (e) => {
        e.preventDefault();
        dispatch(admin_login(state));
    };
    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: '24px',
        justifyContent: 'center',
        alignItems: 'center',
    };
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
    }, [errorMessage, successMessage, dispatch, navigate]);


    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex items-center justify-center'>
            <div className='w-[350px] text-[#ffffff] p-2'>
                <div className='bg-[#6f68d1] p-4 rounded-md'>
                    <div className='h-[70px] flex justify-center items-center'>
                        <img className='w-[180px]' src="http://localhost:3000/images/logo.png" alt="logo-image"/>
                    </div>

                    <form onSubmit={submit} action="">
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="email">Email</label>
                            <input onChange={inputHandler} value={state.email} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md'
                                   type="email" name="email" id="email" placeholder="Enter your email" required/>
                        </div>

                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="password">Password</label>
                            <input onChange={inputHandler} value={state.password} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md'
                                   type="password" name="password" id="password" placeholder="Enter your password" required/>
                        </div>

                        <button disabled={loader ? true : false} className='bg-slate-800 w-full hover:shadow-blue-300/hover:shadow-lg text-while rounded-md px-7 py-2 mb-3' type="submit">
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle}/> : 'Login'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;