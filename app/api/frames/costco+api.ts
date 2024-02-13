//import { getFrameAccountAddress } from '@coinbase/onchainkit';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';

const publicUrl = 'localhost:8081';
const postUrl = 'http://' + publicUrl + '/api/frames/' + 'costco'; // TODO: back to https

/**
 * POST -> is what is called on updating/interacting with the Farcaster frame
 * @param request the request sent from the farcaster client containing the interaction data
 * @returns the initial starting Frame of your Frame
 */
export function POST(request: ExpoRequest) {
  //insert your domain here! e.g. dtech.vision or warpcast.com
  // Create the post_url for Frame to send post request back to you on button press

  //define your Farcaster frame here
  const frameResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="og:image" content="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/https%3A%2F%2Fi.imgur.com%2FOHMozjv.jpg" />
        <meta property="fc:frame:button:1" content="You are a happy member!"/>
        <meta property="fc:frame:post_url" content="${postUrl}" />
      </head>
    </html>
  `;

  return new ExpoResponse(frameResponse, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

/**
 * GET -> initial Frame
 * @param request the request sent from the user/client with potential parameters
 * @returns the initial starting Frame of your Frame
 */

export function GET(request: ExpoRequest) {
  const frameResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/https%3A%2F%2Fi.imgur.com%2FOHMozjv.jpg" />
        <meta property="fc:frame:button:1" content="Enter Costco (Members only)!"/>
        <meta property="fc:frame:post_url" content="${postUrl}" />
      </head>
    </html>
  `;

  return new ExpoResponse(frameResponse, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
