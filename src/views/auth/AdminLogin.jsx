import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        email: "",
        password: ""
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(admin_login(state));
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
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800'>
            <div className='w-[400px] p-6 bg-white shadow-xl rounded-lg'>
                <div className='flex justify-center mb-6'>
                    <img className='w-32' src="/images/logo.png" alt="Logo" />
                </div>
                <form onSubmit={submit}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="email" className='text-gray-700 font-semibold mb-2'>Email</label>
                        <input
                            onChange={inputHandle}
                            value={state.email}
                            className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none'
                            type="email"
                            name='email'
                            placeholder='Enter your email'
                            id='email'
                            required
                        />
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="password" className='text-gray-700 font-semibold mb-2'>Password</label>
                        <input
                            onChange={inputHandle}
                            value={state.password}
                            className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none'
                            type="password"
                            name='password'
                            placeholder='Enter your password'
                            id='password'
                            required
                        />
                    </div>

                    <button
                        disabled={loader}
                        className={`w-full text-white font-semibold py-2 rounded-md transition-all duration-300 ${loader ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {loader ? <PropagateLoader color='#fff' /> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;