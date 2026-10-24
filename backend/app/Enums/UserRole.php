<?php

namespace App\Enums;

enum UserRole: string{
    case Client = 'client';
    case Jobseeker = 'jobseeker';
    case Admin = 'admin';
}
