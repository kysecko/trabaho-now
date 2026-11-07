import { PhotoIcon, UserCircleIcon, HomeIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

// for client
export const CLIENT_DOCS = [
  { name: 'govId', label: 'Government ID', hint: 'Upload a clear photo of a valid ID', Icon: PhotoIcon },
  { name: 'selfie', label: 'Selfie with ID', hint: 'Hold your ID next to your face', Icon: UserCircleIcon },
  { name: 'residency', label: 'Proof of Residency', hint: 'Utility bill or barangay certificate', Icon: HomeIcon },
];

// for jobseeker
export const JOBSEEKER_DOCS = [
  { name: 'govId', label: 'Government ID', hint: 'Upload a clear photo of a valid ID', Icon: PhotoIcon },
  { name: 'selfie', label: 'Selfie with ID', hint: 'Hold your ID next to your face', Icon: UserCircleIcon },
  { name: 'residency', label: 'Proof of Residency', hint: 'Utility bill or barangay certificate', Icon: HomeIcon },
  { name: 'nbi', label: 'NBI / Police Clearance', hint: 'Upload a valid, recent clearance', Icon: DocumentCheckIcon },
];