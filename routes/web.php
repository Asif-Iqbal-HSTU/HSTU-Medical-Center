<?php

use App\Http\Controllers\DashboardController;
use App\Http\Middleware\DoctorMiddleware;
use App\Http\Middleware\PatientMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PrescriptionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

/*Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});*/

Route::get('/dashboard/doctor', [DashboardController::class, 'gotoDoctorDashboard'])
    ->middleware(['auth', 'verified'])->name('doctorDashboard')->middleware(DoctorMiddleware::class);

Route::get('/dashboard/patient', [DashboardController::class, 'gotoPatientDashboard'])
    ->middleware(['auth', 'verified'])->name('patientDashboard')->middleware(PatientMiddleware::class);

Route::middleware(['auth', 'verified'])->group(function () {
    // Patient
    //Route::get('/patient/dashboard', [AppointmentController::class, 'myAppointments'])->name('patientDashboard');
    Route::get('/patient/appointment', [AppointmentController::class, 'create'])->name('appointment.create');
    Route::post('/patient/appointment', [AppointmentController::class, 'store'])->name('appointment.store');
    Route::get('/patient/appointment/list', [AppointmentController::class, 'getAppointments'])->name('patient.appointments.list');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy'])->middleware('auth');

    // Doctor
    //Route::get('/doctor/dashboard', [AppointmentController::class, 'index'])->name('doctorDashboard');
    Route::get('/doctor/prescription/create/{appointmentId}', [PrescriptionController::class, 'create'])->name('prescription.create');
    Route::post('/doctor/prescription', [PrescriptionController::class, 'store'])->name('prescription.store');
    Route::get('/doctor/appointment/list', [AppointmentController::class, 'getDoctorAppointments'])->name('doctor.appointments.list');
    Route::put('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::get('/doctor/appointments/{appointment}/prescribe', [PrescriptionController::class, 'create']);

    

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
