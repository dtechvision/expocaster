import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput, Text,
    DimensionValue
} from 'react-native';
import React, { PropsWithChildren, useState } from 'react';
import { FrameButtonProps, FrameData } from '~/components/render-frame';

type FrameContainerProps = {
  frameData: FrameData;
  updateFrameData?: (url: string) => void;
} & PropsWithChildren<{}>;

const FrameContainer = ({ frameData, updateFrameData }: FrameContainerProps) => {
  const [inputText, setInputText] = useState('');

  const handleTextChange = React.useCallback(
    (text: string) => {
      setInputText(text);
    },
    [frameData]
  );

  const makePostRequest = async (buttonIndex: number) => {
    const packetToSend = {
      untrustedData: {
        fid: 'HERE_COMES_THE_FID',
        url: new URL(frameData.postUrl).hostname,
        messageHash: 'HERE_COMES_THE_MESSAGE_HASH',
        timestamp: Date.now(),
        network: 1,
        buttonIndex: buttonIndex,
        inputText: inputText,
        castId: {
          fid: 'HERE_COMES_THE_FID',
          hash: 'HERE_COMES_THE_HASH',
        },
      },
      trustedData: {
        messageBytes: 'HERE_COMES_THE_MESSAGE_BYTES',
      },
    };

    const response = await fetch(frameData.postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packetToSend),
    });
    const data = await response.text();
    updateFrameData && updateFrameData(data);
    console.log(data);
  };

  return (
    <View className="w-full h-auto justify-around items-center border-black">
      {frameData.image && <FrameImage src={frameData.image} />}
      {frameData.inputText && (
        <FrameInput placeHolder={frameData.inputText} handleTextChange={handleTextChange} />
      )}
      {frameData.buttons && frameData.buttons.length > 0 && (
        <View style={styles.frameButtons}>
          {frameData.buttons.map((button, index) => {
            const btnWidth = getButtonWidth(index, frameData?.buttons?.length!);
            return (
              <FrameButton
                key={index}
                button={button}
                index={index}
                width={btnWidth}
                onClick={() => makePostRequest(index)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export const FrameImage = ({ src }: { src: string }) => {
  return <Image source={{ uri: src }} style={styles.imageStyle} resizeMode="stretch" />;
};

type FrameInputProps = {
  placeHolder: string;
  handleTextChange: (text: string) => void;
};

export const FrameInput = ({ placeHolder, handleTextChange }: FrameInputProps) => {
  return (
    <TextInput
      placeholder={placeHolder}
      onChangeText={handleTextChange}
      selectionColor={'black'}
      style={styles.inputStyle}
    />
  );
};

const FrameButton = ({
  button,
  width,
  onClick,
}: {
  button: FrameButtonProps;
  index: number;
  width: DimensionValue;
  onClick?: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, { width: width }]}
      onPress={() => {
        onClick && onClick();
      }}>
      <Text style={{ textAlign: 'center' }}>{button.label}</Text>
    </TouchableOpacity>
  );
};

export default FrameContainer;

function getButtonWidth(index: number, length: number): DimensionValue {
  let btnWidth: DimensionValue = '50%';
  if (length === 1) {
    btnWidth = '100%';
  }
  if (length === 2) {
    if (index === 0 || index === 1) {
      btnWidth = '50%';
    }
    if (index === 2) {
      btnWidth = '100%';
    }
  }
  if (length === 3) {
    if (index === 1) {
      btnWidth = '50%';
    }
    if (index === 2) {
      btnWidth = '100%';
    }
  }
  return btnWidth;
}

const WINDOW_WIDTH = Dimensions.get('window').width - 20;

const styles = StyleSheet.create({
  frameButtons: {
    width: WINDOW_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  imageStyle: {
    width: WINDOW_WIDTH,
    height: 220,
    borderRadius: 8,
  },
  buttonStyle: {
    width: '50%',
    height: 'auto',
    borderRadius: 4,
    borderColor: 'lightgrey',
    backgroundColor: 'grey',
    borderWidth: 1,
    padding: 8,
    marginVertical: 4,
  },
  inputStyle: {
    width: WINDOW_WIDTH,
    height: 40,
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    borderColor: 'black',
    borderWidth: 1,
  },
});
