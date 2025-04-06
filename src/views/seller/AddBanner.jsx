import React, { useEffect, useState } from 'react';
import { FaRegImage, FaTimes } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_banner, get_banner, messageClear, update_banner } from '../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const AddBanner = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loader, successMessage, errorMessage, banner } = useSelector(state => state.banner);

    const [imageShow, setImageShow] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            if (!banner) {
                // Nếu thêm banner thành công thì load lại banner mới
                dispatch(get_banner(productId));
            }
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, banner, productId]);

    useEffect(() => {
        dispatch(get_banner(productId));
    }, [productId, dispatch]);

    const imageHandle = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 5MB');
                return;
            }

            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)');
                return;
            }

            setImage(file);
            setImageShow(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage('');
        setImageShow('');
    };

    const add = (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Vui lòng chọn ảnh banner');
            return;
        }
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('mainban', image);
        dispatch(add_banner(formData));
    };

    const update = (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Vui lòng chọn ảnh banner mới');
            return;
        }
        const formData = new FormData();
        formData.append('mainban', image);
        dispatch(update_banner({ info: formData, bannerId: banner._id }));
    };

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='flex items-center mb-6'>
                <button
                    onClick={() => navigate(-1)}
                    className='mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors'
                >
                    <FiArrowLeft size={20} />
                </button>
                <h1 className='text-2xl font-bold text-gray-800'>
                    {banner ? 'Cập nhật Banner' : 'Thêm Banner mới'}
                </h1>
            </div>

            <div className='w-full p-6 bg-white rounded-lg shadow-md'>
                {!banner ? (
                    <form onSubmit={add} className='space-y-6'>
                        <div className='space-y-4'>
                            <label
                                htmlFor="image"
                                className='flex flex-col items-center justify-center h-64 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors relative'
                            >
                                {imageShow ? (
                                    <>
                                        <img
                                            src={imageShow}
                                            alt="Banner preview"
                                            className='w-full h-full object-contain rounded-lg'
                                        />
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage();
                                            }}
                                            className='absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                                        >
                                            <FaTimes size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <FaRegImage className='text-4xl text-gray-400 mb-2' />
                                        <span className='text-gray-600'>Chọn ảnh banner</span>
                                        <span className='text-sm text-gray-500 mt-2'>Định dạng: JPEG, PNG, WEBP</span>
                                        <span className='text-sm text-gray-500'>Kích thước tối đa: 5MB</span>
                                    </>
                                )}
                            </label>
                            <input
                                onChange={imageHandle}
                                className='hidden'
                                type="file"
                                id='image'
                                accept='image/jpeg, image/png, image/webp'
                            />
                        </div>

                        <div className='flex justify-center'>
                            <button
                                disabled={loader || !image}
                                className={`w-full md:w-64 px-6 py-3 rounded-lg text-white font-medium ${
                                    loader || !image ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                } transition-colors flex items-center justify-center`}
                            >
                                {loader ? (
                                    <PropagateLoader color='#fff' cssOverride={overrideStyle} size={10} />
                                ) : (
                                    'Thêm Banner'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={update} className='space-y-6'>
                        <div className='space-y-4'>
                            <div className='flex flex-col items-center'>
                                <h3 className='text-lg font-medium text-gray-800 mb-2'>Banner hiện tại</h3>
                                <img
                                    src={banner.banner}
                                    alt="Current banner"
                                    className='w-full max-h-64 object-contain rounded-lg border border-gray-200'
                                />
                            </div>

                            <label
                                htmlFor="image"
                                className='flex flex-col items-center justify-center h-64 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors relative'
                            >
                                {imageShow ? (
                                    <>
                                        <img
                                            src={imageShow}
                                            alt="New banner preview"
                                            className='w-full h-full object-contain rounded-lg'
                                        />
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage();
                                            }}
                                            className='absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                                        >
                                            <FaTimes size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <FaRegImage className='text-4xl text-gray-400 mb-2' />
                                        <span className='text-gray-600'>Chọn ảnh banner mới</span>
                                        <span className='text-sm text-gray-500 mt-2'>Định dạng: JPEG, PNG, WEBP</span>
                                        <span className='text-sm text-gray-500'>Kích thước tối đa: 5MB</span>
                                    </>
                                )}
                            </label>
                            <input
                                onChange={imageHandle}
                                className='hidden'
                                type="file"
                                id='image'
                                accept='image/jpeg, image/png, image/webp'
                            />
                        </div>

                        <div className='flex justify-center'>
                            <button
                                disabled={loader || !image}
                                className={`w-full md:w-64 px-6 py-3 rounded-lg text-white font-medium ${
                                    loader || !image ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                } transition-colors flex items-center justify-center`}
                            >
                                {loader ? (
                                    <PropagateLoader color='#fff' cssOverride={overrideStyle} size={10} />
                                ) : (
                                    'Cập nhật Banner'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddBanner;