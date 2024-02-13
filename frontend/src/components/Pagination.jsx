function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="flex items-center justify-center self-center w-full gap-2 md:fixed md:bottom-2 md:z-10">
			<button
				className="disabled:scale-75 rounded-full"
				disabled={currentPage === 1}
				onClick={() => onPageChange(1)}
			>
				<img src="/first.png" alt="first" className="w-6 h-6 hover:scale-125" />
			</button>
			<button
				className="disabled:scale-75 rounded-full"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
			>
				<img src="/prev.png" alt="prev" className="w-6 h-6 hover:scale-125" />
			</button>
			<span className="font-medium text-center text-slate-700 p-2">
				{`${currentPage} / ${totalPages}`}
			</span>
			<button
				className="disabled:scale-75 rounded-full"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
			>
				<img src="/next.png" alt="next" className="w-6 h-6 hover:scale-125" />
			</button>
			<button
				className="disabled:scale-75 rounded-full"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(totalPages)}
			>
				<img src="/last.png" alt="prev" className="w-6 h-6 hover:scale-125" />
			</button>
		</div>
	);
}

export default Pagination;
