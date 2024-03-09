export type FrameVersion = 'vNext' | `${number}-${number}-${number}`;

export type ImageAspectRatio = '1.91:1' | '1:1';

export type Frame = {
  version: FrameVersion;
  postUrl: string;
  buttons?: FrameButtonsType;
  image: string;
  imageAspectRatio?: ImageAspectRatio;
  ogImage?: string;
  inputText?: string;
};

export const FrameMetaTags = {
  FC_FRAME: 'fc:frame',
  FC_IMAGE: 'fc:frame:image',
  FC_IMAGE_ASPECT_RATIO: 'fc:frame:image:aspect_ratio',
  FC_POST_URL: 'fc:frame:post_url',
  FC_INPUT_TEXT: 'fc:frame:input:text',
  FC_BUTTON: 'fc:frame:button',
  FC_BUTTON_1: 'fc:frame:button:1',
  FC_BUTTON_2: 'fc:frame:button:2',
  FC_BUTTON_3: 'fc:frame:button:3',
  FC_BUTTON_4: 'fc:frame:button:4',
  OG_IMAGE: 'og:image',
  OG_TITLE: 'og:title',
} as const;
export type ErrorKeys = (typeof FrameMetaTags)[keyof typeof FrameMetaTags];

export type ButtonActionType = 'post' | 'post_redirect' | 'link';

export type FrameButtonLink = {
  action: 'link';
  target: string;
  label: string;
};

export type FrameButtonMint = {
  action: 'mint';
  target: string;
  label: string;
};

export type FrameButtonPost = {
  action: 'post' | 'post_redirect';
  target?: string;
  label: string;
};
export type FrameButtonPostRedirect = FrameButtonPost;

export type FrameButton =
  | FrameButtonPost
  | FrameButtonLink
  | FrameButtonPostRedirect
  | FrameButtonMint;

export type ButtonActionIndex = 1 | 2 | 3 | 4;

export type FrameButtonsType =
  | []
  | [FrameButton]
  | [FrameButton, FrameButton]
  | [FrameButton, FrameButton, FrameButton]
  | [FrameButton, FrameButton, FrameButton, FrameButton];

export type FrameActionPayload = {
  trustedData: { messageBytes: string };
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: ButtonActionIndex;
    castId: {
      fid: number;
      hash: string;
    };
    inputText?: string;
  };
};
