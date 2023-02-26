import { client } from '$services/redis'
import { bidHistoryKey, itemsByPriceKey, itemsKey } from '$services/keys';
import { DateTime } from 'luxon';
import { getItem } from './items';
import type { CreateBidAttrs, Bid } from '$services/types';

export const createBid = async (attrs: CreateBidAttrs) => {

	return client.executeIsolated(async (isolatedClient)=> {
		await isolatedClient.watch(itemsKey(attrs.itemId));

		const item = await getItem(attrs.itemId);

		if (!item) {
			throw new Error('Item not found')
		}
	
		if (item.price >= attrs.amount) {
			throw new Error('Bid too low')
		}
	
		if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
			throw new Error('Item closed for bidding')
		}
	
		const serialized = serializeHistory(
			attrs.amount,
			attrs.createdAt
		);
	
		return isolatedClient.multi().
				rPush(bidHistoryKey(attrs.itemId), serialized)
				.hSet(itemsKey(item.id), {
					bids: item.bids + 1,
					price: attrs.amount,
					highestBidUserId: attrs.userId
				})
				.zAdd(itemsByPriceKey(),{
					value: item.id,
					score: attrs.amount
				})
				.exec();
			});

};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 - offset;

	const range = await client.lRange(
		bidHistoryKey(itemId),
		startIndex,
		endIndex
	)

	return range.map((bid) => deseraizeHistory(bid));
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