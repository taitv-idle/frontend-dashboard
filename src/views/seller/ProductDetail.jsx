import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { get_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
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
        if (product) {
            // Debug log để kiểm tra dữ liệu thực tế
            console.log('Product data received in detail view:', product);
            console.log('Size type:', typeof product.size, 'Value:', product.size);
            console.log('Color type:', typeof product.color, 'Value:', product.color);
            console.log('Tags type:', typeof product.tags, 'Value:', product.tags);
        }
    }, [product]);

    

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
            navigate('/seller/products');
        }
    }, [errorMessage, dispatch, navigate]);

    // Tính giá sau giảm giá
    const calculateDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return price - (price * (discount / 100));
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-80px)]'>
                <PropagateLoader color='#4f46e5' cssOverride={overrideStyle} size={20} />
            </div>
        );
    }

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='mb-4 flex items-center gap-2'>
                <Link to='/seller/products' className='flex items-center text-indigo-600 hover:text-indigo-800'>
                    <FiArrowLeft className='mr-1' /> Trở về danh sách sản phẩm
                </Link>
            </div>

            {product && (
                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                    <div className='p-6 border-b border-gray-200'>
                        <div className='flex justify-between items-center mb-4'>
                            <h1 className='text-2xl font-bold text-gray-800'>{product.name}</h1>
                            <Link 
                                to={`/seller/product/edit/${productId}`} 
                                className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2'
                            >
                                <FiEdit /> Chỉnh sửa
                            </Link>
                        </div>

                        {/* Thông tin cơ bản và ảnh sản phẩm */}
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
                            {/* Ảnh sản phẩm */}
                            <div className='col-span-1 lg:col-span-1'>
                                <div className='bg-gray-100 rounded-lg overflow-hidden mb-4'>
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            className='w-full h-72 object-contain'
                                        />
                                    ) : (
                                        <div className='w-full h-72 flex items-center justify-center bg-gray-200'>
                                            <span className='text-gray-400'>Không có ảnh</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className='grid grid-cols-4 gap-2'>
                                    {product.images && product.images.slice(1).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className='w-full h-20 object-cover rounded-md cursor-pointer'
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className='col-span-1 lg:col-span-2'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                                    <div>
                                        <h2 className='text-lg font-medium mb-4'>Thông tin chung</h2>
                                        <div className='space-y-3'>
                                            <div>
                                                <span className='text-gray-600'>Danh mục:</span>
                                                <span className='ml-2 font-medium'>{product.category}</span>
                                            </div>
                                            <div>
                                                <span className='text-gray-600'>Thương hiệu:</span>
                                                <span className='ml-2 font-medium'>{product.brand}</span>
                                            </div>
                                            <div>
                                                <span className='text-gray-600'>Tồn kho:</span>
                                                <span className='ml-2 font-medium'>{product.stock} sản phẩm</span>
                                            </div>
                                            <div>
                                                <span className='text-gray-600'>Đã bán:</span>
                                                <span className='ml-2 font-medium'>{product.sold || 0} sản phẩm</span>
                                            </div>
                                            <div>
                                                <span className='text-gray-600'>Đánh giá:</span>
                                                <span className='ml-2 font-medium'>{product.rating || 0}/5</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className='text-lg font-medium mb-4'>Thông tin giá</h2>
                                        <div className='space-y-3'>
                                            <div>
                                                <span className='text-gray-600'>Giá gốc:</span>
                                                <span className='ml-2 font-medium'>{formatPrice(product.price)}</span>
                                            </div>
                                            <div>
                                                <span className='text-gray-600'>Giảm giá:</span>
                                                <span className='ml-2 font-medium'>{product.discount}%</span>
                                            </div>
                                            {product.discount > 0 && (
                                                <div>
                                                    <span className='text-gray-600'>Giá sau giảm:</span>
                                                    <span className='ml-2 font-medium text-red-600'>
                                                        {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Kích thước và Màu sắc */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                                    <div>
                                        <h2 className='text-lg font-medium mb-3'>Kích thước</h2>
                                        <div className='flex flex-wrap gap-2'>
                                            {(() => {
                                                // Hiển thị dữ liệu gốc để debug
                                                console.log("Raw size data:", product.size);
                                                
                                                // Xử lý dựa trên cấu trúc thực tế từ API
                                                let sizesToDisplay = [];
                                                
                                                try {
                                                    // Đây là một mảng chứa một phần tử string
                                                    if (Array.isArray(product.size) && product.size.length > 0) {
                                                        const outerString = product.size[0];
                                                        console.log("Outer string:", outerString);
                                                        
                                                        // Parse lần 1
                                                        const firstParse = JSON.parse(outerString); // => ["[\"XXXL\",\"XXL\",...]"]
                                                        console.log("First parse:", firstParse);
                                                        
                                                        if (Array.isArray(firstParse) && firstParse.length > 0) {
                                                            // Parse lần 2
                                                            const secondParse = JSON.parse(firstParse[0]); // => ["XXXL","XXL",...]
                                                            console.log("Second parse:", secondParse);
                                                            
                                                            if (Array.isArray(secondParse)) {
                                                                sizesToDisplay = secondParse;
                                                            }
                                                        }
                                                    }
                                                    // Fallback cho các trường hợp khác
                                                    else if (typeof product.size === 'string') {
                                                        sizesToDisplay = JSON.parse(product.size);
                                                    }
                                                } catch (error) {
                                                    console.error("Error parsing sizes:", error);
                                                    return (
                                                        <>
                                                            <span className='text-red-500'>Lỗi dữ liệu: {error.message}</span>
                                                            <span className='text-gray-500'>Dữ liệu gốc: {JSON.stringify(product.size)}</span>
                                                        </>
                                                    );
                                                }
                                                
                                                console.log("Final sizes for display:", sizesToDisplay);
                                                
                                                if (Array.isArray(sizesToDisplay) && sizesToDisplay.length > 0) {
                                                    return sizesToDisplay.map((size, index) => (
                                                        <span 
                                                            key={index} 
                                                            className='px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200'
                                                        >
                                                            {size}
                                                        </span>
                                                    ));
                                                } else {
                                                    return <span className='text-gray-500'>Chưa có kích thước</span>;
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className='text-lg font-medium mb-3'>Màu sắc</h2>
                                        <div className='flex flex-wrap gap-2'>
                                            {(() => {
                                                // Hiển thị dữ liệu gốc để debug
                                                console.log("Raw color data:", product.color);
                                                
                                                // Xử lý dựa trên cấu trúc thực tế từ API
                                                let colorsToDisplay = [];
                                                
                                                try {
                                                    // Trường hợp đặc biệt: cấu trúc từ API thực tế: ['["[\\"Xanh\\",\\"Đỏ\\",\\"Tím\\",\\"Vàng\\"]"]']
                                                    if (Array.isArray(product.color) && product.color.length > 0) {
                                                        const outerString = product.color[0];
                                                        console.log("Outer string:", outerString);
                                                        
                                                        // Parse lần 1
                                                        const firstParse = JSON.parse(outerString); // => ["[\"Xanh\",\"Đỏ\",...]"]
                                                        console.log("First parse:", firstParse);
                                                        
                                                        if (Array.isArray(firstParse) && firstParse.length > 0) {
                                                            // Parse lần 2
                                                            const secondParse = JSON.parse(firstParse[0]); // => ["Xanh","Đỏ",...]
                                                            console.log("Second parse:", secondParse);
                                                            
                                                            if (Array.isArray(secondParse)) {
                                                                colorsToDisplay = secondParse;
                                                            }
                                                        }
                                                    }
                                                    // Fallback cho các trường hợp khác
                                                    else if (typeof product.color === 'string') {
                                                        colorsToDisplay = JSON.parse(product.color);
                                                    }
                                                } catch (error) {
                                                    console.error("Error parsing colors:", error);
                                                    return (
                                                        <>
                                                            <span className='text-red-500'>Lỗi dữ liệu: {error.message}</span>
                                                            <span className='text-gray-500'>Dữ liệu gốc: {JSON.stringify(product.color)}</span>
                                                        </>
                                                    );
                                                }
                                                
                                                console.log("Final colors for display:", colorsToDisplay);
                                                
                                                if (Array.isArray(colorsToDisplay) && colorsToDisplay.length > 0) {
                                                    return colorsToDisplay.map((color, index) => (
                                                        <span 
                                                            key={index} 
                                                            className='px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200'
                                                        >
                                                            {color}
                                                        </span>
                                                    ));
                                                } else {
                                                    return <span className='text-gray-500'>Chưa có màu sắc</span>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Thẻ sản phẩm */}
                                <div className='mb-6'>
                                    <h2 className='text-lg font-medium mb-3'>Thẻ sản phẩm</h2>
                                    <div className='flex flex-wrap gap-2'>
                                        {(() => {
                                            // Hiển thị dữ liệu gốc để debug
                                            console.log("Raw tags data:", product.tags);
                                            
                                            // Xử lý dựa trên cấu trúc thực tế từ API
                                            let tagsToDisplay = [];
                                            
                                            try {
                                                // Trường hợp đặc biệt: cấu trúc từ API thực tế: ['["Áo","Quần"]']
                                                if (Array.isArray(product.tags) && product.tags.length > 0) {
                                                    // Đây là cấu trúc đơn giản hơn so với size và color
                                                    const outerString = product.tags[0];
                                                    console.log("Tags outer string:", outerString);
                                                    
                                                    // Parse trực tiếp
                                                    const parsedTags = JSON.parse(outerString);
                                                    console.log("Parsed tags:", parsedTags);
                                                    
                                                    if (Array.isArray(parsedTags)) {
                                                        tagsToDisplay = parsedTags;
                                                    }
                                                }
                                                // Fallback cho các trường hợp khác
                                                else if (typeof product.tags === 'string') {
                                                    tagsToDisplay = JSON.parse(product.tags);
                                                }
                                            } catch (error) {
                                                console.error("Error parsing tags:", error);
                                                return (
                                                    <>
                                                        <span className='text-red-500'>Lỗi dữ liệu: {error.message}</span>
                                                        <span className='text-gray-500'>Dữ liệu gốc: {JSON.stringify(product.tags)}</span>
                                                    </>
                                                );
                                            }
                                            
                                            console.log("Final tags for display:", tagsToDisplay);
                                            
                                            if (Array.isArray(tagsToDisplay) && tagsToDisplay.length > 0) {
                                                return tagsToDisplay.map((tag, index) => (
                                                    <span 
                                                        key={index} 
                                                        className='px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200'
                                                    >
                                                        #{tag}
                                                    </span>
                                                ));
                                            } else {
                                                return <span className='text-gray-500'>Chưa có thẻ sản phẩm</span>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mô tả sản phẩm */}
                        <div className='mb-6'>
                            <h2 className='text-lg font-medium mb-3'>Mô tả sản phẩm</h2>
                            <div 
                                className='p-4 bg-gray-50 rounded-lg prose max-w-none'
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>

                        {/* Nút hành động */}
                        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200'>
                            <button
                                onClick={() => navigate('/seller/products')}
                                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'
                            >
                                Quay lại
                            </button>
                            <Link
                                to={`/seller/product/edit/${productId}`}
                                className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                            >
                                Chỉnh sửa
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;