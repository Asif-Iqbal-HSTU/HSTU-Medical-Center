import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Dialog } from '@headlessui/react'; // or use your own modal component
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Your Appointments', href: '/patient/appointment/list' },
];

export default function AppointmentList() {
    const { appointments, flash } = usePage<SharedData>().props;
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const confirmCancel = (id: number) => {
        setSelectedId(id);
        setShowConfirmModal(true);
    };

    const handleDelete = () => {
        if (selectedId === null) return;
        router.delete(`/appointments/${selectedId}`, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setShowSuccessModal(true);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Your Appointments" />
            <div className="flex flex-col gap-4 p-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Your Appointments</h5>
                    <p className="text-gray-700 dark:text-gray-400">
                        Access and manage your appointments from here easily.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Time</th>
                            <th className="px-6 py-3 text-left">Doctor</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((appt: any) => (
                            <tr key={appt.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">{appt.date}</td>
                                <td className="px-6 py-4">{appt.time}</td>
                                <td className="px-6 py-4">{appt.doctor?.name}</td>
                                <td className="px-6 py-4 capitalize">{appt.status}</td>
                                <td className="px-6 py-4">
                                    {appt.status === 'pending' && (
                                        <button
                                            onClick={() => confirmCancel(appt.id)}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                        >
                                            <Trash2 size={16} />
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Confirm Modal */}
                {showConfirmModal && (
                    <Dialog open={showConfirmModal} onClose={() => setShowConfirmModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full">
                                <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    Cancel Appointment?
                                </Dialog.Title>
                                <Dialog.Description className="mt-2 text-gray-600 dark:text-gray-300">
                                    Are you sure you want to cancel this appointment? This action cannot be undone.
                                </Dialog.Description>
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Close</Button>
                                    <Button variant="destructive" onClick={handleDelete}>Yes, Cancel</Button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full">
                                <Dialog.Title className="text-lg font-bold text-green-600">
                                    Appointment Cancelled
                                </Dialog.Title>
                                <Dialog.Description className="mt-2 text-gray-600 dark:text-gray-300">
                                    The appointment has been successfully cancelled.
                                </Dialog.Description>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={() => setShowSuccessModal(false)}>OK</Button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </div>
        </AppLayout>
    );
}
