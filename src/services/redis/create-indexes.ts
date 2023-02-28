import { client } from '$services/redis';
import { SchemaFieldTypes } from 'redis';
import { itemsIndexKey, itemsKey } from '$services/keys';

export const createIndexes = async () => {
    return client.ft.create(
        itemsIndexKey(),
        {
            name: {
                type: SchemaFieldTypes.TEXT
            },
            description: {
                type: SchemaFieldTypes.TEXT
            }
        },
        {
            ON: 'HASH',
            PREFIX: itemsKey('')
        }
    )
};
