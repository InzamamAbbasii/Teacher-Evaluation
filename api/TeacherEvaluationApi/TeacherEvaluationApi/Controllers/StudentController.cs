using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TeacherEvaluationApi.Models;
namespace TeacherEvaluationApi.Controllers
{
    public class StudentController : ApiController
    {

        BiitDBNewEntities db = new BiitDBNewEntities();

        [HttpGet]
        public HttpResponseMessage Login(string name, string pass)
        {
            try
            {

                var query = db.STMTRs.FirstOrDefault(u => u.Reg_No == name && u.Password == pass);
                    if (query != null)
                    {

                    var obj = new {
                        Reg_No = query.Reg_No,
                        Name =  query.St_firstname+" "+query.St_middlename+" "+query.St_lastname,
                        Program = query.Final_course,
                        Semester=query.Semester_no,
                    };
               
                    return Request.CreateResponse(HttpStatusCode.OK, obj);
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.NotFound, "Invalid username or password.");
                    }  
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetQuestions(string reg_no, string emp_no, string course_no)
        {
            try
            {
                var evaluatd_questionList = db.Questions.Join(db.Evals,
                                             q => q.Question_ID,
                                             e => e.Question_Desc,
                                             (q, e) => new { q, e }
                                           ).Where(w=> w.e.Reg_No == reg_no && w.e.Emp_no==emp_no  && w.e.Course_no==course_no).Select(s => new
                {
                    Question_ID = s.q.Question_ID,
                    Question1 = s.q.Question1,
                    Description = s.q.Description,
                    Selected = s.e.Answer_Desc,
                }).ToList();
               
                if(evaluatd_questionList.Count>0)
                     return Request.CreateResponse(HttpStatusCode.OK, evaluatd_questionList);
                else
                {
                    var questionList = db.Questions.Select(s => new
                    {
                        Question_ID = s.Question_ID,
                        Question1 = s.Question1,
                        Description = s.Description,
                        Selected = "",
                    }).ToList();
                     return Request.CreateResponse(HttpStatusCode.OK, questionList);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
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
                    Question1 = s.Question1,
                    Description = s.Description,
                }).ToList(); ;
                return Request.CreateResponse(HttpStatusCode.OK, questionList);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [Route("api/student/GetCourses/{regno}/{year}")]
        [HttpGet]
        public IHttpActionResult GetCourses(string regno, string year)
        {
            try
            {
                var course = (from c in db.Crsdtls
                              join d in db.CRSMTRs on c.SOS equals d.SOS
                              join e in db.EMPMTRs on c.Emp_no equals e.Emp_no
                              where c.REG_NO == regno && c.SEMESTER_NO == year && c.DISCIPLINE == d.Discipline && c.Course_no == d.Course_no
                              select new
                              {
                                  c.Course_no,
                                  d.Course_desc,
                                  c.DISCIPLINE,
                                  c.SECTION,
                                  c.SEMESTER_NO,
                                  e.Emp_firstname,
                                  e.Emp_lastname,
                                  e.Emp_no,
                                  Eval_Status = db.Evals.Any(w => w.Emp_no == e.Emp_no && c.Course_no == c.Course_no && w.Reg_No == regno)
                              });
                return Json(course);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage getCurrentSemesterCources2(String regno)
        {
            try
            {
                var result = db.STMTRs.FirstOrDefault(s => s.Reg_No == regno);
                if (result != null)
                {
                    var list1 = db.Crsdtls.Join(db.CRSMTRs,
                                               a => a.Course_no,
                                               b => b.Course_no,
                                               (a, b) => new { a, b }
                                               ).Where(w => w.a.REG_NO == regno && w.b.SOS == w.a.SOS
                                                       && w.b.Discipline == w.a.DISCIPLINE &&
                                                       (w.a.DT!=null)
                                               ).Select(s => new
                                               {
                                                   Std_Name = result.St_firstname + " " + result.St_middlename + " " + result.St_lastname,
                                                   Course_no = s.a.Course_no,
                                                   REG_No = s.a.REG_NO,
                                                   Emp_no = s.a.Emp_no,
                                                   SEMESTER_NO = s.a.SEMESTER_NO,
                                                   SECTION = s.a.SECTION,
                                                   DISCIPLINE = s.a.DISCIPLINE,
                                                   Course_desc = s.b.Course_desc,
                                                   Eval_Status= db.Evals.Any(w=>w.Emp_no==s.a.Emp_no && w.Course_no== s.a.Course_no && w.Reg_No==regno)
                                               });


                    return Request.CreateResponse(HttpStatusCode.OK, list1);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "User Not Exist");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }



        [HttpGet]
        public HttpResponseMessage getCurrentSemesterCources1(String regno)
        {
            try
            {
                var currentSemester = db.SEMMTRs.OrderByDescending(s => s.Start_date).Select(s => new { s.Semester_no }).Take(3).ToList();
                string currentSemster1 = currentSemester.FirstOrDefault().Semester_no.ToString();
                string currentSemster2 = currentSemester.LastOrDefault().Semester_no.ToString();
                var sems1 = db.Crsdtls.Where(w=>w.REG_NO==regno).OrderByDescending(o=>o.SEMESTER_NO).Select(s=>new {s.SEMESTER_NO}).ToList();
                var sems = db.Crsdtls.Where(w => w.REG_NO == regno && w.DT!=null).Select(s => new { s.SEMESTER_NO }).ToList();


                var result = db.STMTRs.FirstOrDefault(s => s.Reg_No == regno);
                if (result != null)
                {
                    var list1 = db.Crsdtls.Join(db.CRSMTRs,
                                               a => a.Course_no,
                                               b => b.Course_no,
                                               (a, b) => new { a, b }
                                               ).Where(w => w.a.REG_NO == regno && w.b.SOS == w.a.SOS
                                                       && w.b.Discipline == w.a.DISCIPLINE &&
                                                       (w.a.SEMESTER_NO == currentSemster1 || w.a.SEMESTER_NO == currentSemster2)
                                               ).Select(s => new
                                               {
                                                   Std_Name = result.St_firstname + " " + result.St_middlename + " " + result.St_lastname,
                                                   Course_no = s.a.Course_no,
                                                   REG_No = s.a.REG_NO,
                                                   Emp_no = s.a.Emp_no,
                                                   SEMESTER_NO = s.a.SEMESTER_NO,
                                                   SECTION = s.a.SECTION,
                                                   DISCIPLINE = s.a.DISCIPLINE,
                                                   Course_desc = s.b.Course_desc,
                                               }).ToList().GroupBy(g => g.Course_no);
                    var unique = list1.Select(s => s.FirstOrDefault()).ToList();
                    var result1 = unique.Where(p => sems.Any(p2 => p2.SEMESTER_NO == p.SEMESTER_NO));

                    return Request.CreateResponse(HttpStatusCode.OK, result1);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "User Not Exist");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        public HttpResponseMessage getCurrentSemesterCources(String regno)
        {
            try
            {
                var currentSemester = db.SEMMTRs.OrderByDescending(s => s.Start_date).Select(s => new { s.Semester_no }).Take(2).ToList();
                string currentSemster1 = currentSemester.FirstOrDefault().Semester_no.ToString();
                string currentSemster2 = currentSemester.LastOrDefault().Semester_no.ToString();
                var result = db.STMTRs.FirstOrDefault(s => s.Reg_No == regno);
                if (result != null)
                {
                    var list1 = db.Crsdtls.Join(db.CRSMTRs,
                                               a => a.Course_no,
                                               b => b.Course_no,
                                               (a, b) => new { a, b }
                                               ).Where(w => w.a.REG_NO == regno && w.b.SOS == w.a.SOS
                                                       && w.b.Discipline == w.a.DISCIPLINE &&
                                                       (w.a.SEMESTER_NO == currentSemster1 || w.a.SEMESTER_NO == currentSemster2)
                                               ).Select(s => new
                                               {
                                                   Std_Name = result.St_firstname + " " + result.St_middlename + " " + result.St_lastname,
                                                   Course_no = s.a.Course_no,
                                                   REG_No = s.a.REG_NO,
                                                   Emp_no = s.a.Emp_no,
                                                   SEMESTER_NO = s.a.SEMESTER_NO,
                                                   SECTION = s.a.SECTION,
                                                   DISCIPLINE = s.a.DISCIPLINE,
                                                   Course_desc = s.b.Course_desc,
                                               }).ToList().GroupBy(g => g.Course_no);
                    var unique = list1.Select(s => s.FirstOrDefault()).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, unique);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "User Not Exist");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }


        //store student evaluation
        [HttpPost]
        public HttpResponseMessage addStdEvaluation1(Eval [] evals)
        {
            try
            {
                using (var temp = new BiitDBNewEntities())
                {
                    foreach (Eval c in evals)
                    {
                        temp.Evals.Add(c);
                    }
                    int n = temp.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Saved");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public HttpResponseMessage addStdEvaluation(Eval obj)
        {
            try
            {
                db.Evals.Add(obj);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Submitted Successfully!");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpGet]
        public HttpResponseMessage getteacherbycourse(string empno)
        {
            try
            {
                var teacherInfo = db.EMPMTRs.Where(w => w.Emp_no == empno);
                return Request.CreateResponse(HttpStatusCode.OK, teacherInfo);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        public HttpResponseMessage getStdEvaluation(string reg_no,string emp_no,string course_no)
        {
            try
            {
                var evaldata = db.Evals.Where(w => w.Reg_No == reg_no && w.Emp_no == emp_no && w.Course_no == course_no).Select(s => new
                {
                    s.Id,s.Emp_no,s.Reg_No,s.Course_no,s.Discipline,s.Semester_no,s.Question_Desc,s.Answer_Desc,s.Answer_Marks
                });
                return Request.CreateResponse(HttpStatusCode.OK, evaldata);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}
