import React from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';

interface BadgeProps {
    count: number;
  }

const Badge = ( {count} :BadgeProps ) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.text}>{count}</Text>
      </View>
    </View>
  );
};

export const DialogBadge = ( {count} :BadgeProps ) => {
    return (
      <View style={styles.container}>
        <View style={styles.dialogbadge}>
          <Text style={styles.text}>{count}</Text>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -66,
    right: -20,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nmbadge: {
    backgroundColor: 'red',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 198,
    left: Dimensions.get('window').width - 50,
    margin: 10,
  },
  dialogbadge: {
    backgroundColor: 'red',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -30,
    left: -2,
    margin: 10,
  }
});

export default Badge;

export const NotionMainBadge = () => {
    return (
      <View style={styles.container}>
        <View style={styles.nmbadge}>
          <Text style={styles.text}>{"..."}</Text>
        </View>
      </View>
    );
  };