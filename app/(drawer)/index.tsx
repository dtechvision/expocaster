import { Text, View } from 'react-native';

import FrameRenderer from '../../components/frame-renderer';
import CastFrames from '~/components/cast-frames';

const Page = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>Home</Text>
      <View className={styles.separator} />
      <FrameRenderer url="http://localhost:8081/api/frames/costco" />
      {/* https://warpcast.com/gregfromstl/0xac0abe37 users casts -> political leaning frame */}
      <CastFrames hash='0xac0abe37'/>
    </View>
  );
};

export default Page;

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
