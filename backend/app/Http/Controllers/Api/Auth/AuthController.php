<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Models\User;
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Google\Client as GoogleClient;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in([UserRole::Client->value, UserRole::Jobseeker->value])],
        ]);

        $user = User::create($data);

        // NO EMAIL LINK SENT HERE

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful. Please verify your email.',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

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

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $user,
        ]);
    }

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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function sendOtp(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Already verified.']);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put("otp:{$user->id}", Hash::make($code), now()->addMinutes(10));
        Cache::forget("otp_attempts:{$user->id}");

        // THIS IS THE ONLY LINE THAT SHOULD SEND AN EMAIL
        Mail::to($user->email)->send(new OtpMail($code));

        return response()->json(['message' => 'Verification code sent.']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate(['code' => 'required|digits:6']);

        $user = $request->user();
        $attemptsKey = "otp_attempts:{$user->id}";

        if (Cache::get($attemptsKey, 0) >= 5) {
            return response()->json(['message' => 'Too many attempts. Request a new code.'], 429);
        }

        $hash = Cache::get("otp:{$user->id}");

        if (!$hash || !Hash::check($request->code, $hash)) {
            Cache::put($attemptsKey, Cache::get($attemptsKey, 0) + 1, now()->addMinutes(10));
            return response()->json(['message' => 'Invalid or expired code.'], 422);
        }

        Cache::forget("otp:{$user->id}");
        Cache::forget($attemptsKey);

        $user->forceFill([
            'email_verified_at' => now(),
            'is_verified' => true,
        ])->save();

        return response()->json(['user' => $user->fresh()]);
    }
}
