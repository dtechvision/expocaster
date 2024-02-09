import RenderFrame from '../../components/render-frame';
import { FlatList, View } from 'react-native';
import React from 'react';

const Frames = [
  {
    frameUrl: 'https://yoink.terminally.online',
    title: 'Post Redirect',
  },
  {
    frameUrl: 'https://frames-playground-three.vercel.app/',
    title: 'Post Link',
  },
  {
    frameUrl: 'https://www.onceupon.gg/0x00000000000000adc04c56bf30ac9d3c0aaf14dc',
    title: 'Zora Frame',
  },
  {
    frameUrl: 'https://farm.cropxyz.com',
    title: '1 Button',
  },
  {
    frameUrl: 'https://fc-polls.vercel.app/polls/13d618ca-9ff5-490f-86d2-1d87ffe5128f',
    title: '2 Buttons',
  },
  {
    frameUrl: 'https://fc-polls.vercel.app/polls/50623a44-1771-48ce-9274-404e0e82dbe7',
    title: '3 Buttons',
  },
  {
    frameUrl: 'https://fc-polls.vercel.app/polls/8fd0177f-f118-4dce-b87d-0de9835d904d',
    title: '4 Buttons',
  },
  {
    frameUrl: 'https://alliance-frame.vercel.app/',
    title: 'With Input',
  },
  {
    frameUrl: 'https://sol-drop-frame.vercel.app/',
    title: 'With Input -Personal Frame',
  },
  {
    frameUrl: 'https://warpcast.com/gregfromstl/0xac0abe37',
    title: 'With Image',
  },
];

const renderItem = ({ item }: { item: { frameUrl: string; title: string } }) => {
  return <RenderFrame frameUrl={item.frameUrl} />;
};

const Page = () => {
  return (
    <View className={styles.container}>
      <FlatList data={Frames} keyExtractor={(item) => item.frameUrl} renderItem={renderItem} />
    </View>
  );
};

export default Page;

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
