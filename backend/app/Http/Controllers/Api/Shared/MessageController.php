<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, ServiceRequest $serviceRequest)
    {
        $this->authorizeParty($request->user(), $serviceRequest);
        return $serviceRequest->messages()->with('sender:id,name')->get();
    }

    public function store(Request $request, ServiceRequest $serviceRequest)
    {
        $this->authorizeParty($request->user(), $serviceRequest);

        if (! $serviceRequest->isOpen() && $serviceRequest->status !== 'completed') {
            abort(422, 'This conversation is closed.');
        }

        $validated = $request->validate(['body' => 'required|string|max:2000']);

        $message = $serviceRequest->messages()->create([
            'sender_id' => $request->user()->id,
            'body'      => $validated['body'],
        ]);

        return response()->json($message->load('sender:id,name'), 201);
    }

    private function authorizeParty($user, ServiceRequest $sr): void
    {
        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;

        if ($user->id !== $sr->client_id && $user->id !== $sr->jobseeker_id && $role !== 'admin') {
            abort(403, 'You are not authorized to view this chat.');
        }
    }
}
