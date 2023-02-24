import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car', {
        'color': 'red',
        'type': 'SUV'
    });

    const car = await client.hGetAll('car');

    console.log(car);

    await client.hSet('house', {
        'color': 'red',
        'type': 'flat',
        'maintenance': {'Jan': 'Y'},
        'owner': null || '', // This is reqquired to fix null error is toString
    });

    const house = await client.hGetAll('house');

    console.log(house);

    var key10 = await client.hGetAll('key10');
    // If key1 is doesn't exist in 
    // redis it return {} instead of null
    console.log(key10);
};
run();
