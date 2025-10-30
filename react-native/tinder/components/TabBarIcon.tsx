import { Text, View } from "react-native";
import Icon, { IconProps } from "./Icon";

type TabBarIconProps = {
  focused: boolean;
  iconName: IconProps["name"];
  text: string;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, iconName, text }) => {
  const color = focused ? "#123" : "#456";
  return (
    <View>
      <Icon name={iconName} size={16} color={color} />
      <Text>{text}</Text>
    </View>
  );
};

export default TabBarIcon;
