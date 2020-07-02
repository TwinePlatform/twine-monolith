import React, { FC } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";

import Page from "../../../lib/ui/Page";
import { TERMS } from "../../views_content/TnC";

function Item({ terms }) {
  return (
    <View style={styles.item}>
      <Text style={styles.terms}>{terms}</Text>
    </View>
  );
}

const TnC: FC<Props> = () => (
  <Page heading="Terms & Conditions">
    <FlatList
      data={TERMS}
      renderItem={({ item }) => <Item terms={item.terms} />}
    />
  </Page>
);

export default TnC;

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    marginHorizontal: 32,
  },
  terms: {
    fontSize: 12,
  },
});
