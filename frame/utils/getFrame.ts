import { load, type Element } from 'cheerio';
import {
  ErrorKeys,
  Frame,
  FrameButton,
  FrameButtonsType,
  FrameMetaTags,
  FrameVersion,
  ImageAspectRatio,
} from './types';
import {
  getByteLength,
  isValidHttpUrl,
  isValidImageDataUrl,
  isValidVersion,
  validateTokenURL,
} from './helpers';

const BUTTONS = [1, 2, 3, 4];
export function getFrameParsedData({ htmlString, url }: { htmlString: string; url: string }): {
  frame: Frame | null;
  errors: null | Record<ErrorKeys[number], string[]>;
} {
  const $ = load(htmlString);
  
  function extractMetaContent(selector: string, defaultValue: string | null = null) {
    const content = $(selector).attr('content');
    return content || defaultValue;
  }
  function extractButtonData(suffix: string) {
    return BUTTONS.flatMap((el) =>
      $(
        `meta[property='fc:frame:button:${el}${suffix}'], meta[name='fc:frame:button:${el}${suffix}']`
      )
        .map((_, elem) => parseButtonElement(elem))
        .filter((_, elem) => elem !== null)
        .toArray()
    );
  }

  let validationErrors: null | Record<string, string[]> = null;

  function addValidationError({ key, message }: { key: string; message: string }) {
    if (!validationErrors) validationErrors = {};
    if (
      validationErrors.hasOwnProperty(key) &&
      validationErrors[key] &&
      Array.isArray(validationErrors[key])
    ) {
      validationErrors[key]!.push(message);
    } else {
      validationErrors[key] = [message];
    }
  }
  const frameVersion = extractMetaContent("meta[property='fc:frame'], meta[name='fc:frame']");
  const image = extractMetaContent("meta[property='fc:frame:image'], meta[name='fc:frame:image']");
  const ogimage = extractMetaContent("meta[property='og:image'], meta[name='og:image']");
  const imageAspectRatio = extractMetaContent(
    "meta[property='fc:frame:image:aspect_ratio'], meta[name='fc:frame:image:aspect_ratio']"
  );
  const postUrl = extractMetaContent(
    "meta[property='fc:frame:post_url'], meta[name='fc:frame:post_url']",
    url
  );
  const inputText = extractMetaContent(
    "meta[property='fc:frame:input:text'], meta[name='fc:frame:input:text']"
  );
  const buttonLabels = extractButtonData('');
  const buttonActions = extractButtonData(':action');
  const buttonTargets = extractButtonData(':target');

  let buttonsValidation = [false, false, false, false];
  const buttonsWithActions = buttonLabels
    .map((buttonLabel): FrameButton & { buttonIndex: number } => {
      const buttonAction = buttonActions.find(
        (action) => action?.buttonIndex === buttonLabel?.buttonIndex
      );
      const buttonTarget = buttonTargets.find(
        (action) => action?.buttonIndex === buttonLabel?.buttonIndex
      );
      if (buttonsValidation[buttonLabel.buttonIndex - 1]) {
        addValidationError({
          message: 'Duplicate button found',
          key: `fc:frame:button:${buttonLabel.buttonIndex}`,
        });
      }
      if (![1, 2, 3, 4].includes(buttonLabel.buttonIndex)) {
        addValidationError({
          message: 'Invalid button index found',
          key: `fc:frame:button:${buttonLabel.buttonIndex}`,
        });
      } else {
        buttonsValidation[buttonLabel.buttonIndex - 1] = true;
      }

      const action = buttonAction?.content !== undefined ? buttonAction?.content : 'post';
      if (action === 'link') {
        if (!buttonTarget?.content) {
          addValidationError({
            message: 'No button target, but required for action type link',
            key: `fc:frame:button:${buttonLabel.buttonIndex}`,
          });
        }
        if (!isValidHttpUrl(buttonTarget?.content as string)) {
          addValidationError({
            message: 'External links MUST use the https://  or http:// protocols. ',
            key: `fc:frame:button:${buttonLabel.buttonIndex}`,
          });
        }
      }

      if (!buttonTarget?.content && ['link', 'mint'].includes(action)) {
        addValidationError({
          message: `Button target is required for action type ${action}`,
          key: `fc:frame:button:${buttonLabel.buttonIndex}`,
        });
      }

      if (buttonTarget?.content && !buttonAction) {
        addValidationError({
          message: "Missing button action (should be 'mint' or 'link')",
          key: `fc:frame:button:${buttonLabel.buttonIndex}`,
        });
      }

      if (!['post_redirect', 'post', 'mint', 'link', undefined].includes(buttonAction?.content)) {
        addValidationError({
          message: 'Invalid button action specified',
          key: `fc:frame:button:${buttonLabel.buttonIndex}`,
        });
      }

      if (action === 'mint' && buttonTarget?.content) {
        try {
          validateTokenURL(buttonTarget.content);
        } catch (error) {
          addValidationError({
            message: 'Invalid CAIP-10 URL',
            key: `fc:frame:button:${buttonLabel.buttonIndex}`,
          });
        }
      }

      return {
        buttonIndex: buttonLabel.buttonIndex,
        label: buttonLabel.content || '',
        target: buttonTarget?.content,
        action: buttonAction?.content || 'post',
      } as FrameButton & { buttonIndex: number };
    })
    .sort((a, b) => a.buttonIndex - b.buttonIndex)
    .map((button): FrameButton => {
      if (button.action === 'link' || button.action === 'mint')
        return {
          label: button.label,
          action: button.action,
          target: button.target,
        };

      return {
        label: button.label,
        action: button.action,
        target: button.target,
      };
    });

  if (buttonsValidation.some((x, i) => !x && i < 3 && buttonsValidation[i + 1])) {
    addValidationError({
      message: `Gap in buttons sequence, ${buttonsValidation.map((el, i) => `${el ? i + 1 : ''}`).join(',')}`,
      key: `fc:frame:button:1`,
    });
  }

  if (!frameVersion) {
    addValidationError({ message: 'No frameVersion found in frame', key: 'fc:frame' });
  } else if (!isValidVersion(frameVersion))
    addValidationError({
      message: 'Invalid frameVersion',
      key: FrameMetaTags.FC_FRAME,
    });
  if (!image && !ogimage) {
    addValidationError({
      message: 'No frame image or og image found in frame',
      key: 'fc:frame:image',
    });
  } else if (!isValidHttpUrl(image!)) {
    if (isValidImageDataUrl(image)) {
      addValidationError({
        message: 'Unsupported image format found',
        key: FrameMetaTags.FC_IMAGE,
      });
    }
  }

  if (imageAspectRatio && imageAspectRatio !== '1.91:1' && imageAspectRatio !== '1:1') {
    addValidationError({
      message: 'Invalid image aspect ratio',
      key: FrameMetaTags.FC_IMAGE_ASPECT_RATIO,
    });
  }

  if (!postUrl) {
    addValidationError({
      message: 'No post_url in frame',
      key: FrameMetaTags.FC_POST_URL,
    });
  }
  if (getByteLength(postUrl!) > 256) {
    addValidationError({
      message: 'post_url is more than 256 bytes',
      key: FrameMetaTags.FC_POST_URL,
    });
  }
  if (buttonsWithActions.length > 4)
    addValidationError({ message: 'Too many buttons', key: 'fc:frame:button' });
  if (inputText && getByteLength(inputText) > 32) {
    addValidationError({
      message: 'Input text should be max 32 bytes',
      key: FrameMetaTags.FC_INPUT_TEXT,
    });
  }
  if (!isValidHttpUrl(postUrl)) {
    addValidationError({
      message: 'Post URL must be a valid URL',
      key: FrameMetaTags.FC_POST_URL,
    });
  }
  return {
    frame: {
      version: frameVersion as FrameVersion,
      image: image!,
      imageAspectRatio: imageAspectRatio as ImageAspectRatio,
      buttons: buttonsWithActions as FrameButtonsType,
      postUrl: postUrl!,
      inputText: inputText || undefined,
    },
    errors: validationErrors,
  };
}

export function parseButtonElement(elem: Element) {
  const nameAttr = elem.attribs['name'] || elem.attribs['property'];
  const buttonIndex = nameAttr?.split(':')[3];
  try {
    return {
      buttonIndex: parseInt(buttonIndex || ''),
      content: elem.attribs['content'],
    };
  } catch (error) {
    return null;
  }
}
