import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categorys = [] } = useSelector(state => state.category);
    const { loader, successMessage, errorMessage } = useSelector(state => state.product);
    const { userInfo } = useSelector(state => state.auth);

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

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [newColor, setNewColor] = useState('');
    const [newTag, setNewTag] = useState('');

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

    // Tải danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                await dispatch(get_category({
                    searchValue: '',
                    parPage: '',
                    page: ""
                }));
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [dispatch]);

    // Cập nhật danh sách danh mục khi dữ liệu thay đổi
    useEffect(() => {
        setAllCategories(categorys);
    }, [categorys]);

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
            setAllCategories(srcValue);
        } else {
            setAllCategories(categorys);
        }
    };

    const imageHandle = (e) => {
        const files = e.target.files;
        const length = files.length;
        if (length > 0) {
            setImages([...images, ...files]);
            let imageUrl = [];
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) });
            }
            setImageShow([...imageShow, ...imageUrl]);
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setState({
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
            setImageShow([]);
            setImages([]);
            setCategory('');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = [...imageShow];
            let tempImages = [...images];
            tempImages[index] = img;
            tempUrl[index] = { url: URL.createObjectURL(img) };
            setImageShow(tempUrl);
            setImages(tempImages);
        }
    };

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i);
        const filterImageUrl = imageShow.filter((img, index) => index !== i);
        setImages(filterImage);
        setImageShow(filterImageUrl);
    };

    const handleSizeChange = (size) => {
        setState(prev => {
            const newSizes = prev.size.includes(size)
                ? prev.size.filter(s => s !== size)
                : [...prev.size, size];
            return { ...prev, size: newSizes };
        });
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

    const handleDescriptionChange = useCallback((content) => {
        setState(prev => ({ ...prev, description: content }));
    }, []);

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

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const add = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('price', state.price);
        formData.append('stock', state.stock);
        formData.append('discount', state.discount);
        formData.append('brand', state.brand);
        formData.append('shopName', userInfo?.shopInfo?.shopName || 'Cửa hàng của tôi');
        formData.append('category', category);
        
        // Đảm bảo dữ liệu mảng được serialize chỉ một lần
        console.log('Size trước khi gửi:', state.size);
        console.log('Color trước khi gửi:', state.color);
        console.log('Tags trước khi gửi:', state.tags);
        
        // Kiểm tra và đảm bảo mảng không rỗng
        if (!Array.isArray(state.size) || state.size.length === 0) {
            toast.error('Vui lòng chọn ít nhất một kích thước');
            return;
        }
        
        if (!Array.isArray(state.color) || state.color.length === 0) {
            toast.error('Vui lòng thêm ít nhất một màu sắc');
            return;
        }
        
        // Serialize mảng thành JSON string
        formData.append('size', JSON.stringify(state.size));
        formData.append('color', JSON.stringify(state.color));
        formData.append('tags', JSON.stringify(state.tags));
        
        // Đảm bảo có ít nhất một hình ảnh
        if (images.length === 0) {
            toast.error('Vui lòng thêm ít nhất một hình ảnh cho sản phẩm');
            return;
        }

        images.forEach(img => {
            formData.append('images', img);
        });

        // Gửi dữ liệu
        dispatch(add_product(formData));
    };

    useEffect(() => {
        setAllCategories(categorys);
    }, [categorys]);

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='w-full p-6 bg-white rounded-lg shadow-md'>
                <div className='flex justify-between items-center pb-6 border-b border-gray-200'>
                    <h1 className='text-2xl font-bold text-gray-800'>Thêm Sản Phẩm Mới</h1>
                    <Link to='/seller/products' className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 transition-colors flex items-center gap-2'>
                        <FiPlusCircle /> Danh Sách Sản Phẩm
                    </Link>
                </div>

                <form onSubmit={add} className='mt-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='space-y-2'>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Tên Sản Phẩm</label>
                            <input
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                onChange={inputHandle}
                                value={state.name}
                                type="text"
                                name='name'
                                id='name'
                                placeholder='Nhập tên sản phẩm'
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="brand" className='block text-sm font-medium text-gray-700'>Thương Hiệu</label>
                            <input
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                onChange={inputHandle}
                                value={state.brand}
                                type="text"
                                name='brand'
                                id='brand'
                                placeholder='Nhập thương hiệu'
                                required
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>Kích Thước</label>
                            <div className='flex flex-wrap gap-2'>
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        type='button'
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

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>Màu Sắc</label>
                            <div className='flex gap-2 mb-2'>
                                <input
                                    type="text"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập màu sắc"
                                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                />
                                <button
                                    type='button'
                                    onClick={handleAddColor}
                                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                                >
                                    Thêm
                                </button>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {state.color.map((color, index) => (
                                    <div
                                        key={index}
                                        className='group relative px-3 py-1 rounded-full border border-gray-300 bg-white'
                                    >
                                        <span>{color}</span>
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveColor(color)}
                                            className='absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            <IoMdCloseCircle size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='space-y-2 relative'>
                            <label htmlFor="category" className='block text-sm font-medium text-gray-700'>Danh Mục</label>
                            <input
                                readOnly
                                onClick={() => setCateShow(!cateShow)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer'
                                value={category}
                                type="text"
                                id='category'
                                placeholder='-- Chọn danh mục --'
                                required
                            />

                            <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all ${cateShow ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <div className='p-2 border-b'>
                                    <div className='relative'>
                                        <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                                        <input
                                            value={searchValue}
                                            onChange={categorySearch}
                                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                            type="text"
                                            placeholder='Tìm kiếm danh mục'
                                        />
                                    </div>
                                </div>
                                <div className='max-h-60 overflow-y-auto'>
                                    {loadingCategories ? (
                                        <div className="px-4 py-2 text-center text-gray-500">
                                            <PropagateLoader color='#4f46e5' size={10} />
                                        </div>
                                    ) : allCategories.length > 0 ? (
                                        allCategories.map((c, i) => (
                                            <div
                                                key={i}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${category === c.name ? 'bg-indigo-100 text-indigo-700' : ''}`}
                                                onClick={() => {
                                                    setCateShow(false);
                                                    setCategory(c.name);
                                                    setSearchValue('');
                                                    setAllCategories(categorys);
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
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="stock" className='block text-sm font-medium text-gray-700'>Số Lượng Tồn Kho</label>
                            <input
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                onChange={inputHandle}
                                value={state.stock}
                                type="number"
                                name='stock'
                                id='stock'
                                placeholder='Nhập số lượng'
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='space-y-2'>
                            <label htmlFor="price" className='block text-sm font-medium text-gray-700'>Giá Bán</label>
                            <input
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                onChange={inputHandle}
                                value={state.price}
                                type="number"
                                name='price'
                                id='price'
                                placeholder='Nhập giá bán'
                                min="0"
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="discount" className='block text-sm font-medium text-gray-700'>Giảm Giá (%)</label>
                            <input
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                onChange={inputHandle}
                                value={state.discount}
                                type="number"
                                name='discount'
                                id='discount'
                                placeholder='Nhập % giảm giá'
                                min="0"
                                max="100"
                            />
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
                                theme="snow"
                                value={state.description}
                                onChange={handleDescriptionChange}
                                modules={modules}
                                formats={formats}
                                placeholder="Nhập mô tả chi tiết sản phẩm..."
                                className="custom-quill-editor"
                            />
                            <style>{`
                                .editor-container {
                                    height: 400px;
                                    margin-bottom: 60px;
                                    border-radius: 8px;
                                    overflow: hidden;
                                }
                                .custom-quill-editor {
                                    height: 100%;
                                    display: flex;
                                    flex-direction: column;
                                }
                                .ql-container {
                                    font-size: 16px;
                                    flex: 1;
                                    overflow-y: auto;
                                }
                                .ql-toolbar {
                                    background: #fff;
                                    border: 1px solid #e2e8f0;
                                    border-top-left-radius: 8px;
                                    border-top-right-radius: 8px;
                                }
                                .ql-container {
                                    border: 1px solid #e2e8f0;
                                    border-top: none;
                                    border-bottom-left-radius: 8px;
                                    border-bottom-right-radius: 8px;
                                }
                                .ql-editor {
                                    min-height: 300px;
                                    max-height: none;
                                    overflow-y: auto;
                                    line-height: 1.6;
                                    padding: 12px 15px;
                                }
                                .ql-editor img {
                                    max-width: 100%;
                                    height: auto;
                                    max-height: 300px;
                                    object-fit: contain;
                                    margin: 10px auto;
                                    display: block;
                                }
                                .ql-editor p {
                                    margin-bottom: 1em;
                                }
                                /* Tùy chỉnh thanh cuộn */
                                .ql-editor::-webkit-scrollbar {
                                    width: 8px;
                                }
                                .ql-editor::-webkit-scrollbar-track {
                                    background: #f1f1f1;
                                    border-radius: 4px;
                                }
                                .ql-editor::-webkit-scrollbar-thumb {
                                    background: #c1c1c1;
                                    border-radius: 4px;
                                }
                                .ql-editor::-webkit-scrollbar-thumb:hover {
                                    background: #a8a8a8;
                                }
                            `}</style>
                        </div>
                    </div>

                    <div className='mb-8'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Hình Ảnh Sản Phẩm</label>
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {imageShow.map((img, i) => (
                                <div key={i} className='relative group h-40 rounded-lg overflow-hidden border border-gray-200'>
                                    <label htmlFor={`image-${i}`} className='cursor-pointer'>
                                        <img className='w-full h-full object-cover' src={img.url} alt={`Preview ${i}`} />
                                    </label>
                                    <input
                                        onChange={(e) => changeImage(e.target.files[0], i)}
                                        type="file"
                                        id={`image-${i}`}
                                        className='hidden'
                                        accept='image/*'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => removeImage(i)}
                                        className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                                    >
                                        <IoMdCloseCircle size={20} />
                                    </button>
                                </div>
                            ))}

                            <label
                                htmlFor="image"
                                className='flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors'
                            >
                                <IoMdImages size={32} className='text-gray-400 mb-2' />
                                <span className='text-sm text-gray-600'>Thêm Ảnh</span>
                                <input
                                    className='hidden'
                                    onChange={imageHandle}
                                    multiple
                                    type="file"
                                    id='image'
                                    accept='image/*'
                                />
                            </label>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <button
                            disabled={loader || !state.size.length || !state.color.length}
                            type='submit'
                            className={`w-full md:w-64 px-6 py-3 rounded-lg text-white font-medium ${
                                loader || !state.size.length || !state.color.length
                                    ? 'bg-indigo-400'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            } transition-colors flex items-center justify-center`}
                        >
                            {loader ? (
                                <PropagateLoader color='#fff' cssOverride={overrideStyle} size={10} />
                            ) : (
                                'Thêm Sản Phẩm'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;