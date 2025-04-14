<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function gotoDoctorDashboard():Response
    {
        $user = Auth::User();
        $appointments = Appointment::with('patient')
            ->where('doctor_id', Auth::id())
            ->orderBy('time', 'asc')
            ->get();
        return Inertia::render('dashboards/Doctor', [
            'user' => $user,
            'appointments' => $appointments,
        ]);
    }

    public function gotoPatientDashboard():Response
    {
        $user = Auth::User();

        return Inertia::render('dashboards/Patient', [
            'user' => $user,
        ]);
    }
}
