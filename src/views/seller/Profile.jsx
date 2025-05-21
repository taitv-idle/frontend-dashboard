import React, { useEffect, useState } from 'react';
import { FaImages, FaRegEdit, FaUser, FaEnvelope, FaShieldAlt, FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import { FadeLoader, PropagateLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import {
    profile_image_upload,
    messageClear,
    profile_info_add,
    change_password
} from '../../store/Reducers/authReducer';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profileInfo, setProfileInfo] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    });

    const [passwordData, setPasswordData] = useState({
        email: "",
        old_password: "",
        new_password: ""
    });

    const dispatch = useDispatch();
    const { userInfo, loader, successMessage, errorMessage } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Xử lý thông báo
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

    // Upload ảnh đại diện
    const handleImageUpload = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    // Xử lý input thông tin cửa hàng
    const handleProfileInput = (e) => {
        setProfileInfo({
            ...profileInfo,
            [e.target.name]: e.target.value
        });
    };

    // Submit thông tin cửa hàng
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        dispatch(profile_info_add(profileInfo));
    };

    // Xử lý input thay đổi mật khẩu
    const handlePasswordInput = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    // Submit thay đổi mật khẩu
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        dispatch(change_password(passwordData));
    };

    // Xử lý kích hoạt tài khoản thanh toán
    const handleActivatePayment = async () => {
        try {
            const response = await dispatch(create_stripe_connect_account());
            if (response?.payload?.url) {
                // Chuyển hướng đến trang kích hoạt Stripe
                window.location.href = response.payload.url;
            } else {
                toast.error('Không thể tạo liên kết kích hoạt tài khoản');
            }
        } catch (error) {
            console.error('Payment activation error:', error);
            toast.error(error?.message || 'Lỗi khi kích hoạt tài khoản thanh toán');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Phần thông tin cá nhân */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>

                        {/* Ảnh đại diện */}
                        <div className="flex flex-col items-center mb-6">
                            <label htmlFor="profile-image" className="cursor-pointer group relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-300 transition-all">
                                    {userInfo?.image ? (
                                        <>
                                            <img
                                                src={userInfo.image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                            {loader && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <FadeLoader color="#ffffff" size={10} />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <FaImages size={40} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                                    <FaRegEdit size={16} />
                                </div>
                            </label>
                            <input
                                type="file"
                                id="profile-image"
                                className="hidden"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </div>

                        {/* Thông tin cơ bản */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <FaUser className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tên</p>
                                    <p className="font-medium">{userInfo.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <FaEnvelope className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{userInfo.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <FaShieldAlt className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vai trò</p>
                                    <p className="font-medium capitalize">{userInfo.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <FaShieldAlt className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tài khoản thanh toán</p>
                                    <div className="space-y-2">
                                        {userInfo.payment === 'active' ? (
                                            <div className="space-y-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    Đã kích hoạt
                                                </span>
                                                <button
                                                    onClick={handleActivatePayment}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                >
                                                    Kích hoạt lại
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <button
                                                    onClick={handleActivatePayment}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                >
                                                    Kích hoạt ngay
                                                </button>
                                                <div className="text-xs text-gray-500 space-y-1">
                                                    <p>Lưu ý:</p>
                                                    <ul className="list-disc list-inside">
                                                        <li>Tài khoản thanh toán sẽ được tạo với đơn vị tiền tệ USD</li>
                                                        <li>Bạn cần cung cấp thông tin thẻ thanh toán quốc tế</li>
                                                        <li>Hệ thống sẽ tự động chuyển đổi VND sang USD khi rút tiền</li>
                                                        <li>Đây là tài khoản test, bạn có thể sử dụng thẻ test của Stripe</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin cửa hàng */}
                        {!userInfo?.shopInfo ? (
                            <form onSubmit={handleProfileSubmit}>
                                <h3 className="text-lg font-semibold mb-4">Thông tin cửa hàng</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                                        <input
                                            name="shopName"
                                            value={profileInfo.shopName}
                                            onChange={handleProfileInput}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập tên cửa hàng"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                                        <input
                                            name="division"
                                            value={profileInfo.division}
                                            onChange={handleProfileInput}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập tỉnh/thành phố"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                                        <input
                                            name="district"
                                            value={profileInfo.district}
                                            onChange={handleProfileInput}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập quận/huyện"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                                        <input
                                            name="sub_district"
                                            value={profileInfo.sub_district}
                                            onChange={handleProfileInput}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập phường/xã"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loader}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center"
                                    >
                                        {loader ? (
                                            <PropagateLoader color="#ffffff" size={10} />
                                        ) : (
                                            'Lưu thông tin'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Thông tin cửa hàng</h3>
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <FaStore className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tên cửa hàng</p>
                                        <p className="font-medium">{userInfo.shopInfo?.shopName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Địa chỉ</p>
                                        <p className="font-medium">
                                            {userInfo.shopInfo?.sub_district}, {userInfo.shopInfo?.district}, {userInfo.shopInfo?.division}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Phần đổi mật khẩu */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={passwordData.email}
                                        onChange={handlePasswordInput}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập email của bạn"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        name="old_password"
                                        value={passwordData.old_password}
                                        onChange={handlePasswordInput}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        value={passwordData.new_password}
                                        onChange={handlePasswordInput}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập mật khẩu mới"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loader}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {loader ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;