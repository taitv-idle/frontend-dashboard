import React from 'react';

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
    // Tính tổng số trang
    const totalPages = Math.ceil(totalItem / parPage);

    // Hàm chuyển đến trang trước
    const handlePrev = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    // Hàm chuyển đến trang sau
    const handleNext = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    // Tạo mảng các số trang để hiển thị
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Số lượng trang tối đa hiển thị cùng lúc
        let startPage = Math.max(1, pageNumber - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Điều chỉnh startPage nếu endPage chạm giới hạn
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Thêm các số trang vào mảng
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setPageNumber(i)}
                    className={`px-3 py-1 mx-1 rounded-md ${pageNumber === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };

    // Nếu không có mục nào để hiển thị
    if (totalItem === 0) {
        return <div className='text-center py-2 text-gray-500'>Không có dữ liệu</div>;
    }

    return (
        <div className='flex justify-center items-center py-4'>
            <button
                onClick={handlePrev}
                disabled={pageNumber === 1}
                className={`px-3 py-1 mx-1 rounded-md ${pageNumber === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
                Trước
            </button>

            {renderPageNumbers()}

            <button
                onClick={handleNext}
                disabled={pageNumber === totalPages}
                className={`px-3 py-1 mx-1 rounded-md ${pageNumber === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
                Sau
            </button>

            <span className='ml-4 text-sm text-gray-700'>
                Trang {pageNumber} / {totalPages} (Tổng {totalItem} đơn hàng)
            </span>
        </div>
    );
};

export default Pagination;