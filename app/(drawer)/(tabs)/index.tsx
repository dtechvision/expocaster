import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

import RenderFrame from '~/components/render-frame';

const FRAME_PUBLIC_URL = __DEV__ ? 'http://localhost:8081' : 'https://expocaster.netlify.app/';
const LOCAL_FRAME_URL = FRAME_PUBLIC_URL + '/api/frames/examples/sampleInput';
const Frames = [
  {
    frameUrl: LOCAL_FRAME_URL,
    title: 'Local Frame',
  },
  {
    frameUrl: 'https://yoink.terminally.online',
    title: 'Post Redirect',
  },
  {
    frameUrl: 'https://farm.cropxyz.com',
    title: '1 Button',
  },
  {
    frameUrl: 'https://alliance-frame.vercel.app/',
    title: 'With Input',
  },

  {
    frameUrl: 'https://frames.neynar.com/f/6f89a5ac/505cd276',
    title: 'Aspect Ratio Frame',
  },

  {
    frameUrl: 'https://sol-drop-frame.vercel.app/',
    title: 'With Input -Personal Frame',
  },
];

const TabOneScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <ScrollView contentContainerStyle={[Styles.container, { width: isMobile ? '100%' : '40%' }]}>
      {Frames.map((frame, index) => {
        return <RenderFrame key={index} frameUrl={frame.frameUrl} />;
      })}
      {/* <FlatList data={Frames}  keyExtractor={(item) => item.frameUrl} renderItem={renderItem} /> */}
    </ScrollView>
  );
};

export default TabOneScreen;

const Styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
