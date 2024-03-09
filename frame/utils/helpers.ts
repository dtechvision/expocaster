import { FrameButton, FrameButtonLink, FrameButtonMint } from './types';

export function isFrameButtonLink(frameButton: FrameButton): frameButton is FrameButtonLink {
  return frameButton.action === 'link';
}

export function isValidHttpUrl(url: string | null): boolean {
  if (!url) {
    return false;
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (err) {
    return false;
  }
  return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
}

export function isValidImageDataUrl(image: string | null | undefined): boolean {
  const validPrefixes = [
    'data:image/png;base64,',
    'data:image/jpg;base64,',
    'data:image/jpeg;base64,',
    'data:image/gif;base64,',
  ];
  return validPrefixes.some((prefix) => image?.startsWith(prefix));
}

export function isFrameButtonMint(frameButton: FrameButton): frameButton is FrameButtonMint {
  return frameButton.action === 'mint';
}

export function getByteLength(str: string): number {
  return Buffer.from(str).byteLength;
}
export function isValidVersion(version: string): boolean {
  if (version === 'vNext') {
    return true;
  }
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  return pattern.test(version);
}

export function validateTokenURL(caipUrl: string) {
  const eip155Regex = /^eip155:(\d+):(0x[a-fA-F0-9]{40})$/;
  const match = caipUrl.match(eip155Regex);
  if (!match) {
    throw new Error('Invalid token URL');
  }
  const [, chainId, address] = match;
  const namespace = 'eip155';
  return {
    namespace,
    chainId,
    address,
  };
}
