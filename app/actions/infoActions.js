import { createPromiseAction } from '@adobe/redux-saga-promise';

export const PATIENT_DATA_LOADED = 'PATIENT_DATA_LOADED';
export const loadPatientDataAction = createPromiseAction('LOAD_PATIENT_DATA');

export const DOCTOR_DATA_LOADED = 'DOCTOR_DATA_LOADED';
export const loadDoctorDataAction = createPromiseAction('LOAD_DOCTOR_DATA');

export const PROFILE_UPDATED = 'PROFILE_UPDATED';
export const patientProfileEditAction = createPromiseAction(
  'PATIENT_PROFILE_EDIT',
);

export const doctorProfileEditAction = createPromiseAction(
  'DOCTOR_PROFILE_EDIT',
);
export const DOCTORS_FETCHED = 'DOCTORS_FETCHED';
export const fetchDoctorsAction = createPromiseAction('FETCH_DOCTORS');
