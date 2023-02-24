import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import {client} from '$services/redis'
import { usersKey, usernamesUniqueKey, usernamesKey} from '$services/keys';

export const getUserByUsername = async (username: string) => {
    // we can also use hash to store username: userId
    // use the username to find userID from sorted set
    const decimalId = await client.zScore(usernamesKey(), username);

    // make sure we get the id
    if (!decimalId) {
        throw new Error(`Could not find username ${username}`);
    }
    // take the id and convert to hex
    const hexId = decimalId.toString(16);

    // find the user in hash
    const user = await client.hGetAll(usersKey(hexId));
    // deserialize and return 
    return deserialize(hexId, user);
};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(usersKey(id));

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId();

    const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
    if (exists){
        throw new Error(`User ${attrs.username} already exists`);
    }
    await client.hSet(usersKey(id), serialize(attrs));
    await client.sAdd(usernamesUniqueKey(), attrs.username);
    await client.zAdd(usernamesKey(), {
        value: attrs.username,
        score: parseInt(id, 16)
    });
    
    return id;
};

const deserialize = (id:string, user: {[key: string]: string}) => {
    return {
        id: id,
        username: user.username,
        password: user.password
    };
}

const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password
    };
};