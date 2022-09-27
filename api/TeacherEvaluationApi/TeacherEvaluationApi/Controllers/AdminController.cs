
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TeacherEvaluationApi.Models;
namespace TeacherEvaluationApi.Controllers
{
   
    public class AdminController : ApiController
    {
        BiitDBNewEntities db = new BiitDBNewEntities();
        [HttpPost]
        public HttpResponseMessage AddSingleQuestion(Templeate quest)
        {
            try
            {
                //List<Templeate> QuestionAdd = new List<Templeate>();
                //QuestionAdd.Add(new Templeate
                //{
                //    QuestionName = quest.QuestionName,
                //    Semester = quest.Semester
                //});
                db.Templeates.Add(quest);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "success");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpPost]
        [Route("api/Login/add")]

        public HttpResponseMessage AddQuestions(Templeate[] quest)
        {
            try
            {
                using (var temp = new BiitDBNewEntities())
                {
                    foreach (Templeate c in quest)
                    {
                        temp.Templeates.Add(c);
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


        //[HttpPost]
        //[Route("api/Login/add")]

        //public HttpResponseMessage AddQuestions([FromBody] Templeate[] quest)
        //{
        //    try
        //    {


        //        using (var temp = new BiitDBNewEntities())
        //        {
        //            foreach (Templeate c in quest)
        //            {
        //                temp.Templeates.Add(c);
        //            }
        //            int n = temp.SaveChanges();
        //            return Request.CreateResponse(HttpStatusCode.Created, n);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
        //    }
        //}
        [HttpPost]
        [Route("api/Login/admin")]
        public HttpResponseMessage AdminLogin(Log_In log)
        {
            try
            {
                var AdminFound = db.Log_In.FirstOrDefault(s => s.User_type == log.User_type && s.User_id == log.User_id && s.User_password == log.User_password);
                if (AdminFound == null)
                    return Request.CreateResponse(HttpStatusCode.NotFound, "incoreect Creddiatenals");

                return Request.CreateResponse(HttpStatusCode.OK, new { AdminFound.User_type, AdminFound.User_name });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }



        [Route("api/admin/AddTemplate")]
        [HttpPost]
        public HttpResponseMessage AddTemplate(TemplateGraph[] tmp)
        {
            try
            {
                using (var te = new BiitDBNewEntities())
                {
                    foreach (TemplateGraph c in tmp)
                    {
                        te.TemplateGraphs.Add(c);
                    }
                    int n = te.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Saved");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [Route("api/admin/GetTemplateByName/{name}")]
        [HttpGet]
        public HttpResponseMessage GetTemplateByName(string name)
        {
            try
            {
                var TemplateList = db.TemplateGraphs.Select(s => new
                {
                    TeacherName = s.TeacherName,
                    CourseName = s.CourseName,
                    SemesterNo = s.SemesterNo,
                    Templatename = s.TempleteName

                }).Where(x => x.Templatename == name).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, TemplateList);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [Route("api/admin/GetAllGraphTemplate")]
        [HttpGet]
        public HttpResponseMessage GetAllGraphTemplate()
        {
            try
            {
                var TemplateList = db.TemplateGraphs.GroupBy(g => g.TempleteName).Select(item => new
                {
                    item.Key,
                    item
                });
                return Request.CreateResponse(HttpStatusCode.OK, TemplateList);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

    }
}
