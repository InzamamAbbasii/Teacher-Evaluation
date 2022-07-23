import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';

const StudentCourses = ({route, navigation}) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCourses([]);
      getCourses();
    });
    return unsubscribe;
  }, [navigation]);

  const getCourses = () => {
    // var URL = `http://${ip}/TeacherEvaluationApi/api/Student/getCurrentSemesterCources2?regno=${route.params.Reg_No}`;
    var URL = `http://${ip}/TeacherEvaluationApi/api/student/GetCourses/${route.params.Reg_No}/2021FM`;
    fetch(URL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          console.log(response);
          // setCourses(response);
          response.forEach(element => {
            var URL1 = `http://${ip}/TeacherEvaluationApi/api/Student/getteacherbycourse?empno=${element.Emp_no}`;
            fetch(URL1, {
              method: 'GET',
            })
              .then(response => response.json())
              .then(response => {
                console.log(response);
                response.forEach(element1 => {
                  setCourses(data => [
                    ...data,
                    {
                      Course_no: element.Course_no,
                      Course_desc: element.Course_desc,
                      Emp_Name:
                        element1.Emp_firstname +
                        ' ' +
                        element1.Emp_middle +
                        ' ' +
                        element1.Emp_lastname,
                      Emp_no: element.Emp_no,
                      SEMESTER_NO: element.SEMESTER_NO,
                      Eval_Status: element.Eval_Status,
                    },
                  ]);
                });
              })
              .catch(error => {
                console.log(error);
              });
          });
        } else {
          alert('No course found');
        }
      })
      .catch(error => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          paddingHorizontal: 15,
          backgroundColor: '#000',
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 20, color: '#FFF', flex: 1}}>
            Sems : {route.params.Semester}
          </Text>
          <Text style={{fontSize: 20, color: '#FFF', flex: 1}}>
            Program : {route.params.Program}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 20, color: '#FFF', flex: 1, flex: 1}}>
            {route.params.Reg_No}
          </Text>
          <Text style={{fontSize: 20, color: '#FFF', flex: 1, flex: 1}}>
            {route.params.Name}
          </Text>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{padding: 7}}
        data={courses}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <View style={styles.card}>
              <Text style={{fontSize: 20, color: '#eee'}}>
                Course_Code:{item.Course_no}
              </Text>
              <Text style={{fontSize: 20, color: '#eee'}}>
                SEMESTER_NO:{item.SEMESTER_NO}
              </Text>
              <Text style={{fontSize: 20, color: '#eee'}}>Course_Name:</Text>
              <Text style={{fontSize: 20, color: '#eee', marginLeft: 10}}>
                {item.Course_desc.toString().replace(/\s+/g, ' ')}
              </Text>
              <Text style={{fontSize: 20, color: '#eee'}}>
                Teacher Name:{item.Emp_Name.toString().replace(/\s+/g, ' ')}
              </Text>
              {item.Eval_Status ? (
                <TouchableOpacity
                  // disabled={true}
                  onPress={() =>
                    navigation.navigate('StudentEvaluation', {
                      Emp_No: item.Emp_no,
                      Emp_Name: item.Emp_Name,
                      Reg_No: route.params.Reg_No,
                      Name: route.params.Name,
                      Course_No: item.Course_no,
                      Discipline: route.params.Program,
                      Semester_No: item.SEMESTER_NO,
                      Status: 'View',
                    })
                  }
                  style={{...styles.btn}}>
                  <Text style={styles.btnText}>View</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('StudentEvaluation', {
                      Emp_No: item.Emp_no,
                      Emp_Name: item.Emp_Name,
                      Reg_No: route.params.Reg_No,
                      Name: route.params.Name,
                      Course_No: item.Course_no,
                      Discipline: route.params.Program,
                      Semester_No: item.SEMESTER_NO,
                      Status: 'Evaluate',
                    })
                  }
                  style={styles.btn}>
                  <Text style={styles.btnText}>Evaluate</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  head: {
    // minHeight: 40,
    backgroundColor: 'pink',
  },
  text: {margin: 6},
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  btn: {
    backgroundColor: 'green',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  btnText: {textAlign: 'center', color: '#fff'},
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#000',
    shadowColor: '#fff',
    shadowOffset: {
      width: 10,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
});

export default StudentCourses;
