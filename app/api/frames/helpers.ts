export function setFrameServerUrl(host: string) {
  let FRAME_SERVER_URL = '';
  if (__DEV__) {
    FRAME_SERVER_URL = `http://${host}`;
  } else {
    FRAME_SERVER_URL = `https://${host}`;
  }
  return FRAME_SERVER_URL;
}
