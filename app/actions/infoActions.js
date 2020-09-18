import { createPromiseAction } from '@adobe/redux-saga-promise';

export const PATIENT_DATA_LOADED = 'PATIENT_DATA_LOADED';
export const loadPatientDataAction = createPromiseAction('LOAD_PATIENT_DATA');

export const DOCTOR_DATA_LOADED = 'DOCTOR_DATA_LOADED';
export const loadDoctorDataAction = createPromiseAction('LOAD_DOCTOR_DATA');

export const fetchDoctorsAction = createPromiseAction('FETCH_DOCTORS');
