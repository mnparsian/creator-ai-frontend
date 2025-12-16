import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Save, AlertTriangle } from 'lucide-react';
import httpClient from '../lib/httpClient';
import { logError } from '../lib/logger';

interface SystemSettings {
    id: string;
    siteName: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    defaultPlan: 'FREE' | 'PRO';
}

export default function Settings() {
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await httpClient<SystemSettings>('/admin/settings');
            setSettings(data);
        } catch (error) {
            logError('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        setMessage(null);
        try {
            // Exclude ID from payload to match Backend DTO
            const { id, ...payload } = settings;
            const updated = await httpClient<SystemSettings>('/admin/settings', {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
            setSettings(updated);
            setMessage({ type: 'success', text: 'Settings saved successfully' });
        } catch (error) {
            logError('Failed to save settings', error);
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;
    if (!settings) return <div>Failed to load settings</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'error' && <AlertTriangle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="grid gap-6">
                <Card title="General Configuration" description="Manage global application settings">
                    <div className="space-y-6">
                        {/* Site Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                                <p className="text-sm text-gray-500">Disable access for non-admin users</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Allow Registrations</h4>
                                <p className="text-sm text-gray-500">Allow new users to sign up</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.allowRegistrations}
                                    onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Default Plan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Default User Plan
                            </label>
                            <select
                                value={settings.defaultPlan}
                                onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value as 'FREE' | 'PRO' })}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2"
                            >
                                <option value="FREE">Free Tier</option>
                                <option value="PRO">Pro Tier</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
