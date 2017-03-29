module.exports = {
	checkStatus: res => {
	  if (res.status >= 200 && res.status < 300) {
		return res;
	  } else {
		const error = new Error(res.statusText);
		error.res = res;
		throw error;
	  }
	},
	parseJSON: res => {
		return res.json();
	}
}

