import { View } from 'react-native';
import { load } from 'cheerio';
import React, { useState } from 'react';
import FrameContainer from '~/frame/FrameContainer';

type ExtractedMetaTag = {
  name: string | undefined;
  content: string | undefined;
};

export type FrameButtonProps = {
  index: number;
  label: string;
  action?: string;
  actionType?: string;
  onClick?: () => void;
};
export type FrameData = {
  version: string;
  postUrl: string;
  inputText?: string;
  image?: string;
  buttons?: Array<FrameButtonProps>;
};

const extractFrameData = (htmlString: string) => {
  const $ = load(htmlString);
  const extractedMetaTags: ExtractedMetaTag[] = [];
  $('meta').each((index: number, element) => {
    const name = $(element).attr('name') ?? $(element).attr('property');
    const content = $(element).attr('content');
    extractedMetaTags.push({ name, content });
  });
  console.log('extractedMetaTags', extractedMetaTags);

  let buttons: FrameButtonProps[] = [];
  let initialFrameData: FrameData = {
    version: '',
    postUrl: '',
    inputText: '',
    image: '',
    buttons: [],
  };
  const transformedData = extractedMetaTags.reduce((acc, tag) => {
    if (tag.name === 'fc:frame') {
      acc.version = tag.content ?? '';
    } else if (tag.name === 'fc:frame:post_url') {
      acc.postUrl = tag.content ?? '';
    } else if (tag.name && tag.name.startsWith('fc:frame:button:')) {
      const buttonIndex = parseInt(tag.name.split(':').pop()!, 10);
      buttons.push({ index: buttonIndex, label: tag.content ?? '' });
    } else if (tag.name === 'fc:frame:input:text') {
      acc.inputText = tag.content;
    } else if (tag.name === 'fc:frame:image' || tag.name === 'og:image') {
      acc.image = tag.content;
    }
    acc.buttons = buttons;
    return acc;
  }, initialFrameData);

  return transformedData;
};

const getFrame = async ({ url, controller }: { url: string; controller: AbortController }) => {
  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    const html = await response.text();
    const frameData = extractFrameData(html);
    return frameData;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default function RenderFrame({ frameUrl }: { frameUrl: string }) {
  const [frameData, setFrameData] = useState<FrameData | null>(null);
  
  React.useEffect(() => {
    const abortController = new AbortController();
    async function fetchData() {
      const frame = await getFrame({ url: frameUrl, controller: abortController });
      if (frame) {
        setFrameData(frame);
      }
    }
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [frameUrl]);

  const updateFrameData = async (resHtmlString: string) => {
    const frame = extractFrameData(resHtmlString);
    if (frame) {
      setFrameData(frame);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {frameData && <FrameContainer frameData={frameData} updateFrameData={updateFrameData} />}
    </View>
  );
}
