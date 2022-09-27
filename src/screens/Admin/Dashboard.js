import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const Dashboard = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('AddTempleate')}>
        <Text style={styles.btnText}>Add Question Template</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('AddGraphTemplate')}>
        <Text style={styles.btnText}>Add Graph Template</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '90%',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});
