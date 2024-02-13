import { Text, View,StyleSheet } from 'react-native';
import FrameDebugger from '~/frame/FrameDebugger';


export default function TabTwoScreen() {
  return (
    <View style={Styles.container}>
     <FrameDebugger/>
    </View>
  );
}

const Styles=StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
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

})
// const styles = {
//   container: `items-center flex-1 justify-center`,
//   separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
//   title: `text-xl font-bold`,
// };
