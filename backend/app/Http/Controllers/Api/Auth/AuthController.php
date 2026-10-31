<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{
    // In AuthController.php

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in([UserRole::Client->value, UserRole::Jobseeker->value])],
        ]);

        $user = User::create($data);

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful. Please verify your email.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'is_verified' => (bool) $user->is_verified,  
                'verification_status' => $user->verification_status ?? 'none',  
            ],
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
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'is_verified' => (bool) $user->is_verified, // 👈 ADDED
                'verification_status' => $user->verification_status ?? 'none',  
            ],
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

        $dailyKey = "otp_daily:{$user->id}";
        if (Cache::get($dailyKey, 0) >= 10) {
            return response()->json(['message' => 'Too many codes requested today. Try again tomorrow.'], 429);
        }
        Cache::put($dailyKey, Cache::get($dailyKey, 0) + 1, now()->endOfDay());

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put("otp:{$user->id}", Hash::make($code), now()->addMinutes(10));
        Cache::forget("otp_attempts:{$user->id}");
        try {
            $this->sendMail(
                $user->email,
                $user->name,
                'Your TrabahoNow verification code',
                view('email.verify-otp', ['code' => $code])->render(),
                "Your TrabahoNow verification code is {$code}. It expires in 10 minutes. If you didn't sign up, ignore this email."
            );
        } catch (\Throwable $e) {
            Log::error('OTP mail failed', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);
            Cache::forget("otp:{$user->id}");

            return response()->json([
                'message' => 'We could not send the code right now. Please try again.',
            ], 503);
        }

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

        if (! $hash || ! Hash::check($request->code, $hash)) {
            Cache::put($attemptsKey, Cache::get($attemptsKey, 0) + 1, now()->addMinutes(10));
            return response()->json(['message' => 'Invalid or expired code.'], 422);
        }

        Cache::forget("otp:{$user->id}");
        Cache::forget($attemptsKey);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return response()->json(['user' => $user->fresh()]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        try {
            Password::sendResetLink(
                $request->only('email'),
                function ($user, $token) {
                    $url = rtrim(config('app.frontend_url'), '/')
                        . '/reset-password?token=' . urlencode($token)
                        . '&email=' . urlencode($user->email);
                    $safeUrl = htmlspecialchars($url, ENT_QUOTES);

                    $this->sendMail(
                        $user->email,
                        $user->name,
                        'Reset your TrabahoNow password',
                        "<p>We received a request to reset your password.</p>"
                            . "<p><a href=\"{$safeUrl}\">Reset password</a></p>"
                            . "<p>This link expires in 60 minutes. If you didn't ask for this, ignore this email.</p>",
                        "Reset your TrabahoNow password: {$url}\nThis link expires in 60 minutes. If you didn't ask for this, ignore this email."
                    );
                }
            );
        } catch (\Throwable $e) {
            Log::error('Reset mail failed', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'message' => 'If that email is registered, we’ve sent a password reset link. Please check your inbox.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)])
                    ->setRememberToken(Str::random(60));
                $user->save();
                $user->tokens()->delete();
                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json(['message' => 'This reset link is invalid or has expired.'], 422);
        }

        return response()->json(['message' => 'Password updated. You can now log in.']);
    }

    private function sendMail(string $toEmail, ?string $toName, string $subject, string $html, string $text): void
    {
        $res = Http::timeout(20)
            ->asJson()
            ->post(config('services.mail_relay.url'), [
                'secret'  => config('services.mail_relay.secret'),
                'to'      => $toEmail,
                'subject' => $subject,
                'html'    => $html,
                'text'    => $text,
            ]);

        $res->throw();

        if (! $res->json('ok')) {
            throw new \RuntimeException('Mail relay rejected: ' . $res->body());
        }
    }
}
