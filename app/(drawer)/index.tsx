import { Text, View } from 'react-native';

import RenderFrame from '../../components/render-frame';

import { FrameRender } from '~/components/renderFrame';
import { getFrame } from 'frames.js/src';
import { Frame } from 'frames.js';

const Page = () => {
  let frame: Frame = getFrame({ htmlString: 'tes', url: 'http://localhost:8081/api/frames/costco' });
  return (
    <View className={styles.container}>
      <Text className={styles.title}>Home</Text>
      <FrameRender url="http://localhost:8081/api/frames/costco" isLoggedIn={true} frame={frame}  />
      <View className={styles.separator} />
      <RenderFrame frameUrl="http://localhost:8081/api/frames/costco" />
      {/* https://warpcast.com/gregfromstl/0xac0abe37 users casts -> political leaning frame */}
    </View>
  );
};

export default Page;

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
