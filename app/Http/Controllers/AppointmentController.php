<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function create(): \Inertia\Response
    {
        $patient_id = Auth::id();
        $appointmentsOfPatient = Appointment::where('patient_id', $patient_id)
            ->with('doctor')
            ->get();
        $doctors = User::where('role', 'doctor')->get();
        $appointments = Appointment::all();
        return Inertia::render('patient/MakeAppointment',[
            'doctors' => $doctors,
            'appointments' => $appointments,
            'appointmentsOfPatient' => $appointmentsOfPatient,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'patient_id' => 'required',
            'doctor_id' => 'required',
            'date' => 'required|date|after:now',
            'time' => 'required',
        ]);

        $appointmentExists = Appointment::where('time', $request->time)
            ->where('date', $request->date)
            ->where('doctor_id', $request->doctor_id)
            ->exists();

        if ($appointmentExists) {
            return back()->withErrors(['time' => 'Slot already taken.']);
        }

        Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => 1, // only one doctor
            'time' => $request->time,
            'date' => $request->date,
        ]);

        return redirect()->route('patientDashboard')->with('success', 'Appointment booked.');
    }

    public function getAppointments(): \Inertia\Response
    {
        $patient_id = Auth::id();
        $appointments = Appointment::where('patient_id', $patient_id)
            ->with(['doctor', 'prescription'])
            ->get();
        return Inertia::render('patient/AppointmentList',[
            'appointments' => $appointments,
        ]);
    }

    public function destroy(Appointment $appointment)
    {
        //$this->authorize('delete', $appointment); // optional for extra security
        $appointment->delete();
        return back()->with('success', 'Appointment cancelled successfully.');
    }

    public function getDoctorAppointments(): \Inertia\Response
    {
        $doctor_id = Auth::id();
        $appointments = Appointment::where('doctor_id', $doctor_id)
            ->with('patient')
            ->get();
        return Inertia::render('doctor/AppointmentList',[
            'appointments' => $appointments,
        ]);
    }

    public function cancel(Appointment $appointment)
    {
        $appointment->update(['status' => 'cancelled']);
        return back()->with('message', 'Appointment cancelled successfully.');
    }



}
