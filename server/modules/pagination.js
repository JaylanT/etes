module.exports = (link, count, limit, page, q, order) => {
	const lastPageNum = Math.ceil(count / limit);

	let nextPage = (lastPageNum > 0 && page !== lastPageNum) ? `/${link}?page=${(page + 1)}&limit=${limit}` : '',
		prevPage = page === 1 ? '' : `/${link}?page=${(page - 1)}&limit=${limit}`,
		firstPage = `/${link}?page=1&limit=${limit}`,
		lastPage = `/${link}?page=${lastPageNum}&limit=${limit}`;

	if (q) {
		if (nextPage) nextPage += '&q=' + q;
		if (prevPage) prevPage += '&q=' + q;
		firstPage += '&q=' + q;
		lastPage += '&q=' + q;
	}

	if (order) {
		if (nextPage) nextPage += '&order=' + order;
		if (prevPage) prevPage += '&order=' + order;	
		firstPage += '&order=' + order;
		lastPage += '&order=' + order;
	}

	return {
		next: nextPage,
		previous: prevPage,
		first: firstPage,
		last: lastPage
	};
};
