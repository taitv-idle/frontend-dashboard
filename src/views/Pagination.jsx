import React from 'react';
import {
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight,
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight
} from "react-icons/md";
import PropTypes from 'prop-types';

/**
 * Component Pagination - Hiển thị phân trang với các nút điều hướng
 * @param {Object} props - Các props của component
 * @param {number} props.pageNumber - Trang hiện tại
 * @param {function} props.setPageNumber - Hàm set trang hiện tại
 * @param {number} props.totalItem - Tổng số item
 * @param {number} props.parPage - Số item mỗi trang
 * @param {number} props.showItem - Số nút trang hiển thị
 * @param {string} props.className - Class CSS tùy chỉnh
 * @returns {JSX.Element} - Component Pagination
 */
const Pagination = ({
                        pageNumber,
                        setPageNumber,
                        totalItem,
                        parPage,
                        showItem = 5,
                        className = ''
                    }) => {
    const totalPage = Math.ceil(totalItem / parPage);

    // Tính toán phạm vi trang hiển thị
    const getPageRange = () => {
        let startPage = Math.max(1, pageNumber - Math.floor(showItem / 2));
        let endPage = Math.min(totalPage, startPage + showItem - 1);

        // Điều chỉnh nếu không đủ showItem trang
        if (endPage - startPage + 1 < showItem) {
            startPage = Math.max(1, endPage - showItem + 1);
        }

        return { startPage, endPage };
    };

    const { startPage, endPage } = getPageRange();

    // Tạo các nút trang
    const renderPageButtons = () => {
        const buttons = [];

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <li
                    key={i}
                    onClick={() => setPageNumber(i)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all
            ${pageNumber === i
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50 font-medium'
                        : 'bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200'}
          `}
                >
                    {i}
                </li>
            );
        }
        return buttons;
    };

    // Nút đầu trang
    const goToFirstPage = () => {
        if (pageNumber > 1) setPageNumber(1);
    };

    // Nút cuối trang
    const goToLastPage = () => {
        if (pageNumber < totalPage) setPageNumber(totalPage);
    };

    // Nút trang trước
    const goToPrevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    // Nút trang sau
    const goToNextPage = () => {
        if (pageNumber < totalPage) setPageNumber(pageNumber + 1);
    };

    // Hiển thị dấu "..." khi có nhiều trang
    const renderEllipsis = (key) => (
        <li key={key} className="flex items-center justify-center w-10 h-10 text-gray-500">
            ...
        </li>
    );

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <ul className="flex items-center gap-2">
                {/* Nút đầu trang */}
                {pageNumber > 1 && (
                    <li
                        onClick={goToFirstPage}
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200"
                        title="Đầu trang"
                    >
                        <MdOutlineKeyboardDoubleArrowLeft />
                    </li>
                )}

                {/* Nút trang trước */}
                {pageNumber > 1 && (
                    <li
                        onClick={goToPrevPage}
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200"
                        title="Trang trước"
                    >
                        <MdOutlineKeyboardArrowLeft />
                    </li>
                )}

                {/* Hiển thị "..." nếu không ở đầu trang */}
                {startPage > 1 && renderEllipsis('left-ellipsis')}

                {/* Các nút trang */}
                {renderPageButtons()}

                {/* Hiển thị "..." nếu không ở cuối trang */}
                {endPage < totalPage && renderEllipsis('right-ellipsis')}

                {/* Nút trang sau */}
                {pageNumber < totalPage && (
                    <li
                        onClick={goToNextPage}
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200"
                        title="Trang sau"
                    >
                        <MdOutlineKeyboardArrowRight />
                    </li>
                )}

                {/* Nút cuối trang */}
                {pageNumber < totalPage && (
                    <li
                        onClick={goToLastPage}
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200"
                        title="Cuối trang"
                    >
                        <MdOutlineKeyboardDoubleArrowRight />
                    </li>
                )}
            </ul>

            {/* Hiển thị thông tin trang */}
            <div className="ml-4 text-sm text-gray-600">
                Trang {pageNumber}/{totalPage} • {totalItem} mục
            </div>
        </div>
    );
};

Pagination.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    setPageNumber: PropTypes.func.isRequired,
    totalItem: PropTypes.number.isRequired,
    parPage: PropTypes.number.isRequired,
    showItem: PropTypes.number,
    className: PropTypes.string
};

export default Pagination;