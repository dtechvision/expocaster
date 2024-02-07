import { FrameContainer, FrameImage, FrameButton, FrameInput, PreviousFrame, createPreviousFrame } from 'frames.js/src/next/server';
import { getFrame } from 'frames.js/src/getFrame';
import { Frame } from 'frames.js/src/types';
import { Text, View } from 'react-native';

export default function RenderFrame({ frameUrl }: { frameUrl: string }) {
  let frame = getFrame({ htmlString: 'tes', url: frameUrl });
  return (
    <View>
      <Text>Will render a frame here!</Text>
      <FrameContainer
        postUrl="/api/frames/costco"
        state={{ string: 'test' }}
        previousFrame={ createPreviousFrame("", "")}>
        <FrameImage src="" />
        <FrameInput text="FrameInput sample text" />
        <FrameButton href={`https://dtech.vision`}>External</FrameButton>
      </FrameContainer>
    </View>
  );
}

const styles = {};
