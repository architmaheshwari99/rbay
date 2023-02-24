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
};
run();
