// In-memory mock database
let mockUsers = [
    { id: 1, name: 'ABC', email: 'abc@example.com', role: 'Admin' },
    { id: 2, name: 'DEF', email: 'def@example.com', role: 'User' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUsers = async () => {
    await delay(800); // Simulate network delay
    return [...mockUsers];
};

export const createUser = async (newUser) => {
    await delay(1000);
    // Simulate a random failure 20% of the time for testing error states
    if (Math.random() < 0.2) throw new Error('Server failed to create user');

    const user = { ...newUser, id: Date.now() };
    mockUsers.push(user);
    return user;
};

export const deleteUser = async (userId) => {
    await delay(1000);
    // Simulate a random failure 20% of the time for testing optimistic rollbacks
    if (Math.random() < 0.2) throw new Error('Server failed to delete user');

    mockUsers = mockUsers.filter((u) => u.id !== userId);
    return userId;
};