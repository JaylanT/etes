const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const pool = new ibmdb.Pool();
const config = require('../config/db-config');


module.exports = {
	open() {
		return pool.openAsync(config);
	},

	prepareAndExecute(conn, sql, bindingParameters) {
		return conn.prepareAsync(sql)
			.then(stmt => stmt.executeAsync(bindingParameters))
			.then(result => {
				const data = result.fetchAllSync();
				result.closeSync();
				return data;
			})
			.catch(err => {
				conn.closeSync();
				throw Error(err.message);
			});
	},

	prepareAndExecuteNonQuery(conn, sql, bindingParameters) {
		return conn.prepareAsync(sql)
			.then(stmt => stmt.executeNonQueryAsync(bindingParameters))
			.catch(err => {
				conn.closeSync();
				throw Error(err.message);
			});
	}
};
