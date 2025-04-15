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
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'diagnosis' => 'required|string',
            'tests' => 'nullable|string',
            'medicines' => 'nullable|string',
            'next_visit' => 'nullable|string',
        ]);

        Prescription::create($validated);

        $appt = Appointment::where('id', $validated['appointment_id'])->firstOrFail();
        $appt->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Prescription created successfully.');
    }
}
