<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code) {}

    public function build()
    {
        // This sends ONLY the code. No link!
        return $this->subject('Your TrabahoNow verification code')
            ->html("<p>Your code is <b style='font-size:22px'>{$this->code}</b>.</p>
                    <p>It expires in 10 minutes. If you didn't sign up, ignore this email.</p>");
    }
}
