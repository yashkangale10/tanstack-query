import React, { useState } from 'react'
import { useUsers, useCreateUser, useDeleteUser } from './hooks.jsx'

export default function App() {
    const { data: users, isPending: isLoadingUsers, isError: isUsersError } = useUsers()
    const createUserMutation = useCreateUser()
    const deleteUserMutation = useDeleteUser()

    const [formData, setFormData] = useState({ name: '', email: '', role: 'User' })

    const handleSubmit = (e) => {
        e.preventDefault();
        createUserMutation.mutate(formData, {
            onSuccess: () => {
                setFormData({ name: '', email: '', role: 'User' })
            }
        })
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="app-container">
            <h1>User Management</h1>

            <form onSubmit={handleSubmit} className="user-form">
                <input
                    type="text" name="name" placeholder="Name" required
                    value={formData.name} onChange={handleChange}
                />
                <input
                    type="email" name="email" placeholder="Email" required
                    value={formData.email} onChange={handleChange}
                />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Guest">Guest</option>
                </select>

                <button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </button>

                {createUserMutation.isError && (
                    <p className="error-text">Failed to create user. Please try again.</p>
                )}
            </form>

            <hr />

            <h2>Directory</h2>
            {isLoadingUsers ? (
                <p>Loading directory...</p>
            ) : isUsersError ? (
                <p className="error-text">Failed to load directory.</p>
            ) : (
                <ul className="user-list">
                    {users?.map((user) => (
                        <li key={user.id}>
                            <div>
                                <strong>{user.name}</strong> ({user.role}) - {user.email}
                            </div>
                            <button
                                onClick={() => deleteUserMutation.mutate(user.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Global Delete Error Message */}
            {deleteUserMutation.isError && (
                <p className="error-text">Failed to delete user. The list has been restored.</p>
            )}
        </div>
    );
}