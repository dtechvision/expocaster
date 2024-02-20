import {
  StyleSheet,
  View,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
  Platform,
  TextInput,
  Text,
  DimensionValue,
} from 'react-native';
import React, { PropsWithChildren, useState } from 'react';
import { Frame, FrameButton as IFrameButton } from './utils/types';
import { isValidHttpUrl } from './utils/helpers';

type FrameContainerProps = {
  frameData: Frame;
  frameUrl: string;
  updateFrameData?: (url: string) => void;
} & PropsWithChildren<{}>;

const FrameContainer = ({ frameData, frameUrl, updateFrameData }: FrameContainerProps) => {
  const [inputText, setInputText] = useState('');

  const handleTextChange = React.useCallback(
    (text: string) => {
      setInputText(text);
    },
    [frameData]
  );

  const makePostRequest = async (buttonIndex: number) => {
    try {
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
        mode: 'no-cors',
      });
      const data = await response.text();
      updateFrameData && updateFrameData(data);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {frameData.image && (
          <View style={{ height: 'auto', width: '100%' }}>
            <FrameImage src={frameData.image} />
            <FrameURL frameUrl={frameUrl} />
          </View>
        )}
        <View style={{ padding: 8, width: '100%' }}>
          {frameData.inputText && (
            <FrameInput placeHolder={frameData.inputText} handleTextChange={handleTextChange} />
          )}
          <View style={styles.frameButtons}>
            {frameData.buttons && frameData.buttons.length > 0 && (
              <View style={styles.frameButtons}>
                {frameData.buttons.map((button, index) => {
                  return (
                    <FrameButton
                      key={index}
                      button={button}
                      index={index}
                      onClick={() => makePostRequest(index + 1)}
                      totalBtns={frameData?.buttons?.length!}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export const FrameImage = ({ src }: { src: string }) => {
  return <Image source={{ uri: src }} style={[styles.imageStyle]} resizeMode="stretch" />;
};

const FrameURL = ({ frameUrl }: { frameUrl: string }) => {
  const frameHost = new URL(frameUrl).hostname;

  return (
    <View style={styles.frameUrlContainer}>
      <Text numberOfLines={1} style={{ maxWidth: '100%', textAlign: 'center', color: 'white' }}>
        {frameHost}
      </Text>
    </View>
  );
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
      selectionColor={'white'}
      style={styles.inputStyle}
      placeholderTextColor={'white'}
    />
  );
};

const FrameButton = ({
  button,
  index,
  onClick,
  totalBtns,
}: {
  button: IFrameButton;
  index: number;
  onClick?: () => void;
  totalBtns: number;
}) => {
  const openExternalLink = () => {
    if (!button.target) return;
    if (!isValidHttpUrl(button.target)) {
      return;
    }
    Alert.alert(
      'Warning',
      'You are about to leave ExpoCaster',
      [
        { text: 'OK', onPress: () => Linking.openURL(button.target!) },
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  if (button.action === 'link' || button.action === 'post_redirect') {
    return (
      <TouchableOpacity
        style={[styles.buttonStyle, { width: getButtonWidth(index, totalBtns) }]}
        onPress={openExternalLink}>
        <Text style={styles.buttonTextStyle}>{button.label}↗</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, { width: getButtonWidth(index, totalBtns) }]}
      onPress={() => {
        onClick && onClick();
      }}>
      <Text style={styles.buttonTextStyle}>{button.label}</Text>
    </TouchableOpacity>
  );
};

export default FrameContainer;

function getButtonWidth(index: number, length: number): DimensionValue {
  let btnWidth: DimensionValue = '48%';
  if (length === 1) {
    btnWidth = '98%';
  }
  if (length === 2) {
    if (index === 0 || index === 1) {
      btnWidth = '48%';
    }
    if (index === 2) {
      btnWidth = '98%';
    }
  }
  if (length === 3) {
    if (index === 1) {
      btnWidth = '48%';
    }
    if (index === 2) {
      btnWidth = '98%';
    }
  }
  return btnWidth;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#2a2432',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 8,
    marginVertical: 8,
  },
  frameUrlContainer: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  imageStyle: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  buttonStyle: {
    height: 'auto',
    borderRadius: 4,
    borderColor: '#4c3a4ec0',
    backgroundColor: '#ffffff1a',
    borderWidth: 1,
    padding: 8,
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  inputStyle: {
    width: '98%',
    alignSelf: 'center',
    height: 40,
    padding: Platform.OS === 'web' ? 1 : 8,
    borderRadius: 4,
    marginVertical: 4,
    borderColor: '#4c3a4ec0',
    backgroundColor: '#ffffff1a',
    borderWidth: 1,
    paddingHorizontal: 8,
    color: 'white',
  },
});
