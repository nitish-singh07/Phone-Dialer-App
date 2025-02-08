import { Text } from "react-native";

const Icon = ({ name, size = 24 }) => {
  return <Text style={{ fontSize: size }}>{name}</Text>;
};

export default Icon;
