using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using TeacherEvaluationApi.Models;
namespace TeacherEvaluationApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DirectorController : ApiController
    {
        BiitDBNewEntities db = new BiitDBNewEntities();

        [HttpPost]
        [Route("api/Director/getAverage1")]
        public HttpResponseMessage getAverage1(Eval [] eval)
        {
            try
            {
                List<dynamic> lst = new List<dynamic>();
                foreach (var item in eval)
                { 
                    var employees = db.Evals.Where(w => w.Emp_no == item.Emp_no && w.Course_no == item.Course_no && w.Semester_no == item.Semester_no)
                        .Select(x => new
                        {
                            x.Emp_no,
                            x.Reg_No,
                            x.Course_no,
                            x.Question_Desc,
                            x.Semester_no,
                            x.Answer_Marks,
                            x.Answer_Desc
                        });

                    var data = employees.GroupBy(m => m.Question_Desc).Select(x => new
                    {
                        Emp_no = x.FirstOrDefault().Emp_no,
                        Question_Desc = x.Key,
                        QuestionCount = x.Count(),
                        AverageMarks = x.Average(y => y.Answer_Marks)
                    }).ToList();
                    //if (data.Count() == 0)
                    //{
                    //    List<dynamic> emptyList = new List<dynamic>();
                    //    return Request.CreateResponse(HttpStatusCode.OK,emptyList );
                    //}
                    lst.Add(data);
                }
               
                return Request.CreateResponse(HttpStatusCode.OK,lst);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("api/Director/getAverage")]
        public HttpResponseMessage getAverage()
        {
            try
            {
                var res = db.Evals.Where(w => w.Emp_no == "BIIT361" && w.Course_no == "CS-497" && w.Semester_no == "2021FM");
                var employees = db.Evals.Where(w => w.Emp_no == "BIIT361" && w.Course_no == "CS-497" && w.Semester_no == "2021FM")
                    .Select(x => new
                    {
                     x.Emp_no,
                        x.Reg_No,
                        x.Course_no,
                        x.Question_Desc,
                        x.Semester_no,x.Answer_Marks,x.Answer_Desc
                    });

                var data = employees.GroupBy(m => m.Question_Desc).Select(x => new 
                {
                    Emp_no = x.FirstOrDefault().Emp_no,
                    Question_Desc = x.Key,
                    QuestionCount = x.Count(),
                    AverageMarks = x.Average(y => y.Answer_Marks)
                }).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("api/Director/get_Teachers_Course_Semester_Lists")]
        public HttpResponseMessage get_Teachers_Course_Semester_Lists()
        {
            try
            {
                var teachersList = db.EMPMTRs.Where(w => w.Emp_no != "" && w.Status!="LEFT").Select(s => new
                {
                    s.Emp_no,
                    Name= s.Emp_firstname+" "+s.Emp_middle+" "+s.Emp_lastname
                }).OrderBy(o => o.Name);
  
                var coursesList = db.CrsmtrShorts.Select(s => new
                {
                    s.Course_No,
                    s.Course_Desc,s.Title
                }).OrderBy(o => o.Title);
                var semesterList = db.SEMMTRs.Select(s => new
                {
                    s.Semester_no,
                    s.Semester_desc
                }).OrderByDescending(o=>o.Semester_no);
                var obj = new
                {
                    teachersList,
                    coursesList,
                    semesterList
                };
                return Request.CreateResponse(HttpStatusCode.OK, obj);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        public string getEmployeeName(string empno)
        {
          var data=  db.EMPMTRs.FirstOrDefault(w => w.Emp_no == empno);
            var name = data.Emp_firstname;
            return "Ali";

        }
        [HttpGet]
        public HttpResponseMessage getTopRatedTeachers(int question_no)
        {
            try
            {
                var res = db.Evals.Where(w => w.Question_Desc==question_no);

                var data = res.GroupBy(m => m.Emp_no).Select(x => new
                {
                    Emp_name = db.EMPMTRs.Select(s=>new {Name = s.Emp_firstname + " " + s.Emp_middle + " " + s.Emp_lastname,Emp_no=s.Emp_no }).FirstOrDefault(w => w.Emp_no == x.Key).Name,
                    Emp_no = x.Key,
                    Question_Count = x.Count(),
                    Rating = x.Average(y => y.Answer_Marks)
                }).OrderByDescending(o=>o.Rating).Take(3).ToList(); //change OrderByDescending to OrderBy to show less rated teachers
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetQuestions()
        {
            try
            {
                var questionList = db.Questions.Select(s => new
                {
                    Question_ID = s.Question_ID,
                }).ToList(); 
                return Request.CreateResponse(HttpStatusCode.OK, questionList);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}
