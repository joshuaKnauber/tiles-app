import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

export const send_notification = async (title, body) => {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    sendNotification({ title, body });
  }
}