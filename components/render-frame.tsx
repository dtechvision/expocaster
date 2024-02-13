import { View } from 'react-native';
import React, { useState } from 'react';
import FrameContainer from '~/frame/FrameContainer';
import { getFrameParsedData } from '~/frame/utils/getFrame';
import { Frame } from '~/frame/utils/types';

export const getFrame = async ({
  url,
  controller,
}: {
  url: string;
  controller: AbortController;
}) => {
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'force-cache',
    });
    const html = await response.text();
    const frameData = getFrameParsedData({ htmlString: html, url: url });
    return frameData;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default function RenderFrame({ frameUrl }: { frameUrl: string }) {
  const [frameData, setFrameData] = useState<Frame | null>(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    async function fetchData() {
      const frame = await getFrame({ url: frameUrl, controller: abortController });
      if (frame) {
        setFrameData(frame.frame);
      }
    }
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [frameUrl]);

  const updateFrameData = async (resHtmlString: string) => {
    const frame = getFrameParsedData({ htmlString: resHtmlString, url: frameUrl });
    if (frame) {
      setFrameData(frame.frame);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {frameData && (
        <FrameContainer
          frameUrl={frameUrl}
          frameData={frameData}
          updateFrameData={updateFrameData}
        />
      )}
    </View>
  );
}
