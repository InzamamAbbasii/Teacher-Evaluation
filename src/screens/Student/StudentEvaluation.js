import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
const StudentEvaluation = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [questionsData, setQuestionsData] = useState([]);
  const [copy, setCopy] = useState([]);
  const [isFetched, setIsFetched] = useState(true);
  var radio_props = [
    //radio button
    {label: 'Excellent ', value: 'Excellent'},
    {label: 'Good', value: 'Good'},
    {label: 'Average', value: 'Average'},
    {label: 'Below Average', value: 'Below Average'},
    {label: 'Poor', value: 'Poor'},
  ];
  const getLabelIndex = selectedValue => {
    if (selectedValue == 'Excellent') return 0;
    else if (selectedValue == 'Good') return 1;
    else if (selectedValue == 'Average') return 2;
    else if (selectedValue == 'Below Average') return 3;
    else if (selectedValue == 'Poor') return 4;
    else return -1;
  };
  useEffect(() => {
    //get all question from database
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Student/GetQuestions?reg_no=${route.params.Reg_No}&emp_no=${route.params.Emp_No}&course_no=${route.params.Course_No}`;
    fetch(InsertApiURL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        setQuestionsData([]);
        response.forEach(element => {
          setQuestionsData(data => [
            ...data,
            {
              Qid: element.Question_ID,
              Question: element.Question1,
              Selected: element.Selected,
              SelectedButton: getLabelIndex(element.Selected),
              // Selected: '',
            },
          ]);
        });
        setIsFetched(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const onChangeValue = (qid, itemSelected) => {
    const newData = questionsData.map(item => {
      if (item.Qid == qid) {
        return {
          ...item,
          Selected: itemSelected,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setQuestionsData(newData);
    setCopy(newData);
  };

  const saveEvaluation = () => {
    let answerList = questionsData.filter(item => item.Selected != '');

    if (answerList.length != questionsData.length) {
      alert('Please answer all questions to save');
    } else {
      let ans_marks = 1;
      let newData = answerList.map(element => {
        if (element.Selected == 'Excellent') ans_marks = 5;
        else if (element.Selected == 'Good') ans_marks = 4;
        else if (element.Selected == 'Average') ans_marks = 3;
        else if (element.Selected == 'Below Average') ans_marks = 2;
        else if (element.Selected == 'Poor') ans_marks = 1;

        return {
          Emp_no: route.params.Emp_No,
          Reg_No: route.params.Reg_No,
          Course_no: route.params.Course_No,
          Discipline: route.params.Discipline,
          Semester_no: route.params.Semester_No,
          Question_Desc: element.Qid,
          Answer_Desc: element.Selected,
          Answer_Marks: ans_marks,
        };
      });
      console.log(newData);
      var headers = {
        'Content-Type': 'application/json',
      };
      var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Student/addStdEvaluation1`;
      fetch(InsertApiURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newData),
      })
        .then(response => {
          if (response.status == 200) {
            return response.json();
          } else throw 'Something went wrong';
        })
        .then(response => {
          console.log('response', response);
          if (response == 'Saved') {
            navigation.navigate('StudentCourses', {
              Semester: route.params.Semester_No,
              Program: route.params.Discipline,
              Reg_No: route.params.Reg_No,
              Name: route.params.Name,
            });
          }
        })
        .catch(error => {
          alert(error);
        });
      // .finally(() => setLoading(false));
    }
    return;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
        {route.params.Emp_Name}
      </Text>

      {isFetched == true ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          style={{flex: 1, marginTop: 8}}
          showsVerticalScrollIndicator={false}
          data={questionsData}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            return (
              <View style={styles.card}>
                <Text style={{fontSize: 20, color: '#eee'}}>
                  Question# : {item.Qid}
                </Text>
                <Text style={{fontSize: 20, color: '#eee'}}>
                  {item.Question}
                </Text>
                {route.params.Status == 'View' ? (
                  <RadioForm
                    disabled={true}
                    style={{marginTop: 10}} //radio button
                    onChangeText={text => setgender(text)}
                    radio_props={radio_props}
                    initial={item.SelectedButton}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={'red'}
                    animation={false}
                    onPress={value => {
                      onChangeValue(item.Qid, value);
                    }}
                    labelColor={'#FFF'}
                    buttonsize={5}
                    buttonOuterSize={30}
                    selectedButtonColor={'green'}
                    selectedLabelColor={'#fff'}
                    labelStyle={{fontSize: 20}}
                  />
                ) : (
                  <RadioForm
                    style={{marginTop: 10}} //radio button
                    onChangeText={text => setgender(text)}
                    radio_props={radio_props}
                    initial={item.SelectedButton}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={'red'}
                    animation={false}
                    onPress={value => {
                      onChangeValue(item.Qid, value);
                    }}
                    labelColor={'#FFF'}
                    buttonsize={5}
                    buttonOuterSize={30}
                    selectedButtonColor={'green'}
                    selectedLabelColor={'#fff'}
                    labelStyle={{fontSize: 20}}
                  />
                )}
              </View>
            );
          }}
          ListFooterComponent={
            route.params.Status !== 'View' && (
              <TouchableOpacity
                style={styles.btnTouchable}
                onPress={() => saveEvaluation()}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
};

export default StudentEvaluation;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding: 10,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#000',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 10,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  btnTouchable: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    height: 55,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
