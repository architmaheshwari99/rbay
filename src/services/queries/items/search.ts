import { client } from '$services/redis';
import { deserialize } from './deserialize';
import { itemsIndexKey, itemsKey } from '$services/keys';


export const searchItems = async (term: string, size: number = 5) => {
    const cleaned = term
                        .replace(/[^a-zA-Z0-9]/g, '')
                        .trim()
                        .split(' ')
                        .map((word) => word ? `%${word}%` : '')
                        .join(' ')

    // Look at cleaned and make sure it is valid
    if (cleaned === ''){
        return [];
    }

    const query = `(@name:(${cleaned}) => {$weight: 5.0 }) | (@description:(${cleaned}))`

    // Use the client to do the search
    const results = await client.ft.search(
        itemsIndexKey(),
        query, {
            LIMIT: {
                from: 0,
                size: size
            }
        }
    );

    // console.log(results);

    // Deserialize and retuen the search results

    return results.documents.map(({id, value}) => deserialize(id, value as any));

};
