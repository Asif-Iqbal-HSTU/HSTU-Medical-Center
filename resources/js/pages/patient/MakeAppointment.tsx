import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CalendarClock, Clock3 } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appointment',
        href: '/patient/appointment',
    },
];

export default function MakeAppointment() {
    const { doctors, auth, appointments, appointmentsOfPatient } = usePage<SharedData>().props;
    console.log(auth.user.id);
    const { data, setData, post, errors } = useForm({
        patient_id: auth.user.id,
        doctor_id: '',
        date: '',
        time: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('appointment.store'));
    };

    const generateTimeSlots = () => {
        const slots: { label: string; value: string }[] = [];
        const start = 9 * 60; // 9:00 AM
        const end = 17 * 60; // 5:00 PM

        for (let minutes = start; minutes < end; minutes += 30) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;

            const hour24 = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : m}`;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hour12 = `${h % 12 === 0 ? 12 : h % 12}:${m === 0 ? '00' : m} ${ampm}`;

            slots.push({
                label: hour12,
                value: hour24,
            });
        }

        return slots;
    };

    const formatTo24Hour = (time: string): string => {
        // "9:30 AM" -> "09:30:00"
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    };

    const isSlotBooked = (slot: string): boolean => {
        if (!data.date || !data.doctor_id) return false;

        const formattedTime = formatTo24Hour(slot);
        return appointments.some(
            (app: any) => app.date === data.date && app.doctor_id == data.doctor_id && app.time === formattedTime && app.status === 'pending', // optional: check for only pending ones
        );
    };

    useEffect(() => {
        setData('time', '');
    }, [data.doctor_id, data.date]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Make Appointment" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Make Your Appointment</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            From here you can make an appointment to the doctor anytime easily.
                        </p>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-visible rounded-xl border">
                        <form className="mx-auto space-y-6 p-8" onSubmit={handleSubmit}>
                            {/* Doctor Picker */}
                            <div>
                                <label htmlFor="doctor_id" className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Select Doctor
                                </label>
                                <div className="relative">
                                    <select
                                        id="doctor_id"
                                        name="doctor_id"
                                        value={data.doctor_id}
                                        onChange={(e) => setData('doctor_id', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-3 pl-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Choose a doctor</option>
                                        {doctors.map((doctor: any) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                Dr. {doctor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.doctor_id && <p className="mt-1 text-sm text-red-600">{errors.doctor_id}</p>}
                            </div>

                            {/* Date Picker */}
                            <div>
                                <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Select Date
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                        <CalendarClock className="h-5 w-5" />
                                    </span>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    />
                                </div>
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                            </div>

                            {/* Time Picker */}
                            <div>
                                <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Select Time
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                        <Clock3 className="h-5 w-5" />
                                    </span>
                                    <select
                                        id="time"
                                        name="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Choose a time</option>
                                        {generateTimeSlots().map((slot) => {
                                            const disabled = isSlotBooked(slot.value);
                                            return (
                                                <option
                                                    key={slot.value}
                                                    value={slot.value}
                                                    disabled={disabled}
                                                    className={disabled ? 'text-gray-400' : ''}
                                                >
                                                    {slot.label} {disabled ? '(Booked)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Placeholder Panel */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-visible rounded-xl">
                        <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Your Appointments</h3>
                            {/*Show appointments here in a table With Time date and doctor name*/}
                            {appointmentsOfPatient.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-300">
                                        <thead className="bg-gray-100 text-xs uppercase dark:bg-gray-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Time
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Doctor
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointmentsOfPatient.map((appointment) => (
                                                <tr
                                                    key={appointment.id}
                                                    className="border-b hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4">{appointment.date}</td>
                                                    <td className="px-6 py-4">{appointment.time}</td>
                                                    <td className="px-6 py-4">{appointment.doctor?.name || 'Unknown'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500 dark:text-gray-400">No appointments found.</p>
                            )}

                            <Link href={route('patient.appointments.list')}>
                                <button className="mt-5 w-full rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 focus:outline-none dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Manage Appointments
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
