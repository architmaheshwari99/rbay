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
			NX: true
		});

		if(!acquired){
			await pause(retryDelayMs);
			continue;
		}

		const result = await cb();
		// Unset the lock
		await client.del(lockKey);
		return result;
	} 
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
