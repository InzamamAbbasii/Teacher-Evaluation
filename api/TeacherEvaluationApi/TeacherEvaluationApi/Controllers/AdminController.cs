
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
    }
}
