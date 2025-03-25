import React, { forwardRef } from 'react';
import { FixedSizeList as List } from "react-window";

const PaymentRequest = () => {
    // Xử lý sự kiện cuộn
    const handleOnWheel = ({ deltaY }) => {
        console.log('handleOnWheel', deltaY);
    };

    // Custom outer element cho List để thêm sự kiện cuộn
    const outerElementType = forwardRef((props, ref) => (
        <div ref={ref} onWheel={handleOnWheel} {...props} />
    ));

    // Component Row cho từng dòng trong danh sách
    const Row = ({ index, style }) => {
        const status = index % 2 === 0 ? 'Đang chờ' : 'Đã xác nhận';
        return (
            <div style={style} className='flex text-sm text-gray-800 border-b border-gray-300 hover:bg-gray-100'>
                <div className='w-[10%] p-2 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    {(100000 * (index + 1)).toLocaleString('vi-VN')}đ
                </div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    <span
                        className={`py-1 px-2 rounded-md text-xs ${
                            status === 'Đang chờ' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'
                        }`}
                    >
                        {status}
                    </span>
                </div>
                <div className='w-[20%] p-2 whitespace-nowrap'>25 Mar 2025</div>
                <div className='w-[30%] p-2 whitespace-nowrap'>
                    <button
                        className='bg-indigo-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-indigo-700 transition-colors text-xs'
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='px-2 sm:px-4 lg:px-7 pt-5 max-w-full'>
            <div className='w-full bg-[#f0f4f8] rounded-lg shadow-md p-4'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Yêu cầu thanh toán</h2>
                <div className='w-full'>
                    <div className='w-full overflow-x-auto'>
                        {/* Header bảng */}
                        <div className='flex bg-[#d1dbe8] text-gray-700 uppercase font-semibold text-xs min-w-[340px] rounded-t-md'>
                            <div className='w-[10%] p-2'>TT</div>
                            <div className='w-[20%] p-2'>Số tiền</div>
                            <div className='w-[20%] p-2'>Trạng thái</div>
                            <div className='w-[20%] p-2'>Ngày</div>
                            <div className='w-[30%] p-2'>Hành động</div>
                        </div>

                        {/* Danh sách virtualized */}
                        <List
                            style={{ minWidth: '340px' }}
                            className='List'
                            height={350}
                            itemCount={100}
                            itemSize={35} // Tăng itemSize để vừa với nội dung
                            outerElementType={outerElementType}
                        >
                            {Row}
                        </List>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentRequest;