<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class OtpMail extends Mailable
{
    public function __construct(public string $code) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your TrabahoNow verification code');
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "<p>Your code is <b style='font-size:22px'>{$this->code}</b>.</p>
                <p>It expires in 10 minutes. If you didn't sign up, ignore this email.</p>",
            text: 'emails.otp-text',
        );
    }
}
