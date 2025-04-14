<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required',
            'gender' => 'required|string',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'age' => $request->age,
            'gender' => $request->gender,
            'role' => 'patient',
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

//        return to_route('dashboard');

        $user = Auth::User();

        if ($user->role === "doctor") {
            return redirect()->intended(route('doctorDashboard', absolute: false));
        }
        if ($user->role === "patient") {
            return redirect()->intended(route('patientDashboard', absolute: false));
        }

        //return redirect()->intended(route('dashboard', absolute: false));
        return redirect()->back();
    }
}
