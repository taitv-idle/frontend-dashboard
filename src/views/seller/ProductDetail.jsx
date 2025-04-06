import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { get_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { product, loading, errorMessage } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(get_product(productId));
    }, [productId, dispatch]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
            navigate('/seller/products');
        }
    }, [errorMessage, dispatch, navigate]);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-80px)]'>
                <PropagateLoader color='#4f46e5' cssOverride={overrideStyle} size={20} />
            </div>
        );
    }

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='w-full p-6 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold mb-6'>Chi tiết sản phẩm</h1>

                {product && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <h2 className='text-xl font-semibold mb-2'>{product.name}</h2>
                            <p className='text-gray-600 mb-4'>{product.description}</p>

                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div>
                                    <p className='font-medium'>Danh mục:</p>
                                    <p>{product.category}</p>
                                </div>
                                <div>
                                    <p className='font-medium'>Thương hiệu:</p>
                                    <p>{product.brand}</p>
                                </div>
                                <div>
                                    <p className='font-medium'>Giá:</p>
                                    <p>${product.price}</p>
                                </div>
                                <div>
                                    <p className='font-medium'>Giảm giá:</p>
                                    <p>{product.discount}%</p>
                                </div>
                                <div>
                                    <p className='font-medium'>Tồn kho:</p>
                                    <p>{product.stock}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className='font-medium mb-2'>Hình ảnh sản phẩm</h3>
                            <div className='grid grid-cols-3 gap-2'>
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className='w-full h-24 object-cover rounded-md'
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;