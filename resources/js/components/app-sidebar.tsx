import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, Head, usePage } from '@inertiajs/react';
import { BookOpen, CalendarPlus, Folder, LayoutGrid, ListIcon } from 'lucide-react';
import AppLogo from './app-logo';


import { type SharedData } from '@/types';

export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;

    // Default role as empty string, then assign if auth is present
    let role: unknown = '';

    if (auth && auth.user) {
        role = auth.user.role;
        console.log(role);
    }

    let mainNavItems: NavItem[];

    if(role == "doctor")
    {
        mainNavItems = [
            {
                title: 'Dashboard',
                href: '/dashboard/doctor',
                icon: LayoutGrid,
            },
            {
                title: 'Appointments',
                href: '/doctor/appointment/list',
                icon: ListIcon,
            },
        ];
    }

    else if(role == "patient")
    {
        mainNavItems = [
            {
                title: 'Dashboard',
                href: '/dashboard/patient',
                icon: LayoutGrid,
            },
            {
                title: 'Make Appointment',
                href: '/patient/appointment',
                icon: CalendarPlus,
            },
            {
                title: 'Your Appointments',
                href: '/patient/appointment/list',
                icon: ListIcon,
            },
        ];
    }


    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {role === "doctor" ? (
                                <Link href={route('doctorDashboard')} prefetch>
                                    <AppLogo />
                                </Link>
                            ) : role === "patient" ? (
                                <Link href={route('patientDashboard')} prefetch>
                                    <AppLogo />
                                </Link>
                            ):(
                                <></>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
