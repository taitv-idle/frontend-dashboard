import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import {
    categoryAdd,
    messageClear,
    get_category,
    updateCategory,
    deleteCategory
} from '../../store/Reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Search from '../components/Search';

const Category = () => {
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage, categorys, totalCategory } = useSelector(state => state.category);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [categoryData, setCategoryData] = useState({
        name: '',
        image: ''
    });

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
            setCategoryData({
                ...categoryData,
                image: file // Lưu file mới
            });
        }
    };

    // Thêm hoặc cập nhật danh mục
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Loại bỏ thông báo lỗi cục bộ, để backend xử lý tất cả lỗi
        if (!categoryData.name || !categoryData.name.trim()) {
            dispatch({
                type: 'category/categoryAdd/rejected',
                payload: { error: 'Vui lòng nhập tên danh mục' }
            });
            return;
        }

        if (!isEdit && !categoryData.image) {
            dispatch({
                type: 'category/categoryAdd/rejected',
                payload: { error: 'Vui lòng chọn hình ảnh' }
            });
            return;
        }

        try {
            if (isEdit) {
                await dispatch(updateCategory({
                    id: editId,
                    name: categoryData.name,
                    image: categoryData.image
                })).unwrap();
            } else {
                await dispatch(categoryAdd({
                    name: categoryData.name,
                    image: categoryData.image
                })).unwrap();
            }
        } catch (error) {
            // Lỗi đã được xử lý trong reducer, không cần toast ở đây
        }
    };

    // Hiển thị thông báo
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, {
                id: 'category-success' // Đảm bảo chỉ một toast thành công
            });
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage, {
                id: 'category-error' // Đảm bảo chỉ một toast lỗi
            });
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    // Lấy danh sách danh mục
    useEffect(() => {
        const params = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_category(params));
    }, [dispatch, searchValue, currentPage, parPage]);

    // Reset form
    const resetForm = () => {
        setCategoryData({
            name: '',
            image: ''
        });
        setImagePreview('');
        setIsEdit(false);
        setEditId(null);
        setShowForm(false);
    };

    // Chỉnh sửa danh mục
    const handleEdit = (category) => {
        setCategoryData({
            name: category.name,
            image: category.image // Lưu URL gốc ban đầu
        });
        setImagePreview(category.image);
        setEditId(category._id);
        setIsEdit(true);
        setShowForm(true);
    };

    // Xóa danh mục
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            dispatch(deleteCategory(id));
        }
    };

    return (
        <div className="px-4 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
                <div className="flex items-center gap-4">
                    <Search
                        setParPage={setParPage}
                        setSearchValue={setSearchValue}
                        searchValue={searchValue}
                        placeholder="Tìm kiếm danh mục..."
                    />
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FaPlus /> Thêm mới
                    </button>
                </div>
            </div>

            {/* Danh sách danh mục */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {categorys.length > 0 ? (
                            categorys.map((category, index) => (
                                <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(currentPage - 1) * parPage + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Xóa"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không tìm thấy danh mục nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalCategory > parPage && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalCategory}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>

            {/* Form thêm/chỉnh sửa danh mục */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {isEdit ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoMdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên danh mục
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={categoryData.name}
                                    onChange={(e) => setCategoryData({...categoryData, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nhập tên danh mục"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hình ảnh
                                </label>
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <FaImage size={32} className="mb-2" />
                                            <span>Chọn hình ảnh</span>
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loader}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${loader ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                                >
                                    {loader ? (
                                        <PropagateLoader
                                            color="#ffffff"
                                            cssOverride={overrideStyle}
                                            size={10}
                                        />
                                    ) : isEdit ? (
                                        'Cập nhật Danh mục'
                                    ) : (
                                        'Thêm Danh mục'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;