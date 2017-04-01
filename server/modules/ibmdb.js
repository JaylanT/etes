const Promise = require('bluebird');
const Pool = require('ibm_db').Pool;
const pool = new Pool();
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
	execute(sql, bindingParameters) {
		function executeStmt(stmt) {
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
		}
		return executeSql(sql, executeStmt);
	},

	executeNonQuery(sql, bindingParameters) {
		function executeStmt(stmt) {
			return new Promise((resolve, reject) => {
				stmt.executeNonQuery(bindingParameters, (err, ret) => {
					if (err) {
						reject(Error(err));
					} else {
						resolve(ret);
					}
					stmt.closeSync();
				});
			});
		}
		return executeSql(sql, executeStmt);
	}
};
