import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car2', {
        'color': 'red2',
        'type': 'SUV2'
    });

    await client.hSet('car3', {
        'color': 'red3',
        'type': 'SUV3'
    });

    await client.hSet('car4', {
        'color': 'red4',
        'type': 'SUV4'
    });

    // Pipelining
    const result = await Promise.all([
        client.hGetAll('car2'),
        client.hGetAll('car3'),
        client.hGetAll('car4'),
    ]);
    console.log(result);

};
run();
