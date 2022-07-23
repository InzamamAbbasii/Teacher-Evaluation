import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ModalDropdown from 'react-native-modal-dropdown';
import DropDownPicker1 from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PureChart from 'react-native-pure-chart';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const TeacherPerformance = ({navigation}) => {
  const [valueArray, setValueArray] = useState([1]);
  const [selectedValueArray, setSelectedValueArray] = useState([
    {Course: 'Select', Index: 0, Semester: 'Select', Teacher: 'Select'},
  ]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [perfomanceData, setPerfomanceData] = useState([]);
  const [performanceBase, setPerformanceBase] = useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const checkValidation = () => {
    for (let index = 0; index < selectedValueArray.length; index++) {
      const item = selectedValueArray[index];
      if (item.Teacher == 'Select') {
        alert('Please Select Teacher');
        return false;
      } else if (item.Course == 'Select') {
        alert('Please Select Course');
        return false;
      } else if (item.Semester == 'Select') {
        alert('Please Select Semester');
        return false;
      }
    }
    if (selectedValueArray.length > 1) {
      let teachers = selectedValueArray.map(item => item.Teacher);
      let courses = selectedValueArray.map(item => item.Course);
      let semester = selectedValueArray.map(item => item.Semester);
      let uniqueTeacher = [...new Set(teachers)];
      let uniqueCourses = [...new Set(courses)];
      let uniqueSemester = [...new Set(semester)];
      if (
        uniqueTeacher.length == 1 &&
        uniqueCourses.length == 1 &&
        uniqueSemester.length == 1
      ) {
        alert(
          'Please select atleast 1 value different to compare performance.',
        );
        return false;
      }
    }
    return true;
  };
  const getTeacherNameById = empno => {
    let obj = teachersList.find(item => item.value == empno);
    return obj.lable;
  };
  const getCourseNameById = course_code => {
    let obj = coursesList.find(item => item.value == course_code);
    return obj.lable;
  };
  const fetchPerformance = () => {
    if (checkValidation()) {
      const newData = selectedValueArray.map(item => {
        return {
          Emp_no: item.Teacher,
          Course_no: item.Course,
          Semester_no: item.Semester,
        };
      });
      // setLoading(true);
      setPerformanceBase([]);
      let teachers = newData.map(item => item.Emp_no);
      let courses = newData.map(item => item.Course_no);
      let semester = newData.map(item => item.Semester_no);
      let uniqueTeacher = [...new Set(teachers)];
      let uniqueCourses = [...new Set(courses)];
      let uniqueSemester = [...new Set(semester)];
      console.log(uniqueTeacher, uniqueCourses, uniqueSemester);

      if (uniqueTeacher.length > 1) {
        uniqueTeacher.forEach(element => {
          setPerformanceBase(data => [...data, getTeacherNameById(element)]);
        });
      } else if (uniqueCourses.length > 1) {
        uniqueCourses.forEach(element => {
          setPerformanceBase(data => [...data, getCourseNameById(element)]);
        });
      } else if (uniqueSemester.length > 1) setPerformanceBase(uniqueSemester);
      else {
        uniqueTeacher.forEach(element => {
          console.log(getTeacherNameById(element));
          setPerformanceBase(data => [...data, getTeacherNameById(element)]);
        });
      }
      console.log(newData);
      setPerfomanceData([]);
      var headers = {
        'Content-Type': 'application/json',
      };
      var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Director/getAverage1`;
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
          // console.log('response', response);
          let notFound = false;
          response.forEach((element, i) => {
            console.log(i, element.length);
            if (element.length == 0) notFound = true;
            else notFound = false;
          });

          if (response.length > 0 || notFound == false) {
            let arr = [];
            let series_name = 'Series';
            response.forEach((item, i) => {
              arr = [];
              series_name = series_name + i;
              item.forEach(element => {
                // arr.push(element.AverageMarks);
                arr.push({x: element.Question_Desc, y: element.AverageMarks});
              });
              if (arr.length > 0) {
                let obj = {
                  seriesName: series_name,
                  data: arr,
                  color: getRandomColor(),
                };
                setPerfomanceData(data => [...data, obj]);
              } else {
                let message = 'No Record found for Employee ' + (i + 1);
                ToastAndroid.show(message, ToastAndroid.SHORT);
              }
            });
          } else {
            alert('No Record Found');
          }
        })
        .catch(error => {
          alert(error);
        })
        .finally(() => setLoading(false));
    }
  };

  const getData = () => {
    setLoading(true);
    setTeachersList([]);
    setCoursesList([]);
    setSemesterList;
    var InsertApiURL = `http://${ip}/TeacherEvaluationApi/api/Director/get_Teachers_Course_Semester_Lists`;
    fetch(InsertApiURL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        response.teachersList.forEach(element => {
          setTeachersList(data => [
            ...data,
            {
              lable: element.Name,
              value: element.Emp_no,
            },
          ]);
        });
        response.coursesList.forEach(element => {
          setCoursesList(data => [
            ...data,
            {
              // lable: element.Course_Desc,
              lable: element.Title,
              value: element.Course_No,
            },
          ]);
        });
        response.semesterList.forEach(element => {
          setSemesterList(data => [
            ...data,
            {
              lable: element.Semester_no,
              value: element.Semester_no,
            },
          ]);
        });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };
  const addMore = () => {
    setValueArray(data => [...data, index]);
    console.log(
      index,
      getSelectedValue(index, 'Teacher'),
      getSelectedValue(index, 'Course'),
      getSelectedValue(index, 'Semester'),
    );
    console.log(selectedValueArray[selectedValueArray.length - 1]);
    let teacher =
      getSelectedValue(index, 'Teacher') == null
        ? teachersList[0].value
        : getSelectedValue(index, 'Teacher');
    let course =
      getSelectedValue(index, 'Course') == null
        ? coursesList[0].value
        : getSelectedValue(index, 'Course');
    let semester =
      getSelectedValue(index, 'Semester') == null
        ? semesterList[0].value
        : getSelectedValue(index, 'Semester');
    let obj = {
      Course: course,
      Index: index + 1,
      Semester: semester,
      Teacher: teacher,
    };
    // let obj = {
    //   Course: coursesList[0].value,
    //   Index: index + 1,
    //   Semester: semesterList[0].value,
    //   Teacher: teachersList[0].value,
    // };
    setSelectedValueArray(data => [...data, obj]); // add new object in array
    setIndex(index + 1);
  };
  const removeItem = () => {
    setValueArray(valueArray.slice(0, -1));
    setIndex(index - 1);
    selectedValueArray.pop(); //remove value from array
    // setPerfomanceData([]);
  };
  const getSelectedValue = (key, name) => {
    let selectedItem = selectedValueArray.find(element => element.Index == key);
    if (selectedItem) {
      if (name == 'Teacher') {
        return selectedItem.Teacher;
      } else if (name == 'Course') {
        return selectedItem.Course;
      } else if (name == 'Semester') {
        return selectedItem.Semester;
      }
    } else {
      return null;
    }
  };

  const handleonvaluechange = (value, itemName, index) => {
    if (value != null) {
      var item = selectedValueArray.find(x => x.Index == index);

      let key = 'Teacher';
      if (itemName == 'Course') key = 'Course';
      else if (itemName == 'Semester') key = 'Semester';
      if (item) {
        let newArray = selectedValueArray.map(element => {
          if (element.Index == index) {
            if (itemName == 'Teacher') {
              return {
                ...element,
                Teacher: value,
              };
            } else if (itemName == 'Course') {
              return {
                ...element,
                Course: value,
              };
            } else if (itemName == 'Semester') {
              return {
                ...element,
                Semester: value,
              };
            }
          } else {
            return {...element};
          }
        });
        setSelectedValueArray(newArray);
      } else {
        let obj = {
          Index: index,
        };
        if (itemName == 'Teacher') obj.Teacher = value;
        if (itemName == 'Course') obj.Course = value;
        if (itemName == 'Semester') obj.Semester = value;
        setSelectedValueArray(data => [...data, obj]);
      }
    }
  };
  let newArray = valueArray.map((item, key) => {
    return (
      <View key={key} style={style.card}>
        <View style={style.cardItem}>
          <Text style={style.cardText}>Teacher{'  '}</Text>
          <View style={{...style.dropdownContainer, flex: 1}}>
            <Picker
              style={style.picker}
              selectedValue={getSelectedValue(key, 'Teacher')}
              onValueChange={value => {
                handleonvaluechange(value, 'Teacher', key);
              }}
              mode={'dropdown'}>
              <Picker.Item label={'Select Teacher'} value={'Select'} />
              {teachersList.map((item, key) => {
                return (
                  <Picker.Item
                    label={item.lable}
                    value={item.value}
                    key={key}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        <View style={style.cardItem}>
          <Text style={style.cardText}>Course</Text>
          <View style={{...style.dropdownContainer, flex: 1}}>
            <Picker
              style={style.picker}
              selectedValue={getSelectedValue(key, 'Course')}
              onValueChange={value => {
                handleonvaluechange(value, 'Course', key);
              }}
              mode={'dropdown'}>
              <Picker.Item label={'Select Course'} value={'Select'} />
              {coursesList.map((item, key) => {
                return (
                  <Picker.Item
                    label={item.lable}
                    value={item.value}
                    key={key}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        <View style={style.cardItem}>
          <Text style={style.cardText}>Semester</Text>
          <View style={{...style.dropdownContainer, flex: 1}}>
            <Picker
              style={style.picker}
              selectedValue={getSelectedValue(key, 'Semester')}
              onValueChange={value => {
                handleonvaluechange(value, 'Semester', key);
              }}
              mode={'dropdown'}>
              <Picker.Item label={'Select Semester'} value={'Select'} />
              {semesterList.map((item, key) => {
                return (
                  <Picker.Item
                    label={item.lable}
                    value={item.value}
                    key={key}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </View>
    );
  });

  return (
    <ScrollView style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="red"
          style={{height: SCREEN_HEIGHT}}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <View style={{padding: 4}}>{newArray}</View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: SCREEN_WIDTH,
              paddingHorizontal: 18,
              padding: 10,
              alignItems: 'center',
            }}>
            <Icon
              name="minuscircle"
              size={40}
              color="#000"
              onPress={() => {
                index > -1 && removeItem();
              }}
            />
            <TouchableOpacity
              style={style.btn}
              onPress={() => fetchPerformance()}>
              <Text style={style.btnText}>Get Performance</Text>
            </TouchableOpacity>

            <Icon
              name="pluscircle"
              size={40}
              color="#000"
              onPress={() => addMore()}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: SCREEN_WIDTH,
              paddingHorizontal: 58,
              padding: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={style.btn}
              onPress={() => navigation.navigate('TeacherRating')}>
              <Text style={style.btnText}>View Best Teachers</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: SCREEN_WIDTH,
              marginTop: 10,
              marginRight: 15,
            }}>
            <PureChart
              data={perfomanceData}
              type="bar"
              height={300}
              width={SCREEN_WIDTH}
              showEvenNumberXaxisLabel={false}
            />
          </View>
          <View
            style={{
              backgroundColor: '#FFF',
              width: SCREEN_WIDTH,
              padding: 15,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {perfomanceData.map((item, key) => {
              return (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: item.color,
                      marginHorizontal: 8,
                    }}></View>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>
                    {performanceBase[key]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default TeacherPerformance;

const style = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginVertical: 5,
    width: SCREEN_WIDTH - 10,
    alignItems: 'center',
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  cardText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    marginRight: 5,
    flex: 0.5,
  },
  picker: {
    backgroundColor: '#ddd',
  },
  btn: {
    flex: 1,
    marginHorizontal: 30,
    height: 40,
    borderRadius: 7,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {fontSize: 14, color: '#FFF', fontWeight: '700'},
});
