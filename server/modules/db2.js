const Promise = require('bluebird');
const Pool = require('ibm_db').Pool;
const pool = new Pool();
const config = require('../config/db-config');

module.exports = {
	executeSql(sql, bindingParameters) {
		return pool.openAsync(config)
			.then(conn => {
				return conn.prepare(sql)
					.then(stmt => {
						return new Promise((resolve, reject) => {
							stmt.execute(bindingParameters, (err, result) => {
								if (err) {
									reject(Error(err));
								} else {
									const data = result.fetchAllSync();
									result.closeSync();
									resolve(data);
								}
								stmt.closeSync();
							});
						});
					})
					.finally(() => conn.close());
			})
			.catch(err => {
				return {
					status: 400,
					message: err.message
				};
			});
	}
};
