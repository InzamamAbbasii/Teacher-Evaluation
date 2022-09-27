import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Picker} from '@react-native-picker/picker';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const AddTempleate = () => {
  const [question1, setQuestion1] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('2021F');
  const [isLoading, setIsLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [manualQuestionList, setManualQuestionList] = useState([]);
  useEffect(() => {
    setManualQuestionList([]);
    setQuestionList([]);
    getQuestions();
    console.log('useeffect.......');
  }, []);

  const getQuestions = () => {
    console.log('called....');
    setIsLoading(true);
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Student/GetQuestions`;
    fetch(InsertApiURL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        setQuestionList([]);
        response.forEach(element => {
          setQuestionList(data => [
            ...data,
            {
              Qid: element.Question_ID,
              Question: element.Question1,
              Selected: false,
            },
          ]);
        });
      })
      .catch(error => {
        console.log('error:::::', error);
      })
      .finally(() => setIsLoading(false));
  };

  const onChangeValue = (qid, itemSelected) => {
    console.log(qid, itemSelected);
    const filteredData = questionList.filter(item => item.Selected == true);
    if (itemSelected == true || filteredData.length < 8) {
      const newData = questionList.map(item => {
        if (item.Qid == qid) {
          return {
            ...item,
            Selected: !itemSelected,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      setQuestionList(newData);
    } else {
      alert('You are not allowed to add more questions.');
    }
  };

  const handleAdd = () => {
    if (question1.length == 0) {
      alert('Please Enter question to add.');
    } else {
      if (manualQuestionList.length < 2) {
        setManualQuestionList(data => [
          ...data,
          {
            Question: question1,
          },
        ]);
        setQuestion1('');
        alert('Question Added');
      } else {
        alert('You cannot add more questions.');
      }
    }
  };

  const saveListQuestion = questionList => {
    const newData = questionList.map(item => {
      return {
        QuestionID: item.Qid,
        QuestionName: item.Question,
        Semester: selectedSemester,
      };
    });

    var headers = {
      'Content-Type': 'application/json',
    };
    fetch(`http://${ip}/TeacherEvaluationApi/api/Login/add`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newData),
    })
      .then(response => response.json())
      .then(async res => {
        console.log('res', res);
        alert('Saved...');
      })
      .catch(error => {
        console.log('Error :' + error);
      });
  };

  const addSingleQuestion = () => {
    console.log(manualQuestionList);

    manualQuestionList.forEach(element => {
      console.log(element);
      var headers = {
        'Content-Type': 'application/json',
      };
      fetch(`http://${ip}/TeacherEvaluationApi/api/Admin/AddSingleQuestion`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          QuestionName: element.Question,
          Semester: selectedSemester,
        }),
      })
        .then(response => response.json())
        .then(async res => {
          console.log('res', res);
          // alert('Saved...');
        })
        .catch(error => {
          console.log('Error :' + error);
        });
    });
  };
  const handleSubmit = () => {
    // console.log(questionList);
    console.log(manualQuestionList);
    if (questionList && questionList.length > 0) {
      const filteredData = questionList.filter(item => item.Selected == true);
      if (manualQuestionList.length < 2) {
        let len = manualQuestionList.length;
        alert(`Please add 2 questions manually.You added ${len} Question now.`);
      } else if (filteredData.length < 8) {
        let len = filteredData.length;
        alert(
          `Please Select 8 questions from list.You selected ${len} Question now.`,
        );
      } else {
        saveListQuestion(filteredData);
        addSingleQuestion();
      }
    }
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          <View style={{flex: 1}}>
            <View style={styles.rowView}>
              <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
                Add To :
              </Text>
              <View style={styles.pickerView}>
                <Picker
                  mode="dropdown"
                  selectedValue={selectedSemester}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedSemester(itemValue)
                  }>
                  <Picker.Item label="2021F" value="2021F" />
                  <Picker.Item label="2022F" value="2022F" />
                </Picker>
              </View>
            </View>
            <View>
              <TextInput
                value={question1}
                placeholder="Enter Question"
                onChangeText={text => setQuestion1(text)}
                multiline
                numberOfLines={5}
                style={styles.textInput}
              />
              <TouchableOpacity style={styles.btn} onPress={() => handleAdd()}>
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <FlatList
              style={{backgroundColor: '#FFFFFF', padding: 10}}
              data={questionList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item, index) => {
                return (
                  <View style={styles.rowView}>
                    <Text style={{color: '#000', flex: 1}}>
                      {item.index + 1}. {item.item.Question}
                    </Text>
                    <CheckBox
                      onClick={value =>
                        onChangeValue(item.item.Qid, item.item.Selected)
                      }
                      checkedCheckBoxColor={'#000'}
                      uncheckedCheckBoxColor={'#000'}
                      isChecked={item.item.Selected}
                    />
                  </View>
                );
              }}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AddTempleate;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    borderColor: '#000',
    borderWidth: 1,
    color: '#000',
    width: SCREEN_WIDTH - 20,
    marginVertical: 10,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH - 20,
    marginVertical: 10,
  },
  pickerView: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    width: SCREEN_WIDTH / 2,
  },
  btn: {
    width: 100,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  btnText: {
    color: '#fff',
  },
});
