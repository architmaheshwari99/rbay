import {client} from '$services/redis'
import {bidHistoryKey} from '$services/keys';
import { DateTime } from 'luxon';
import { getItem } from './items';
import type { CreateBidAttrs, Bid } from '$services/types';

export const createBid = async (attrs: CreateBidAttrs) => {

	const serialized = serializeHistory(
		attrs.amount, 
		attrs.createdAt
	) ;
	
	return client.rPush(bidHistoryKey(attrs.itemId), serialized);
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count ; 
	const endIndex = -1 - offset;

	const range = await client.lRange(
		bidHistoryKey(itemId),
		startIndex,
		endIndex
	)

	return range.map((bid)=> deseraizeHistory(bid));
};

const serializeHistory = (amount: number, createdAt: DateTime) => {
	return `${amount}: ${createdAt}`;
}

const deseraizeHistory = (store: string) => {
	const [amount, createdAt] = store.split(':');
	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	}
}