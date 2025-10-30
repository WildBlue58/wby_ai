import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

export type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const Icon: React.FC<IconProps> = ({ color, name, size, style }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);

export default Icon;
