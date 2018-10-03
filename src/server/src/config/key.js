import prodKey from './keys_prod';
import devKey from './keys_dev';

let dbKey;
if (process.env.NODE_ENV === 'production') {
		dbKey = prodKey;
} else {
		dbKey = devKey;
}

export default dbKey;
