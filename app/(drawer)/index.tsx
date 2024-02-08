import { ScrollView } from 'react-native';

import RenderFrame from '../../components/render-frame';

const Page = () => {
  
  return (
      <ScrollView contentContainerClassName={styles.container}>
      {/* 1 Button */}
      {/* <RenderFrame frameUrl="https://farm.cropxyz.com" /> */}

      {/* 2 Buttons */}
      {/* <RenderFrame frameUrl="https://fc-polls.vercel.app/polls/13d618ca-9ff5-490f-86d2-1d87ffe5128f" /> */}

      {/* 3 Button */}
      {/* <RenderFrame frameUrl="https://fc-polls.vercel.app/polls/50623a44-1771-48ce-9274-404e0e82dbe7" /> */}

      {/* 4 Buttons */}
      <RenderFrame frameUrl="https://fc-polls.vercel.app/polls/8fd0177f-f118-4dce-b87d-0de9835d904d" />

      {/* With Input */}
      {/* <RenderFrame frameUrl="https://alliance-frame.vercel.app/" /> */}

      {/* With Input -Personal Frame */}
      <RenderFrame frameUrl="https://sol-drop-frame.vercel.app/" />

      {/* With Image */}
      {/* https://warpcast.com/gregfromstl/0xac0abe37 users casts -> political leaning frame */}
    </ScrollView>
  );
};

export default Page;

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
