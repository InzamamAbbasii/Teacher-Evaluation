import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const TeacherRating = () => {
  const [data, setData] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('1');
  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = () => {
    setQuestionsList([]);
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Director/GetQuestions`;
    fetch(InsertApiURL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        setQuestionsList(response);
      })
      .catch(error => {
        alert(error);
      });
  };
  const getRating = () => {
    setData([]);
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Director/getTopRatedTeachers?question_no=${selectedQuestion}`;
    fetch(InsertApiURL, {
      method: 'GET',
    })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else throw 'Something went wrong';
      })
      .then(response => {
        if (response.length == 0) alert('No Result Found');
        else setData(response);
      })
      .catch(error => {
        alert(error);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 10,
          margin: 10,
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, color: '#000'}}>Select Question</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderColor: '#000',
            borderWidth: 1,
            borderRadius: 7,
            height: 40,
            justifyContent: 'center',
          }}>
          <Picker
            mode="dropdown"
            selectedValue={selectedQuestion}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedQuestion(itemValue)
            }>
            {questionsList.map((item, key) => {
              return (
                <Picker.Item
                  label={item.Question_ID.toString()}
                  value={item.Question_ID.toString()}
                  key={key}
                />
              );
            })}
          </Picker>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => getRating()}
        style={{
          backgroundColor: '#000',
          width: '90%',
          alignSelf: 'center',
          height: 45,
          justifyContent: 'center',
          borderRadius: 10,
          marginVertical: 30,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#FFF',
            textAlign: 'center',
            fontWeight: '800',
          }}>
          Show
        </Text>
      </TouchableOpacity>
      <FlatList
        style={{flex: 1, marginTop: 8}}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                flex: 1,
                backgroundColor: '#ccc',
                margin: 5,
                marginHorizontal: 10,
                padding: 7,
                borderRadius: 8,
              }}>
              <Text style={{fontSize: 20, color: '#000'}}>
                {item.Emp_name.toString().replace(/\s+/g, ' ')}
                {'  '} {parseFloat(item.Rating).toFixed(1)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default TeacherRating;
