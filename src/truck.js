export const TRUCK_SMS_MESSAGE = "Hey Roger! I scanned the QR code on your Vivint truck. I'd like to learn about the special options available when working directly with you.";
export const TRUCK_SMS_URL = `sms:14632813454?body=${encodeURIComponent(TRUCK_SMS_MESSAGE)}`;
export const TRUCK_TITLE = 'Found My Truck? Meet Roger Reed | Vivint Smart Home Expert';

export function isTruckPath(pathname) {
  return /^\/truck(?:\.html|\/(?:index\.html)?)?$/.test(pathname);
}
