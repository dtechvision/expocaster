import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';

import { NeynarFrame, NeynarCastV2 } from '../types';
import { useCast } from 'farcasterkit';

function CastFrameBtn({
  number,
  text,
  handleOnClick,
}: {
  number: number;
  text: string;
  handleOnClick: (btnNumber: number) => void;
}) {
  return (
    <Pressable
      key={`${number}`}
      className="border border-black/75 border-1 rounded-2xl px-4 py-0.8 text-xs md:text-md"
      onPress={() => handleOnClick(number)}>
      <Text>{text}</Text>
    </Pressable>
  );
}

function CastFrame({
  hash,
  frame,
  signerUuid,
}: {
  hash: string;
  frame: NeynarFrame;
  signerUuid: string;
}) {
  const [localFrame, setLocalFrame] = useState<NeynarFrame>(frame);

  function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 8000
  ): Promise<Response> {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);
  }

  const handleFrameBtnPress = async (btnIndex: number) => {
    console.log(btnIndex, 'was pressed.');
  };

  const renderFrameButtons = () => {
    const buttons = [];
    const buttonTags = localFrame.buttons;

    if (!buttonTags) {
      return null;
    }

    if (buttonTags[0]) {
      buttons.push(
        <CastFrameBtn
          number={buttonTags[0].index}
          text={buttonTags[0].title}
          handleOnClick={() => handleFrameBtnPress(buttonTags[0].index)}
        />
      );
    }

    if (buttonTags[0] && buttonTags[1]) {
      buttons.push(
        <CastFrameBtn
          number={buttonTags[1].index}
          text={buttonTags[1].title}
          handleOnClick={() => handleFrameBtnPress(buttonTags[1].index)}
        />
      );
    }

    if (buttonTags[0] && buttonTags[1] && buttonTags[2]) {
      buttons.push(
        <CastFrameBtn
          number={buttonTags[2].index}
          text={buttonTags[2].title}
          handleOnClick={() => handleFrameBtnPress(buttonTags[2].index)}
        />
      );
    }

    if (buttonTags[0] && buttonTags[1] && buttonTags[2] && buttonTags[3]) {
      buttons.push(
        <CastFrameBtn
          number={buttonTags[3].index}
          text={buttonTags[3].title}
          handleOnClick={() => handleFrameBtnPress(buttonTags[3].index)}
        />
      );
    }

    return <View className="m-2 flex flex-row gap-2 justify-center">{buttons}</View>;
  };

  return (
    <View>
      {localFrame !== null && localFrame.frames_url && (
        <View className="border border-gray-600/70 border-0.5">
          {/* todo: add loading state when the POST request for the frame action fires off */}
          {/* todo: add placeholder image if no image/erorr */}
          <Image
            src={localFrame.image}
            alt={`Frame image for ${localFrame.frames_url}`}
            width={400}
            height={150}
            style={{ width: '100%', height: 'auto' }}
          />
          {renderFrameButtons()}
        </View>
      )}
    </View>
  );
}

export default function CastFrames({ hash, frames }: { hash: string; frames: NeynarFrame[] }) {
  // TODO: const { farcasterUser } = useLogin();
  const farcasterUser = { signer_uuid: '0' };

  //get cast via Farcasterkit React Hook
  const {cast, loading} = useCast({hash: hash})

  return (
    <div className="flex flex-col gap-1">
      {frames.map((frame, index) => {
        return (
          <CastFrame
            key={`cast-frame-${index}`}
            hash={hash}
            frame={frame}
            signerUuid={farcasterUser?.signer_uuid as string}
          />
        );
      })}
    </div>
  );
}
