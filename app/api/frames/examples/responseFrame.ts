import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';

import { setFrameServerUrl } from '../helpers';


export async function responseFrame(req: ExpoRequest, text: string = '') {
  const FRAME_SERVER_URL = setFrameServerUrl(req.headers.get('host') ?? '');
  return new ExpoResponse(
    // build the frame
    getFrameHtmlResponse({
      ogTitle: 'Your interaction worked!',
      ogDescription: 'This is a generic frame shown as response from Expocaster.',
      buttons: [
        {
          label: `Your interaction worked! ${text}`,
        },
      ],
      image: `${FRAME_SERVER_URL}/assets/examples/coderSquare.png`,
      postUrl: `${FRAME_SERVER_URL}/api/frames/examples/responseFrame`,
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

