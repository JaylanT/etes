const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const pool = new ibmdb.Pool();
const config = require('../config/db-config');


function executeSql(sql, executeStmt) {
	return pool.openAsync(config)
		.then(conn => {
			return conn.prepare(sql)
				.then(stmt => {
					return executeStmt(stmt);
				})
				.finally(() => conn.close());
		})
		.catch(err => { throw Error(err.message) });
}

module.exports = {
	query(sql) {
		return pool.openAsync(config)
			.then(conn => {
				return conn.query(sql)
					.finally(() => conn.close());
			})
			.catch(err => { throw Error(err.message) });
	},

	execute(sql, bindingParameters) {
		function executeStmt(stmt) {
			return stmt.executeAsync(bindingParameters)
					.then(result => {
						return result.fetchAllAsync()
							.finally(() => result.closeSync());
					})
					.finally(() => stmt.closeSync());
		}
		return executeSql(sql, executeStmt);
	},

	executeNonQuery(sql, bindingParameters) {
		function executeStmt(stmt) {
			return stmt.executeNonQueryAsync(bindingParameters)
				.finally(() => stmt.closeSync());
		}
		return executeSql(sql, executeStmt);
	}
};
