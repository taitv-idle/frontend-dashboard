import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categorys = [] } = useSelector(state => state.category); // Sửa thành 'categorys' để khớp với reducer
    const { loader, successMessage, errorMessage } = useSelector(state => state.product);

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    });

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

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
                stock: ""
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

    const add = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('price', state.price);
        formData.append('stock', state.stock);
        formData.append('discount', state.discount);
        formData.append('brand', state.brand);
        formData.append('shopName', 'EasyShop');
        formData.append('category', category);

        images.forEach(img => {
            formData.append('images', img);
        });

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
                        <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-2'>Mô Tả Sản Phẩm</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]'
                            onChange={inputHandle}
                            value={state.description}
                            name='description'
                            id='description'
                            placeholder='Nhập mô tả chi tiết sản phẩm...'
                            required
                        />
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
                            disabled={loader}
                            type='submit'
                            className={`w-full md:w-64 px-6 py-3 rounded-lg text-white font-medium ${loader ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors flex items-center justify-center`}
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