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
  return frameInput(request);
}

/**
 * POST Entry point is called after inital get. This is trigger as post action to respond with new Frame or post_redirect
 * @param request request sent, use to get URL params and body data
 * @returns a reponse to the frame input
 */
export async function POST(request: ExpoRequest) {
  FRAME_SERVER_URL = setFrameServerUrl(request.headers.get('host') ?? '');

  const body: FrameRequest = await request.json();
  // the same data exists in signed Data, signed commented out for localhost testing, use on warpcast test tool
  // ====
  // const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });
  // if (!isValid) {
  //   throw new Error('Invalid Frame message');
  // }
  // const text = message.input;
  // ===
  // simple example for untrusted data, use trusted data if authentication is needed
  const text = body.untrustedData?.inputText;
  // if no input field is present inputText will be empty
  return responseFrame(request, text);
}

export async function frameInput(req: ExpoRequest) {
  return new ExpoResponse(
    // build the frame
    getFrameHtmlResponse({
      ogTitle: 'Sample Input',
      ogDescription: 'This is a sample input frame',
      buttons: [
        {
          label: `Send Input`,
        },
      ],
      input: {
        text: 'Placeholder',
      },
      image: `${FRAME_SERVER_URL}/assets/examples/coderSquare.png`,
      postUrl: `${FRAME_SERVER_URL}api/frames/examples/sampleInput`,
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
