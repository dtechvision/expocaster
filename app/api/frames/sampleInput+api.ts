import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';

/**
 * This is the inital Frame based on calling this Route!
 * @param request request sent, use to get URL params and body data
 * @returns
 */
export async function GET(request: ExpoRequest) {
  return inputFrame(request);
}

/**
 * POST Entry point is called after inital get. This is trigger as post action to respond with new Frame or post_redirect
 * @param request request sent, use to get URL params and body data
 * @returns a reponse to the frame input
 */
export async function POST(request: ExpoRequest) {
  console.log('got POST request');
  return responseFrame(request);
}

export async function inputFrame(req: ExpoRequest) {
  return new ExpoResponse(
    // build the frame
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Send Input`,
        },
      ],
      input: {
        text: 'Placeholder',
      },
      image: 'https://build-onchain-apps.vercel.app/release/v-0-17.png',
      postUrl: 'https://build-onchain-apps.vercel.app/api/frame',
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

export async function responseFrame(req: ExpoRequest) {
  const body: FrameRequest = await req.json();
  // the same data exists in signed Data, signed commented out for localhost testing, use on warpcast test tool
  // ====
  // const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });
  // if (!isValid) {
  //   throw new Error('Invalid Frame message');
  // }
  // const text = message.input;
  // ===
  // simple example for untrusted data, use trusted data if authentication is needed
  const text = body.untrustedData.inputText;
  return new ExpoResponse(
    // build the frame
    getFrameHtmlResponse({
      buttons: [
        {
          label: `You typed: ${text}`,
        },
      ],
      image: 'https://build-onchain-apps.vercel.app/release/v-0-17.png',
      postUrl: 'https://build-onchain-apps.vercel.app/api/frame',
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
