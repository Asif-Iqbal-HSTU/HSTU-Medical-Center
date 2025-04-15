import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Prescribing', href: '/dashboard' },
];

type FlashMessages = {
    success?: string;
    error?: string;
};

export default function CreatePrescription() {
    const { appointment, flash = {} as FlashMessages } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        diagnosis: '',
        tests: '',
        medicines: '',
        next_visit: '',
        appointment_id: appointment.id,
    });

    const [modalMessage, setModalMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash.success || flash.error) {
            setModalMessage(flash.success || flash.error || null);
            if (flash.success) reset(); // Only reset if success
        }
    }, [flash]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/doctor/prescription');
    };

    const closeModal = () => setModalMessage(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Prescription" />

            {/* Modal */}
            {modalMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Message</h2>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 space-y-6">
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        Patient Name: {appointment.patient.name}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-400">
                        Age: {appointment.patient.age} &nbsp;&nbsp; Gender: {appointment.patient.gender}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {['diagnosis', 'tests', 'medicines', 'next_visit'].map((field) => (
                        <div key={field}>
                            <label className="block mb-2 font-medium text-gray-700 capitalize dark:text-white">
                                {field.replace('_', ' ')}
                            </label>
                            <textarea
                                name={field}
                                value={data[field]}
                                onChange={handleChange}
                                className="w-full min-h-[120px] rounded-md border p-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            />
                            {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        {processing ? 'Submitting...' : 'Submit Prescription'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
