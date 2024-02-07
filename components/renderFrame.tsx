import React, { useState } from 'react';
import { Frame } from 'frames.js';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type FrameRenderProps = {
  isLoggedIn: boolean;
  frame: Frame;
  url: string | null;
  submitOption: (args: { buttonIndex: number; inputText?: string }) => void;
};

export function FrameRender({ frame, url, submitOption, isLoggedIn }: FrameRenderProps) {
  const [inputText, setInputText] = useState('');

  return (
    <View style={{ width: 382 }}>
      <Image
        source={{ uri: frame.image }}
        style={{ borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
        width={382}
        height={200}
      />
      {frame.inputText && (
        <TextInput
          style={{ width: 382, padding: 8 }}
          placeholder={frame.inputText}
          onChangeText={(text) => setInputText(text)}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 4,
          gap: 4,
        }}>
        {frame.buttons?.map(({ label, action }, index: number) => (
          <TouchableOpacity
            style={{ flex: 1, padding: 6 }}
            onPress={() => {
              if (!isLoggedIn) {
                alert(
                  'Choose an fid to impersonate or Sign in (costs warps) to use the frame buttons'
                );
                return;
              }
              return submitOption({
                buttonIndex: index + 1,
                inputText: frame.inputText !== undefined ? inputText : undefined,
              });
            }}
            key={index}>
            <Text>
              {label}
              {action === 'post_redirect' ? ` ↗` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
