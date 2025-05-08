import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        name: "",
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
        dispatch(seller_register(state));
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
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'>
            <div className='w-[400px] p-6 bg-white shadow-2xl rounded-lg'>
                <h2 className='text-2xl font-semibold text-center text-gray-800 mb-4'>Đăng ký tài khoản</h2>
                <p className='text-center text-sm text-gray-500 mb-6'>Vui lòng điền thông tin để tạo tài khoản mới</p>

                <form onSubmit={submit}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="name" className='text-gray-700 font-medium mb-2'>Họ và tên</label>
                        <input onChange={inputHandle} value={state.name} className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none' type="text" name='name' placeholder='Nhập tên của bạn' id='name' required />
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="email" className='text-gray-700 font-medium mb-2'>Email</label>
                        <input onChange={inputHandle} value={state.email} className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none' type="email" name='email' placeholder='Nhập email của bạn' id='email' required />
                    </div>

                    <div className='flex flex-col mb-6'>
                        <label htmlFor="password" className='text-gray-700 font-medium mb-2'>Mật khẩu</label>
                        <input onChange={inputHandle} value={state.password} className='px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none' type="password" name='password' placeholder='Nhập mật khẩu của bạn' id='password' required />
                    </div>

                    <div className='flex items-center mb-6'>
                        <input className='w-4 h-4 text-blue-600 bg-gray-200 rounded border-gray-300 focus:ring-blue-500' type="checkbox" name="checkbox" id="checkbox" />
                        <label htmlFor="checkbox" className='ml-2 text-sm text-gray-600'>Tôi đồng ý với các điều khoản và chính sách bảo mật</label>
                    </div>

                    <button disabled={loader ? true : false} className='w-full py-2 bg-blue-600 text-white font-semibold rounded-md transition-all duration-300 hover:bg-blue-700'>
                        {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Đăng ký'}
                    </button>

                    <div className='flex justify-center items-center mt-4'>
                        <p className='text-sm text-gray-600'>Đã có tài khoản? <Link className='font-semibold text-blue-600 hover:underline' to="/login">Đăng nhập</Link></p>
                    </div>

                    <div className='flex items-center my-6'>
                        <div className='flex-grow border-t border-gray-300'></div>
                        <span className='mx-2 text-gray-600'>Hoặc</span>
                        <div className='flex-grow border-t border-gray-300'></div>
                    </div>

                    <div className='flex justify-center gap-4'>
                        <button className='w-40 h-10 flex items-center justify-center rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-all'>
                            <FaGoogle className='mr-2' /> Google
                        </button>
                        <button className='w-40 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all'>
                            <FaFacebook className='mr-2' /> Facebook
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
