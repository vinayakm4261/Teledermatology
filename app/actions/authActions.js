export const OTP_CONFIRM = 'OTP_CONFIRM';
export const AUTH_COMPLETE = 'AUTH_COMPLETE';
export const AUTH_FAIL = 'AUTH_FAIL';

export const otpConfirm = (phone, uid, resolve, reject) => ({
  type: OTP_CONFIRM,
  phone,
  uid,
  resolve,
  reject,
});
