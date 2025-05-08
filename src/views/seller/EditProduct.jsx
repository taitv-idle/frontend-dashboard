import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { FiPlusCircle, FiSearch, FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { get_product, update_product, messageClear, product_image_update } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom CSS for ReactQuill
const quillStyles = `
    .ql-editor img {
        max-width: 300px;
        max-height: 300px;
        object-fit: contain;
        margin: 10px 0;
    }
    .ql-editor {
        min-height: 300px;
        font-size: 16px;
        line-height: 1.6;
    }
    .ql-container {
        height: 400px;
    }
    .ql-toolbar {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background-color: #f9fafb;
    }
    .ql-container {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
    .ql-editor p {
        margin-bottom: 1em;
    }
    .ql-editor h1, .ql-editor h2, .ql-editor h3 {
        margin-top: 1em;
        margin-bottom: 0.5em;
    }
`;

const EditProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { categorys = [] } = useSelector(state => state.category);
    const { product, loader, successMessage, errorMessage } = useSelector(state => state.product);

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: "",
        size: [],
        color: []
    });

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [imageShow, setImageShow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newColor, setNewColor] = useState('');

    // Predefined sizes
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    // Quill modules configuration
    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: function() {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = async () => {
                        const file = input.files[0];
                        if (file) {
                            try {
                                const imageUrl = URL.createObjectURL(file);
                                const quill = this.quill;
                                const range = quill.getSelection() || { index: 0 };
                                quill.insertEmbed(range.index, 'image', imageUrl);
                                quill.insertText(range.index + 1, '\n');
                            } catch (error) {
                                console.error('Error inserting image:', error);
                                toast.error('Không thể chèn ảnh. Vui lòng thử lại.');
                            }
                        }
                    };
                }
            }
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image',
        'color', 'background'
    ];

    useEffect(() => {
        setLoading(true);
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }));
        dispatch(get_product(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        if (product) {
            setState({
                name: product.name || "",
                description: product.description || "",
                discount: product.discount || "",
                price: product.price || "",
                brand: product.brand || "",
                stock: product.stock || "",
                size: product.size || [],
                color: product.color || []
            });
            setCategory(product.category || "");
            setImageShow(product.images || []);
            setLoading(false);
        }
    }, [product]);

    useEffect(() => {
        setAllCategory(categorys);
    }, [categorys]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const categorySearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value) {
            let srcValue = categorys.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
            setAllCategory(srcValue);
        } else {
            setAllCategory(categorys);
        }
    };

    const changeImage = (img, files) => {
        if (files.length > 0) {
            dispatch(product_image_update({
                oldImage: img,
                newImage: files[0],
                productId
            }));
        }
    };

    const handleAddColor = () => {
        if (newColor.trim() && !state.color.includes(newColor.trim())) {
            setState(prev => ({
                ...prev,
                color: [...prev.color, newColor.trim()]
            }));
            setNewColor('');
        }
    };

    const handleRemoveColor = (colorToRemove) => {
        setState(prev => ({
            ...prev,
            color: prev.color.filter(color => color !== colorToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddColor();
        }
    };

    const handleSizeChange = (size) => {
        setState(prev => {
            const newSizes = prev.size.includes(size)
                ? prev.size.filter(s => s !== size)
                : [...prev.size, size];
            return { ...prev, size: newSizes };
        });
    };

    const handleDescriptionChange = useCallback((content) => {
        setState(prev => ({ ...prev, description: content }));
    }, []);

    const update = (e) => {
        e.preventDefault();
        const obj = {
            name: state.name,
            description: state.description,
            discount: state.discount,
            price: state.price,
            brand: state.brand,
            stock: state.stock,
            category: category,
            productId: productId,
            size: state.size,
            color: state.color
        };
        dispatch(update_product(obj));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <PropagateLoader color="#4f46e5" cssOverride={overrideStyle} size={15} />
            </div>
        );
    }

    return (
        <div className="px-4 lg:px-8 py-6">
            <style>{quillStyles}</style>
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Sản Phẩm</h1>
                    <Link
                        to="/seller/products"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 transition-colors flex items-center gap-2"
                    >
                        <FiPlusCircle /> Danh Sách Sản Phẩm
                    </Link>
                </div>

                <form onSubmit={update} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Sản Phẩm</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={inputHandle}
                                value={state.name}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Thương Hiệu</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={inputHandle}
                                value={state.brand}
                                type="text"
                                name="brand"
                                id="brand"
                                placeholder="Nhập thương hiệu"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2 relative">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh Mục</label>
                            <div className="relative">
                                <input
                                    readOnly
                                    onClick={() => setCateShow(!cateShow)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer pr-10"
                                    value={category}
                                    type="text"
                                    id="category"
                                    placeholder="Chọn danh mục"
                                    required
                                />
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            {cateShow && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                    <div className="p-2 border-b">
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={searchValue}
                                                onChange={categorySearch}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                type="text"
                                                placeholder="Tìm kiếm danh mục"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {allCategory.length > 0 ? (
                                            allCategory.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${category === c.name ? 'bg-indigo-100 text-indigo-700' : ''}`}
                                                    onClick={() => {
                                                        setCateShow(false);
                                                        setCategory(c.name);
                                                        setSearchValue('');
                                                        setAllCategory(categorys);
                                                    }}
                                                >
                                                    {c.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-center text-gray-500">Không có danh mục nào</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Số Lượng Tồn Kho</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={inputHandle}
                                value={state.stock}
                                type="number"
                                name="stock"
                                id="stock"
                                placeholder="Nhập số lượng"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá Bán</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={inputHandle}
                                value={state.price}
                                type="number"
                                name="price"
                                id="price"
                                placeholder="Nhập giá bán"
                                min="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Giảm Giá (%)</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={inputHandle}
                                value={state.discount}
                                type="number"
                                name="discount"
                                id="discount"
                                placeholder="Nhập % giảm giá"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Kích Thước</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeChange(size)}
                                        className={`px-3 py-1 rounded-full border ${
                                            state.size.includes(size)
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'border-gray-300 text-gray-700 hover:border-indigo-500'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Màu Sắc</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập màu sắc"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddColor}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Thêm
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {state.color.map((color, index) => (
                                    <div
                                        key={index}
                                        className="group relative px-3 py-1 rounded-full border border-gray-300 bg-white"
                                    >
                                        <span>{color}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColor(color)}
                                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <IoMdCloseCircle size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Mô Tả Sản Phẩm</label>
                        <div className="mb-12">
                            <ReactQuill
                                theme="snow"
                                value={state.description}
                                onChange={handleDescriptionChange}
                                modules={modules}
                                formats={formats}
                                preserveWhitespace={true}
                                placeholder="Nhập mô tả chi tiết sản phẩm..."
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình Ảnh Sản Phẩm</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imageShow && imageShow.length > 0 ? (
                                imageShow.map((img, i) => (
                                    <div key={i} className="relative group h-40 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={img}
                                            alt={`Product ${i}`}
                                        />
                                        <label
                                            htmlFor={`image-${i}`}
                                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all cursor-pointer"
                                        >
                                            <IoMdImages className="text-white opacity-0 group-hover:opacity-100 transition-all" size={24} />
                                        </label>
                                        <input
                                            onChange={(e) => changeImage(img, e.target.files)}
                                            type="file"
                                            id={`image-${i}`}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    Chưa có hình ảnh sản phẩm
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            disabled={loader || !state.size.length || !state.color.length}
                            type="submit"
                            className={`w-full md:w-64 px-6 py-3 rounded-lg text-white font-medium ${
                                loader || !state.size.length || !state.color.length
                                    ? 'bg-indigo-400'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            } transition-colors flex items-center justify-center`}
                        >
                            {loader ? (
                                <PropagateLoader color="#fff" cssOverride={overrideStyle} size={10} />
                            ) : (
                                'Lưu Thay Đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;