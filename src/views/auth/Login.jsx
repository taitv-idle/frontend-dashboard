import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_login, messageClear } from '../../store/Reducers/authReducer';

const Login = () => {
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
        dispatch(seller_login(state));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    return (
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800'>
            <div className='w-[400px] p-6 bg-white shadow-xl rounded-lg'>
                <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>Chào mừng đến với Ecommerce</h2>
                <p className='text-sm text-gray-600 text-center mb-4'>Vui lòng đăng nhập vào tài khoản của bạn</p>
                <form onSubmit={submit}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="email" className='text-gray-700 font-semibold mb-2'>Email</label>
                        <input onChange={inputHandle} value={state.email} className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none' type="email" name='email' placeholder='Nhập email của bạn' id='email' required />
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="password" className='text-gray-700 font-semibold mb-2'>Mật khẩu</label>
                        <input onChange={inputHandle} value={state.password} className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none' type="password" name='password' placeholder='Nhập mật khẩu của bạn' id='password' required />
                    </div>

                    <button disabled={loader} className={`w-full text-white font-semibold py-2 rounded-md transition-all duration-300 ${loader ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}>{loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Đăng nhập'}</button>
                </form>

                <div className='flex items-center justify-center mt-4 text-sm'>
                    <p>Bạn chưa có tài khoản? <Link className='font-bold text-purple-600 hover:underline' to="/register">Đăng ký</Link></p>
                </div>

                <div className='flex items-center my-4'>
                    <div className='flex-grow border-t border-gray-300'></div>
                    <span className='mx-2 text-gray-600'>Hoặc</span>
                    <div className='flex-grow border-t border-gray-300'></div>
                </div>

                <div className='flex justify-center gap-4'>
                    <button className='w-40 h-10 flex items-center justify-center rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-all'><FaGoogle className='mr-2' /> Google</button>
                    <button className='w-40 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all'><FaFacebook className='mr-2' /> Facebook</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
