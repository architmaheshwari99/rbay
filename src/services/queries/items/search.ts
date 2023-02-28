import { client } from '$services/redis';
import { deserialize } from './deserialize';
import { itemsIndexKey, itemsKey } from '$services/keys';


export const searchItems = async (term: string, size: number = 5) => {
    const cleaned = term
                        .replace(/[a-zA-Z0-9]/g, '')
                        .trim()
                        .split(' ')
                        .map((word) => word ? `%${word}%` : '')
                        .join(' ')
};
