'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Providers } from './Providers';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const url = ['/login', '/unauthorized']
    const showSidebar = url.includes(pathname) === false;

    return (
        <SidebarProvider>
            {showSidebar && <AppSidebar />}
            <main className="flex-1">
                {showSidebar && <SidebarTrigger />}
                <div>
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
