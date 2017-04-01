module.exports = {
	checkStatus(res) {
		if (!res.ok) {
			throw Error(res.statusText);
		}
		return res;
	},

	parseJSON(res) {
		return res.json();
	}
}

