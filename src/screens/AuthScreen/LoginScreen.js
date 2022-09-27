import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const LoginScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('student'); //default student
  const [loading, setloading] = useState(false);
  const adminLogin = () => {
    console.log('admin login');
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Login/admin`;
    fetch(InsertApiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        User_type: selectedAccountType,
        User_id: name,
        User_password: password,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response == 'incoreect Creddiatenals') alert(response);
        else if (
          response.User_type.replace(/\s{2,}/g, ' ').trim() == 'Director'
        ) {
          navigation.navigate('TeacherPerformance', response);
        } else {
          // navigation.navigate('AddTempleate', response);
          navigation.navigate('Dashboard', response);
        }
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => setloading(false));
  };

  const studentLogin = () => {
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Student/Login?name=${name}&pass=${password}`;
    fetch(InsertApiURL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        if (response == 'Invalid username or password.') {
          alert(response);
        } else {
          navigation.navigate('StudentCourses', response);
        }
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => setloading(false));
  };
  const handleLogin = () => {
    if (name.length == 0 || password.length == 0) {
      alert('Please Enter Your Credentials!');
    } else {
      setloading(true);
      if (selectedAccountType == 'student') {
        studentLogin();
      } else if (selectedAccountType == 'admin') {
        adminLogin();
      } else if (selectedAccountType == 'director') {
        adminLogin();
      } else {
        alert('Please Select Account Type');
      }
    }
  };
  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            zIndex: 1,
          }}>
          <ActivityIndicator
            size="large"
            color="red"
            style={{height: '100%'}}
          />
        </View>
      )}
      <View style={styles.header}>
        <Text style={{fontSize: 32, color: '#ffffff', fontWeight: 'bold'}}>
          Login!
        </Text>
      </View>
      <View style={styles.form}>
        {/* <Text style={{fontSize:20,marginLeft:10}}>UserName</Text> */}
        <View style={styles.textInput}>
          {/* <Icon name="person" size={30} color="#3EB489" /> */}
          <TextInput
            style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
            placeholder="UserName"
            placeholderTextColor="#3228"
            onChangeText={name => setName(name)}
          />
        </View>
        {/* <Text style={{fontSize:20,marginLeft:10}}>Password</Text> */}
        <View style={styles.textInput}>
          {/* <Icon name="lock" size={30} color="#3EB489" /> */}
          <TextInput
            style={{padding: 5, fontSize: 18, width: '85%', color: '#000'}}
            placeholder="Password"
            placeholderTextColor="#3228"
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
          />
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            borderColor: '#000',
            borderWidth: 2,
            borderRadius: 30,
            margin: 15,
          }}>
          <Picker
            mode="dropdown"
            selectedValue={selectedAccountType}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedAccountType(itemValue)
            }>
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Director" value="director" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.btnLogin} onPress={() => handleLogin()}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center'
  },
  header: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderBottomRightRadius: 130,
    marginBottom: 40,
  },
  textInput: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 40,
    padding: 5,
    paddingLeft: 15,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  btnSignUp: {
    width: '100%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
  },
  btnLogin: {
    width: '95%',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#000',
  },
});
export default LoginScreen;
