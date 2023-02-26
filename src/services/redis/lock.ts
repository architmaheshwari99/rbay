import {randomBytes} from 'crypto';
import { client } from '$services/redis';

export const withLock = async (key: string, cb: () => any) => {

	const retryDelayMs = 100;
	let retries = 20;

	// Generate a random value to set the value as key
	const token = randomBytes(6).toString('hex');

	// Create a lock key 
	const lockKey = `lock-${key}`;

	// Setup retry
	while(retries>=0){
		retries--;
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		});

		if(!acquired){
			await pause(retryDelayMs);
			continue;
		}
		// Unset the lock

		try {
			const result = await cb();
			return result;
		} finally {
			await client.del(lockKey);
		}
	} 
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
