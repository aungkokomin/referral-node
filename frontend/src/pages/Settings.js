import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Settings() {
    // No auth data required here; route is already protected by ProtectedRoute
    // const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const [editing, setEditing] = useState(null); // { id, name, value }
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', value: '' });

    const fetchSettings = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const data = await api.getCommissionSettings();
            // Expecting an array of settings
            setSettings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load commission settings', err);
            setError('Failed to load commission settings');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const startEdit = (s) => {
        setEditing({ id: s.id, name: s.name || '', value: s.value ?? '' });
    };

    const cancelEdit = () => setEditing(null);

    const saveEdit = async () => {
        if (!editing) return;
        try {
            await api.updateCommissionSetting(editing.id, { name: editing.name, value: editing.value });
            setSettings(prev => prev.map(s => s.id === editing.id ? { ...s, name: editing.name, value: editing.value } : s));
            setEditing(null);
        } catch (err) {
            console.error('Update failed', err);
            setError('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this commission setting?')) return;
        try {
            await api.deleteCommissionSetting(id);
            setSettings(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Delete failed', err);
            setError('Delete failed');
        }
    };

    const startCreate = () => {
        setForm({ name: '', value: '' });
        setCreating(true);
    };

    const cancelCreate = () => setCreating(false);

    const saveCreate = async () => {
        if (!form.name) return setError('Name is required');
        try {
            const created = await api.createCommissionSetting({ name: form.name, value: form.value });
            setSettings(prev => [created, ...prev]);
            setCreating(false);
            setForm({ name: '', value: '' });
        } catch (err) {
            console.error('Create failed', err);
            setError('Create failed');
        }
    };

    if (loadingData) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Commission Settings</h2>
                <div>
                    <button onClick={startCreate} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200 text-gray-700 font-bold">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {creating && (
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border rounded" placeholder="Name" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input value={form.value} onChange={e => setForm(prev => ({ ...prev, value: e.target.value }))} className="w-full px-3 py-2 border rounded" placeholder="Value" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button onClick={saveCreate} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Save</button>
                                    <button onClick={cancelCreate} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
                                </td>
                            </tr>
                        )}

                        {settings.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No commission settings found</td>
                            </tr>
                        ) : (
                            settings.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {editing?.id === s.id ? (
                                            <input value={editing.name} onChange={e => setEditing(prev => ({ ...prev, name: e.target.value }))} className="w-full px-2 py-1 border rounded" />
                                        ) : (
                                            s.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {editing?.id === s.id ? (
                                            <input value={editing.value} onChange={e => setEditing(prev => ({ ...prev, value: e.target.value }))} className="w-full px-2 py-1 border rounded" />
                                        ) : (
                                            s.value
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editing?.id === s.id ? (
                                            <>
                                                <button onClick={saveEdit} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Save</button>
                                                <button onClick={cancelEdit} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Settings;
