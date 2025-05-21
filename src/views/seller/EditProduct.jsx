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
        color: [],
        tags: []
    });

    const [editorContent, setEditorContent] = useState('');

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [imageShow, setImageShow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newColor, setNewColor] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newSize, setNewSize] = useState('');

    // Predefined sizes
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'align',
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
            console.log('Product data received:', product);
            
            // Xử lý nội dung HTML từ API
            const descriptionContent = product.description || '';
            const sanitizedContent = descriptionContent.trim() ? descriptionContent : '<p></p>';
            setEditorContent(sanitizedContent);
            
            // Xử lý dữ liệu mảng
            const parseArrayData = (field) => {
                if (!field) return [];
                
                try {
                    // Nếu là string, thử parse JSON
                    if (typeof field === 'string') {
                        const parsed = JSON.parse(field);
                        return Array.isArray(parsed) ? parsed : [];
                    }
                    
                    // Nếu là mảng, trả về trực tiếp
                    if (Array.isArray(field)) {
                        return field;
                    }
                    
                    return [];
                } catch (e) {
                    console.error('Error parsing array data:', e);
                    return [];
                }
            };
            
            // Xử lý và set state
            setState(prev => ({
                ...prev,
                name: product.name || "",
                description: sanitizedContent,
                discount: product.discount || "",
                price: product.price || "",
                brand: product.brand || "",
                stock: product.stock || "",
                size: parseArrayData(product.size),
                color: parseArrayData(product.color),
                tags: parseArrayData(product.tags)
            }));
            
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
        console.log('Description changed:', content);
        console.log('Previous editor content:', editorContent);
        setEditorContent(content);
        setState(prev => ({
            ...prev,
            description: content
        }));
    }, [editorContent]);

    // Add a debug effect for state changes
    useEffect(() => {
        console.log("Current state description:", state.description);
    }, [state.description]);

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !state.tags.includes(newTag.trim())) {
            setState(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setState(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Thêm hàm xử lý thêm kích thước tùy chỉnh
    const handleAddSize = () => {
        if (newSize.trim() && !state.size.includes(newSize.trim())) {
            setState(prev => ({
                ...prev,
                size: [...prev.size, newSize.trim()]
            }));
            setNewSize('');
        }
    };

    const handleSizeKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSize();
        }
    };

    const handleRemoveSize = (sizeToRemove) => {
        setState(prev => ({
            ...prev,
            size: prev.size.filter(size => size !== sizeToRemove)
        }));
    };

    const update = (e) => {
        e.preventDefault();
        
        // Debug log trước khi gửi đi
        console.log('Sending size to API:', state.size);
        console.log('Sending color to API:', state.color);
        console.log('Sending tags to API:', state.tags);
        
        // Kiểm tra dữ liệu trước khi gửi đi
        if (!Array.isArray(state.size) || state.size.length === 0) {
            toast.error('Vui lòng chọn ít nhất một kích thước');
            return;
        }
        
        if (!Array.isArray(state.color) || state.color.length === 0) {
            toast.error('Vui lòng thêm ít nhất một màu sắc');
            return;
        }
        
        // Đảm bảo mỗi trường được serialize chỉ một lần
        const simplifyArray = (arr) => {
            if (!Array.isArray(arr)) return JSON.stringify([]);
            return JSON.stringify(arr);
        };
        
        const obj = {
            name: state.name,
            description: state.description,
            discount: state.discount,
            price: state.price,
            brand: state.brand,
            stock: state.stock,
            category: category,
            productId: productId,
            size: simplifyArray(state.size),
            color: simplifyArray(state.color),
            tags: simplifyArray(state.tags)
        };
        
        console.log('Final data being sent to server:', obj);
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
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Kích thước mặc định:</p>
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
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Kích thước tùy chỉnh:</p>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        onKeyPress={handleSizeKeyPress}
                                        placeholder="Nhập kích thước tùy chỉnh"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSize}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Thêm
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {state.size.filter(size => !availableSizes.includes(size)).map((size, index) => (
                                        <div
                                            key={index}
                                            className="group relative px-3 py-1 rounded-full border border-gray-300 bg-white"
                                        >
                                            <span>{size}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(size)}
                                                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <IoMdCloseCircle size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
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

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Thẻ Sản Phẩm</label>
                        <div className='mb-2'>
                            <p className='text-sm text-gray-600 mb-2'>Thêm thẻ để giúp sản phẩm dễ tìm kiếm hơn</p>
                            <div className='flex gap-2'>
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={handleTagKeyPress}
                                    placeholder="Nhập thẻ sản phẩm (ví dụ: thời trang, quần áo, hot...)"
                                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                />
                                <button
                                    type='button'
                                    onClick={handleAddTag}
                                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {state.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className='group relative px-3 py-1 rounded-full border border-gray-300 bg-white'
                                >
                                    <span>#{tag}</span>
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveTag(tag)}
                                        className='absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                                    >
                                        <IoMdCloseCircle size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mb-6'>
                        <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-2'>Mô Tả Sản Phẩm</label>
                        <div className='editor-container'>
                            <ReactQuill
                                key={productId}
                                theme="snow"
                                value={editorContent}
                                onChange={handleDescriptionChange}
                                modules={modules}
                                formats={formats}
                                placeholder="Nhập mô tả chi tiết sản phẩm..."
                                className="custom-quill-editor"
                            />
                            <style>{`
                                .editor-container {
                                    height: 500px;
                                    margin-bottom: 60px;
                                    position: relative;
                                }
                                .custom-quill-editor {
                                    height: 100%;
                                    display: flex;
                                    flex-direction: column;
                                }
                                .ql-toolbar {
                                    border: 1px solid #e2e8f0;
                                    border-radius: 8px 8px 0 0;
                                    background: white;
                                    position: sticky;
                                    top: 0;
                                    z-index: 1;
                                }
                                .ql-container {
                                    font-size: 16px;
                                    border: 1px solid #e2e8f0;
                                    border-top: none;
                                    border-radius: 0 0 8px 8px;
                                    height: calc(100% - 42px);
                                    background: white;
                                    flex: 1;
                                }
                                .ql-editor {
                                    min-height: 100%;
                                    font-size: 16px;
                                    line-height: 1.6;
                                    padding: 20px;
                                    overflow-y: auto;
                                }
                                .ql-editor p {
                                    margin-bottom: 1em;
                                }
                                .ql-editor img {
                                    max-width: 100%;
                                    height: auto;
                                    max-height: 400px;
                                    display: block;
                                    margin: 10px auto;
                                }
                                .ql-editor * {
                                    white-space: pre-wrap;
                                }
                                .ql-editor.ql-blank::before {
                                    color: #a0aec0;
                                    font-style: normal;
                                }
                                .ql-editor:focus {
                                    outline: none;
                                    border-color: #4f46e5;
                                    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
                                }
                            `}</style>
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