import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';

import { responseFrame } from './responseFrame';
import { setFrameServerUrl } from '../helpers';

let FRAME_SERVER_URL = '';

/**
 * This is the inital Frame based on calling this Route!
 * @param request request sent, use to get URL params and body data
 * @returns
 */
export async function GET(request: ExpoRequest) {
  FRAME_SERVER_URL = setFrameServerUrl(request.headers.get('host') ?? '');
  return frameRedirect(request);
}

/**
 * POST Entry point is called after inital get. This is trigger as post action to respond with new Frame or post_redirect
 * @param request request sent, use to get URL params and body data
 * @returns a reponse to the frame input
 */
export async function POST(request: ExpoRequest) {
  FRAME_SERVER_URL = setFrameServerUrl(request.headers.get('host') ?? '');
  return responseFrame(request, 'redirect');
}

export async function frameRedirect(req: ExpoRequest) {
  const redirectUrl = 'https://dtech.vision/';
  // you can also do custom logic here to infer redirectUrl from Frame Message or other data

  return new ExpoResponse(
    // build the frame
    getFrameHtmlResponse({
      ogTitle: 'Sample Redirect',
      ogDescription: 'This is a sample redirect frame',
      buttons: [
        {
          label: `Click to be redirected`,
          action: 'link',
          target: redirectUrl, // on click user is redirect to content of redirectUrl
        },
      ],
      image: {
        src: `${FRAME_SERVER_URL}/assets/examples/coderSquare.png`,
        aspectRatio: '1:1', //for rectangular images use 1.91:1
      },
      postUrl: `${FRAME_SERVER_URL}/api/frames/examples/frameRedirect`,
    }),
    // build response details
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
