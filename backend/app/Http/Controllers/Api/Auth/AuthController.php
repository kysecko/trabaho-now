<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Google\Client as GoogleClient;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // register auth
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in([UserRole::Client->value, UserRole::Jobseeker->value])],
        ]);

        $user = User::create($data);

        // Trigger the email verification email (No need to override URL)
        event(new Registered($user));

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => $user,
        ], 201);
    }

    // login auth
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        // if (! $user->hasVerifiedEmail()) {
        //     throw ValidationException::withMessages([
        //         'email' => ['You must verify your email before logging in.'],
        //     ]);
        // }

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $user,
        ]);
    }

    // google auth
    public function googleLogin(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
            'role' => ['required', Rule::in([UserRole::Client->value, UserRole::Jobseeker->value])],
        ]);

        $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);

        try {
            $payload = $client->verifyIdToken($request->id_token);
            if (!$payload) {
                return response()->json(['message' => 'Invalid Google token'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Google verification failed'], 401);
        }

        $email = $payload['email'];

        $user = User::create([
            'name' => $payload['name'] ?? explode('@', $email)[0],
            'email' => $email,
            'password' => Hash::make(Str::random(24)),
            'role' => $request->role,
            'email_verified_at' => now(),
            'is_verified' => true,
        ]);

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $user,
        ]);
    }

    // logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
