import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';

import { responseFrame } from './responseFrame';
import { setFrameServerUrl } from '../helpers';

/**
 * This is the inital Frame based on calling this Route!
 * @param request request sent, use to get URL params and body data
 * @returns
 */
export async function GET(request: ExpoRequest) {
  return frameTwoButton(request);
}

/**
 * POST Entry point is called after inital get. This is trigger as post action to respond with new Frame or post_redirect
 * @param request request sent, use to get URL params and body data
 * @returns a reponse to the frame input
 */
export async function POST(request: ExpoRequest) {
  // we are simply returning our fun little response frame here, but you could easily return any other frame or add logic
  // with the logic you could do anything you can imagine and build control flows for your frame
  // just make sure to respond within 5 seconds or the frame will timeout
  // if you need more time, you can use the post_redirect to send the user to a new frame and there continuing the "wait" until done
  // you can also send people to different frames all together that are not in here and compose with other Frames 
  // or use other Routes in this project to buildout one Typescript file per frame
  return responseFrame(request, 'four buttons');
}

async function frameTwoButton(req: ExpoRequest) {
  const FRAME_SERVER_URL = setFrameServerUrl(req.headers.get('host') ?? '');
  return new ExpoResponse(
    // build the frame
    getFrameHtmlResponse({
      ogTitle: 'Four Buttons',
      ogDescription: 'This is a frame with four buttons',
      buttons: [
        {
          label: `One Button`,
        },
        {
          label: `Two Buttons`,
        },
        {
          label: `Three Buttons`,
        },
        {
          label: `Four Buttons`,
        },
      ],
      image: {
        src: `${FRAME_SERVER_URL}/assets/examples/coderSquare.png`,
        aspectRatio: '1:1', //for rectangular images use 1.91:1
      },
      postUrl: `${FRAME_SERVER_URL}/api/frames/examples/frameFourButton`,
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
