export const pageCacheKey = (id: String) => `pagecache#${id}`;

export const usersKey = (userId: string) => `users#${userId}`;

export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;

export const usernamesUniqueKey = () => `usernames:unique`;

export const userLikesKey = (userId: string) => `userLikes:${userId}`;

export const usernamesKey = () => `usernames`;

// Items
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const itemsByViewsKey = () => `itemsByViews`;
export const itemsByEndingAtKey = () => `itemsByEndingAt`;
export const itemsViewsKey = (itemId: String) => `itemsViewsKey#${itemId}`;


