<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Verify your email</title>
</head>

<body
    style="margin:0; padding:0; background-color:#F4F5F7; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">


    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
        Your TrabahoNow verification code is {{ $code }}. It expires in 1 minute.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#F4F5F7;">
        <tr>
            <td align="center" style="padding:32px 16px;">

                <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0"
                    style="width:100%; max-width:480px;">

                    {{-- Brand --}}
                    <tr>
                        <td align="center" style="padding-bottom:20px; font-size:22px; font-weight:700; color:#1E293B;">
                            Trabaho<span style="color:#FF6B00;">Now</span>
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td style="background-color:#FFFFFF; border-radius:16px; padding:40px 32px; text-align:center;">

                            <h1
                                style="margin:0 0 8px; font-size:24px; line-height:32px; font-weight:700; color:#1E293B;">
                                Verify your email
                            </h1>
                            <p style="margin:0 0 28px; font-size:14px; line-height:22px; color:#64748B;">
                                Enter this code in TrabahoNow to verify your email and complete your registration.
                            </p>

                            {{-- Code boxes (mirror the OTP inputs on the verify page) --}}
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
                                style="margin:0 auto 28px;">
                                <tr>
                                    @foreach (str_split((string) $code) as $digit)
                                        <td align="center" width="44" height="56"
                                            style="width:44px; height:56px; background-color:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; font-size:26px; font-weight:700; color:#1E293B;">
                                            {{ $digit }}
                                        </td>
                                        @if (!$loop->last)
                                            <td width="8" style="width:8px; font-size:0; line-height:0;">&nbsp;
                                            </td>
                                        @endif
                                    @endforeach
                                </tr>
                            </table>

                            <p style="margin:0; font-size:14px; line-height:22px; color:#1E293B;">
                                This code expires in <strong>10 minutes</strong>.
                            </p>

                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td align="center"
                            style="padding:24px 16px 0; font-size:12px; line-height:20px; color:#94A3B8;">
                            Didn't sign up for TrabahoNow? You can safely ignore this email.<br>
                            Never share this code with anyone. We will never ask you for it.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
