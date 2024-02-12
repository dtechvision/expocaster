import React from 'react';
import {View,StyleSheet,Text}from "react-native"
const Page = () => {
  return (
    <View style={Styles.container}>
     <Text>Hello</Text>
    </View>
  );
};

export default Page;

const Styles=StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }
})
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
