export default {
	checkStatus(res) {
		if (!res.ok) {
			return res.json()
				.then(err => { throw Error(err.message); });
		}
		return res;
	},

	parseJSON(res) {
		return res.json();
	}
};

