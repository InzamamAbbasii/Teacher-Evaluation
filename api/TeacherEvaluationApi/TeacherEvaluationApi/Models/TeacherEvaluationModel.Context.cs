﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TeacherEvaluationApi.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class BiitDBNewEntities : DbContext
    {
        public BiitDBNewEntities()
            : base("name=BiitDBNewEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Accgpa> Accgpas { get; set; }
        public virtual DbSet<ALLOCATE> ALLOCATEs { get; set; }
        public virtual DbSet<Applicant> Applicants { get; set; }
        public virtual DbSet<Crsdtl> Crsdtls { get; set; }
        public virtual DbSet<CRSMTR> CRSMTRs { get; set; }
        public virtual DbSet<CrsmtrShort> CrsmtrShorts { get; set; }
        public virtual DbSet<EMPMTR> EMPMTRs { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<SEMMTR> SEMMTRs { get; set; }
        public virtual DbSet<STMTR> STMTRs { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<Log_In> Log_In { get; set; }
        public virtual DbSet<Eval> Evals { get; set; }
        public virtual DbSet<Templeate> Templeates { get; set; }
    }
}
