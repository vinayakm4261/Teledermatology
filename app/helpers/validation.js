const patterns = {
  phoneNumber: /^\+(\d\s?){12}$/g,
  otp: /^(\d){6}$/g,
};

const validate = (what, value) => value && !!value.match(patterns[what]);

const phoneNumberValidation = (value) =>
  validate('phoneNumber', value) ? undefined : 'Invalid phone number';

const otpValidation = (value) =>
  validate('otp', value) ? undefined : 'Invalid OTP';

export default validate;
export { phoneNumberValidation, otpValidation };
