import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0F0F14]">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
