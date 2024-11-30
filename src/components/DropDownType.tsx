import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

type DropdownItem = {
  label: string;
  value: string;
};

type DropdownComponentProps = {
  data: DropdownItem[];
  defaultValue?: string;
  onSelect: (value: string) => void;
};

const DropdownComponentForSalesType: React.FC<DropdownComponentProps> = ({
  data,
  defaultValue,
  onSelect,
}) => {
  const [value, setValue] = useState<string | null>(defaultValue || null);
  const router = useRouter();

  useEffect(() => {
    if (value) {
      onSelect(value);
    }
  }, [value, onSelect]);

  const renderItem = (item: DropdownItem) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Type"
      value={value}
      onChange={(item: DropdownItem) => {
        setValue(item.value);
      }}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponentForSalesType;

const styles = StyleSheet.create({
  dropdown: {
    // margin: 16,
    height: 40,
    width: 170,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
