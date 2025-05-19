import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { get_products, delete_product, get_product, messageClear } from '../../store/Reducers/productReducer';
import { LuImageMinus } from "react-icons/lu";
import { PropagateLoader } from 'react-spinners';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const dispatch = useDispatch();
    const { products, totalProduct, loading, successMessage, errorMessage, loader } = useSelector(state => state.product);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(10);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_products(obj));
    }, [searchValue, currentPage, parPage, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            const obj = {
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue
            };
            dispatch(get_products(obj));
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, currentPage, parPage, searchValue]);

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

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Quản Lý Sản Phẩm</h1>
                <Link
                    to='/seller/add-product'
                    className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 transition-colors flex items-center gap-2'
                >
                    <FiPlusCircle /> Thêm Sản Phẩm
                </Link>
            </div>

            <div className='w-full p-6 bg-white rounded-lg shadow-md'>
                <div className='mb-6'>
                    <Search
                        setParPage={setParPage}
                        setSearchValue={setSearchValue}
                        searchValue={searchValue}
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                </div>

                {(loading || loader) ? (
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
                                    <th scope='col' className='py-3 px-6'>Thương hiệu</th>
                                    <th scope='col' className='py-3 px-6'>Giá</th>
                                    <th scope='col' className='py-3 px-6'>Giảm giá</th>
                                    <th scope='col' className='py-3 px-6'>Tồn kho</th>
                                    <th scope='col' className='py-3 px-6'>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.length > 0 ? (
                                    products.map((d, i) => (
                                        <tr key={i} className='bg-white border-b hover:bg-gray-50 transition-colors'>
                                            <td className='py-4 px-6 font-medium text-gray-900'>{i + 1}</td>
                                            <td className='py-4 px-6'>
                                                {d.images && d.images.length > 0 ? (
                                                    <img
                                                        className='w-12 h-12 object-cover rounded-md'
                                                        src={d.images[0]}
                                                        alt={d.name}
                                                    />
                                                ) : (
                                                    <div className='w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center'>
                                                        <LuImageMinus className='text-gray-400' />
                                                    </div>
                                                )}
                                            </td>
                                            <td className='py-4 px-6 font-medium text-gray-900'>
                                                <span className='line-clamp-1' title={d.name}>{d.name}</span>
                                            </td>
                                            <td className='py-4 px-6'>{d.category}</td>
                                            <td className='py-4 px-6'>{d.brand}</td>
                                            <td className='py-4 px-6 font-medium'>{d.price.toLocaleString('vi-VN')} ₫</td>
                                            <td className='py-4 px-6'>
                                                {d.discount === 0 ? (
                                                    <span className='text-gray-500'>Không giảm</span>
                                                ) : (
                                                    <span className='text-green-600'>-{d.discount}%</span>
                                                )}
                                            </td>
                                            <td className='py-4 px-6'>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        d.stock > 10 ? 'bg-green-100 text-green-800' :
                                                            d.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                        {d.stock}
                                                    </span>
                                            </td>
                                            <td className='py-4 px-6'>
                                                <div className='flex items-center gap-3'>
                                                    <Link
                                                        to={`/seller/edit-product/${d._id}`}
                                                        className='p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors'
                                                        title='Chỉnh sửa'
                                                    >
                                                        <FaEdit size={16} />
                                                    </Link>
                                                    <Link
                                                        to={`/seller/add-banner/${d._id}`}
                                                        className='p-2 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors'
                                                        title='Quản lý hình ảnh'
                                                    >
                                                        <LuImageMinus size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleViewDetail(d._id)}
                                                        className='p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors'
                                                        title='Xem chi tiết'
                                                    >
                                                        <FaEye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(d._id)}
                                                        className='p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors'
                                                        title='Xóa sản phẩm'
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className='py-8 text-center text-gray-500'>
                                            Không tìm thấy sản phẩm nào
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {totalProduct > parPage && (
                            <div className='w-full flex justify-center mt-6'>
                                <Pagination
                                    pageNumber={currentPage}
                                    setPageNumber={setCurrentPage}
                                    totalItem={totalProduct}
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

export default Products;