<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrescriptionController extends Controller
{
    public function create($appointmentId)
    {
        $appointment = Appointment::with('patient')->findOrFail($appointmentId);

        return Inertia::render('doctor/CreatePrescription', [
            'appointment' => $appointment,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'content' => 'required|string',
        ]);

        Prescription::create([
            'appointment_id' => $request->appointment_id,
            'content' => $request->content,
        ]);

        return redirect()->route('doctorDashboard')->with('success', 'Prescription created.');
    }
}
