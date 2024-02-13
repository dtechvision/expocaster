import React, { FC } from 'react';
import { Frame, FrameButton, FrameMetaTags } from './utils/types';
import { getFrame } from '~/components/render-frame';
import { getFrameParsedData } from './utils/getFrame';
import { isValidHttpUrl } from './utils/helpers';
import {
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import FrameContainer from './FrameContainer';

const PRIMARY_BG_COLOR = 'black';

export default function FrameDebugger() {
  const [frameData, setFrameData] = React.useState<Frame | null>(null);
  const [frameUrl, setFrameUrl] = React.useState('');
  const abortController = new AbortController();
  async function fetchData() {
    try {
      const frame = await getFrame({ url: frameUrl, controller: abortController });
      if (frame) {
        setFrameData(frame.frame);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async function loadFrame() {
    if (frameData) {
      setFrameUrl('');
      setFrameData(null);
      return;
    }
    try {
      if (isValidHttpUrl(frameUrl)) {
        await fetchData();
      }
      fetchData();
    } catch (error) {
      console.log('Error:', error);
    }
  }

  React.useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const updateFrameData = async (resHtmlString: string) => {
    const frame = getFrameParsedData({ htmlString: resHtmlString, url: frameUrl });
    if (frame) {
      setFrameData(frame.frame);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setFrameUrl}
        value={frameUrl}
        placeholder="Enter Frame URL"
        placeholderTextColor={'black'}
      />
      <TouchableOpacity style={styles.buttonStyle} onPress={loadFrame}  >
        <Text style={styles.itemText}>{frameData ? 'Clear Frame' : 'Load Frame'}</Text>
      </TouchableOpacity>
      {frameData && (
        <FrameContainer
          frameUrl={frameUrl}
          frameData={frameData}
          updateFrameData={updateFrameData}
        />
      )}
      {frameData && <FrameDebugData frameData={frameData} frameUrl={frameUrl} />}
    </ScrollView>
  );
}

const FrameDebugData = ({ frameData, frameUrl }: { frameData: Frame; frameUrl: string }) => {
  return (
    <View style={{ backgroundColor: '#2a2432', padding: 4, borderRadius: 4 }}>
      <RenderRow frameKey={'Current Frame URL'} value={frameUrl} />
      <RenderRow frameKey={'Next Frame URL'} value={frameData.postUrl} />

      <RenderRow frameKey={FrameMetaTags.FC_FRAME} value={frameData.version} />
      <RenderRow frameKey={FrameMetaTags.FC_IMAGE} value={frameData.image} />
      <RenderRow frameKey={FrameMetaTags.OG_IMAGE} value={frameData.ogImage} />
      <RenderRow
        frameKey={FrameMetaTags.FC_IMAGE_ASPECT_RATIO}
        value={frameData.imageAspectRatio}
      />
      {frameData.buttons &&
        frameData.buttons.map((button, index) => {
          return (
            <DebugFrameButton
              key={index}
              frameKey={`${FrameMetaTags.FC_BUTTON}:${index + 1}`}
              frameButton={button}
            />
          );
        })}
      <RenderRow frameKey={FrameMetaTags.FC_POST_URL} value={frameData.postUrl} />
      <RenderRow frameKey={FrameMetaTags.FC_INPUT_TEXT} value={frameData.inputText} />
      <View style={styles.parcedData}>
        <Text style={{ fontSize: 20, color: 'white' }}>Raw Frame Data</Text>
        <Text style={styles.itemText}>{JSON.stringify(frameData, null, 2)}</Text>
      </View>
    </View>
  );
};
type RowProps = {
  frameKey: string;
  value: string | null | undefined;
};
const RenderRow: FC<RowProps> = ({ frameKey, value }) => {
  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.itemText}>{frameKey}</Text>
        <Text style={styles.itemText}>{Boolean(value) ? '✅' : '❌'}</Text>
      </View>
      {value ? <Text style={styles.itemText}>{value}</Text> : null}
    </TouchableOpacity>
  );
};

const DebugFrameButton = ({
  frameKey,
  frameButton,
}: {
  frameKey: string;
  frameButton: FrameButton;
}) => {
  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.itemText}>{frameKey}</Text>
        <Text style={styles.itemText}>{'✅'}</Text>
      </View>
      <View>
        <Text style={styles.itemText}>Label:{frameButton.label}</Text>
        <Text style={styles.itemText}>Action:{frameButton.action}</Text>
        <Text style={styles.itemText}>Target:{frameButton.target}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  buttonStyle: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_BG_COLOR,
    alignItems: 'center',
  },
  textInput: {
    width: Dimensions.get('window').width - 16,
    height: 40,
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    borderColor: '#4c3a4ec0',
    borderWidth: 1,
  },
  itemContainer: {
    maxWidth: Dimensions.get('window').width - 16,
    flexDirection: 'column',
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    borderColor: '#ffffff1a',
    backgroundColor: '#ffffff1a',
    borderWidth: 1,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
  },
  parcedData: {
    backgroundColor: '#ffffff1a',
    padding: 8,
    borderRadius: 4,
  },
});
