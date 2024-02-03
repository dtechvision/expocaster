import { useEffect, useState } from 'react';
import { Text, View, Image, Pressable } from 'react-native';

export default function FrameRenderer({ url }: { url: string }) {
  const [imageUrl, setImageUrl] = useState('');
  const [postUrl, setPostUrl] = useState('');

  useEffect(() => {
    const fetchHtmlAndExtractUrls = async () => {
      try {
        const response = await fetch(url);
        const htmlResponse = await response.text();
        console.log('response', htmlResponse);

        const imageRegex = /<meta\s+property="fc:frame:image"\s+content="([^"]+)"\s*\/?>/i;
        const postUrlRegex = /<meta\s+property="fc:frame:post_url"\s+content="([^"]+)"\s*\/?>/i;

        const imageUrlMatch = htmlResponse.match(imageRegex);
        const postUrlMatch = htmlResponse.match(postUrlRegex);

        const extractedImageUrl = imageUrlMatch ? imageUrlMatch[1] : 'default_image_url';
        const extractedPostUrl = postUrlMatch ? postUrlMatch[1] : 'default_post_url';

        console.log('image', extractedImageUrl);

        setImageUrl(extractedImageUrl);
        setPostUrl(extractedPostUrl);
      } catch (error) {
        // Handle the error, you can log it or perform other error handling actions
        // Set default values for imageUrl and postUrl
        console.log('error', error);
        setImageUrl('default_image_url');
        setPostUrl('default_post_url');
      }
    };

    fetchHtmlAndExtractUrls();
  }, [url]);

  const handleButtonPress = () => {
    // Send a POST request to the postUrl
    fetch(postUrl, { method: 'POST' }).then((response) => {
      // Handle the POST request response
      console.log('set image', imageUrl);
    });
  };
  return (
    <View className={styles.frameBox}>
      <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
      <Pressable className={styles.frameButton} onPress={handleButtonPress}>
        <Text>Enter Costco (Members only)!</Text>
      </Pressable>
    </View>
  );
}

const styles = {
  frameBox: `rounded-md bg-black`,
  frameImage: ``,
  frameInput: ``,
  frameButton: `mt-8 bg-blue-300`,
};
