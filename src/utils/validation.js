export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !!email && emailRegex.test(email);
}

export function isValidPincode(pincode) {
  if (!pincode) return false;
  const cleanPin = pincode.replace(/\s+/g, "");
  return /^\d{6}$/.test(cleanPin);
}

export function cleanPincode(pincode) {
  return pincode ? pincode.replace(/\D/g, "") : "";
}
