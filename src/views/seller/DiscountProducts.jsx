import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import { FaEdit, FaEye, FaTrash, FaPercentage } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import Pagination from '../Pagination';
import Search from '../components/Search';
import {delete_product, get_discount_products, get_product} from '../../store/Reducers/productReducer';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const DiscountProducts = () => {
    const dispatch = useDispatch();
    const { discountProducts, totalDiscountProduct, loading } = useSelector(state => state.product);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(10);
    const [minDiscount, setMinDiscount] = useState(10); // Filter tối thiểu 10% giảm giá
    const handleViewDetail = (productId) => {
        dispatch(get_product(productId))
            .unwrap()
            .then(() => {
                navigate(`/seller/product-detail/${productId}`);
            })
            .catch(error => {
                toast.error('Không thể tải chi tiết sản phẩm');
            });
    };
    const handleDelete = (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            console.log('Attempting to delete product ID:', productId);
            dispatch(delete_product(productId))
                .unwrap()
                .then(result => {
                    console.log('Delete success:', result);
                })
                .catch(error => {
                    console.error('Delete error details:', error);
                });
        }
    };
    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            minDiscount
        };
        dispatch(get_discount_products(obj));
    }, [searchValue, currentPage, parPage, minDiscount, dispatch]);

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-2'>
                    <FaPercentage className='text-indigo-600 text-2xl' />
                    <h1 className='text-2xl font-bold text-gray-800'>Sản Phẩm Giảm Giá</h1>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex items-center bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100'>
                        <label htmlFor="minDiscount" className='text-sm text-gray-600 mr-2'>Giảm từ:</label>
                        <select
                            id="minDiscount"
                            value={minDiscount}
                            onChange={(e) => setMinDiscount(e.target.value)}
                            className='bg-transparent border-none focus:ring-0 text-indigo-600'
                        >
                            <option value="10">10%</option>
                            <option value="20">20%</option>
                            <option value="30">30%</option>
                            <option value="50">50%</option>
                        </select>
                    </div>

                    <Link
                        to='/seller/add-discount'
                        className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2 text-sm'
                    >
                        <FiPlusCircle /> Thêm Khuyến Mãi
                    </Link>
                </div>
            </div>

            <div className='w-full p-6 bg-white rounded-lg shadow-md'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                    <div className='w-full md:w-auto'>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                            placeholder="Tìm sản phẩm giảm giá..."
                        />
                    </div>
                    <div className='text-sm text-gray-500'>
                        Tổng cộng: <span className='font-medium'>{totalDiscountProduct}</span> sản phẩm
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center h-[300px]'>
                        <PropagateLoader color='#4f46e5' size={15} />
                    </div>
                ) : (
                    <>
                        <div className='relative overflow-x-auto rounded-lg border border-gray-200'>
                            <table className='w-full text-left text-gray-700'>
                                <thead className='text-sm text-gray-700 uppercase bg-gray-50'>
                                <tr>
                                    <th scope='col' className='py-3 px-6'>STT</th>
                                    <th scope='col' className='py-3 px-6'>Hình ảnh</th>
                                    <th scope='col' className='py-3 px-6'>Tên sản phẩm</th>
                                    <th scope='col' className='py-3 px-6'>Danh mục</th>
                                    <th scope='col' className='py-3 px-6'>Giá gốc</th>
                                    <th scope='col' className='py-3 px-6'>Giảm giá</th>
                                    <th scope='col' className='py-3 px-6'>Giá KM</th>
                                    <th scope='col' className='py-3 px-6'>Thao tác</th>
                                </tr>
                                </thead>

                                <tbody>
                                {discountProducts.length > 0 ? (
                                    discountProducts.map((product, i) => {
                                        const discountedPrice = product.price * (1 - product.discount / 100);
                                        return (
                                            <tr key={i} className='bg-white border-b hover:bg-gray-50 transition-colors'>
                                                <td className='py-4 px-6 font-medium text-gray-900'>{(currentPage - 1) * parPage + i + 1}</td>
                                                <td className='py-4 px-6'>
                                                    <img
                                                        className='w-12 h-12 object-cover rounded-md'
                                                        src={product.images[0] || '/images/default-product.png'}
                                                        alt={product.name}
                                                    />
                                                </td>
                                                <td className='py-4 px-6 font-medium text-gray-900'>
                                                    <span className='line-clamp-1' title={product.name}>{product.name}</span>
                                                </td>
                                                <td className='py-4 px-6'>{product.category}</td>
                                                <td className='py-4 px-6 line-through text-gray-400'>{product.price.toLocaleString('vi-VN')} ₫</td>
                                                <td className='py-4 px-6'>
                                                        <span className='px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium'>
                                                            -{product.discount}%
                                                        </span>
                                                </td>
                                                <td className='py-4 px-6 font-bold text-green-600'>{discountedPrice.toLocaleString('vi-VN')} ₫</td>
                                                <td className='py-4 px-6'>
                                                    <div className='flex items-center gap-2'>
                                                        <Link
                                                            to={`/seller/edit-product/${product._id}`}
                                                            className='p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors'
                                                            title='Chỉnh sửa'
                                                        >
                                                            <FaEdit size={14} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleViewDetail(product._id)}
                                                            className='p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors'
                                                            title='Xem chi tiết'
                                                        >
                                                            <FaEye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className='p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors'
                                                            title='Xóa sản phẩm'
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className='py-8 text-center text-gray-500'>
                                            Không tìm thấy sản phẩm giảm giá nào
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {totalDiscountProduct > parPage && (
                            <div className='w-full flex justify-center mt-6'>
                                <Pagination
                                    pageNumber={currentPage}
                                    setPageNumber={setCurrentPage}
                                    totalItem={totalDiscountProduct}
                                    parPage={parPage}
                                    showItem={3}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DiscountProducts;