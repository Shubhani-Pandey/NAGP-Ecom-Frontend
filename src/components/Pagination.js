
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
    <div>
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index + 1}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => onPageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}

            
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>


        </div>
        <div>
           <span className="pagination-info">
                Page {currentPage} of {totalPages}
            </span>

        </div>
    </div>
    );
};


export default Pagination;
