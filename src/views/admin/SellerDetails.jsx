import React from 'react';

const SellerDetails = () => {
    return (
        <div className='px-2 sm:px-4 lg:px-7 pt-5 max-w-full'>
            <h1 className='text-2xl font-semibold text-[#1e293b] mb-5'>Thông tin người bán</h1>
            <div className='w-full bg-[#f5f7fa] rounded-lg p-4 sm:p-6'>
                <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6'>
                    <div className='flex flex-col lg:flex-row gap-6'>
                        {/* Ảnh người bán */}
                        <div className='w-full lg:w-1/4 flex justify-center items-center'>
                            <img
                                className='w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full object-cover border border-gray-300'
                                src="/images/admin.png"
                                alt="Người bán"
                            />
                        </div>

                        {/* Thông tin */}
                        <div className='w-full lg:w-3/4 flex flex-col sm:flex-row gap-6'>
                            {/* Thông tin cơ bản */}
                            <div className='w-full sm:w-1/2'>
                                <h2 className='text-lg font-semibold text-[#1e293b] mb-3'>Thông tin cơ bản</h2>
                                <div className='bg-gray-50 rounded-md p-4 text-sm text-gray-700'>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Tên:</span>
                                        <span>Trương Văn Tài</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Email:</span>
                                        <span>taitv@abc.com</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Quyền:</span>
                                        <span>Seller</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Trạng thái:</span>
                                        <span className='py-1 px-2 bg-green-100 text-green-800 rounded-md text-xs inline-block'>Kích hoạt</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Phương thức thanh toán:</span>
                                        <span>Kích hoạt</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin địa chỉ */}
                            <div className='w-full sm:w-1/2'>
                                <h2 className='text-lg font-semibold text-[#1e293b] mb-3'>Thông tin địa chỉ</h2>
                                <div className='bg-gray-50 rounded-md p-4 text-sm text-gray-700'>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Tên cửa hàng:</span>
                                        <span>N4SHOP</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Huyện:</span>
                                        <span>Diễn Châu</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Thành phố:</span>
                                        <span>Nghệ An</span>
                                    </div>
                                    <div className='flex justify-between py-1'>
                                        <span className='font-medium'>Quốc gia:</span>
                                        <span>Việt Nam</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form cập nhật trạng thái */}
                    <div className='mt-6'>
                        <form>
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <select
                                    className='px-3 py-1.5 w-full sm:w-48 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none text-sm'
                                    name="status"
                                    id="status"
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value="active">Kích hoạt</option>
                                    <option value="deactive">Bỏ kích hoạt</option>
                                </select>
                                <button
                                    type='submit'
                                    className='w-full sm:w-40 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg text-sm'
                                >
                                    Cập nhật trạng thái
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;