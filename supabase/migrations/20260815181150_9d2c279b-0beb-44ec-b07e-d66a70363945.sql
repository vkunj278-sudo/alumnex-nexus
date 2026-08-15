revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

insert into public.industries (name) values
 ('Software'),('Artificial Intelligence'),('Finance'),('Consulting'),('E-commerce'),
 ('Healthcare Tech'),('Cybersecurity'),('Cloud Infrastructure'),('Education'),('Product Design');

insert into public.companies (name, industry_id, location) values
 ('Google', (select id from public.industries where name='Software'), 'Bengaluru'),
 ('Microsoft', (select id from public.industries where name='Cloud Infrastructure'), 'Hyderabad'),
 ('Amazon', (select id from public.industries where name='E-commerce'), 'Bengaluru'),
 ('TCS', (select id from public.industries where name='Consulting'), 'Mumbai'),
 ('Infosys', (select id from public.industries where name='Consulting'), 'Pune'),
 ('Flipkart', (select id from public.industries where name='E-commerce'), 'Bengaluru'),
 ('Zoho', (select id from public.industries where name='Software'), 'Chennai'),
 ('Razorpay', (select id from public.industries where name='Finance'), 'Bengaluru'),
 ('Swiggy', (select id from public.industries where name='E-commerce'), 'Bengaluru'),
 ('Freshworks', (select id from public.industries where name='Software'), 'Chennai'),
 ('Practo', (select id from public.industries where name='Healthcare Tech'), 'Bengaluru'),
 ('Wipro', (select id from public.industries where name='Consulting'), 'Bengaluru'),
 ('Adobe', (select id from public.industries where name='Product Design'), 'Noida'),
 ('Nvidia', (select id from public.industries where name='Artificial Intelligence'), 'Pune');

insert into public.skills (name, category) values
 ('Python','Programming'),('JavaScript','Programming'),('TypeScript','Programming'),('React','Frontend'),
 ('Node.js','Backend'),('Java','Programming'),('Go','Programming'),('SQL','Data'),
 ('Machine Learning','AI'),('Deep Learning','AI'),('NLP','AI'),('Computer Vision','AI'),
 ('Data Analysis','Data'),('Power BI','Data'),('AWS','Cloud'),('Azure','Cloud'),('Kubernetes','Cloud'),
 ('Docker','Cloud'),('System Design','Engineering'),('DSA','Engineering'),
 ('Product Management','Product'),('UX Research','Product'),('Figma','Design'),
 ('Cybersecurity','Security'),('Penetration Testing','Security'),('Networking','Security'),
 ('Finance Modelling','Finance'),('Public Speaking','Soft Skills'),('Leadership','Soft Skills'),('Resume Review','Soft Skills');

with names(n) as (values
 ('Aarav Menon'),('Diya Krishnan'),('Rohan Iyer'),('Ananya Deshpande'),('Kabir Sethi'),('Meera Nambiar'),
 ('Vikram Rathore'),('Sneha Pillai'),('Arjun Bhatt'),('Ishita Verma'),('Nikhil Rao'),('Tara Chandran'),
 ('Aditya Kulkarni'),('Riya Saxena'),('Manav Gokhale'),('Pooja Reddy'),('Siddharth Nair'),('Kavya Joshi'),
 ('Harsh Vardhan'),('Neha Bansal'),('Rahul Dsouza'),('Aisha Qureshi'),('Yash Agarwal'),('Shreya Mahajan'),
 ('Devansh Tiwari'),('Priya Sundaram'),('Karan Malhotra'),('Nandini Ghosh'),('Abhay Chauhan'),('Lakshmi Varma'),
 ('Rishi Kapadia'),('Simran Kaur'),('Varun Shetty'),('Anjali Mishra'),('Gaurav Patil'),('Ritika Sen')
), seq as (select n, row_number() over () i from names)
insert into public.profiles (role, full_name, headline, bio, department, graduation_year, location, company_name, company_id, designation, industry_id, years_experience, available_to_mentor, mentorship_focus, availability, visibility, is_verified, verified_at, profile_completion, onboarding_complete, engagement_score, students_helped, is_demo, avatar_url)
select 'alumni', n,
  (array['Senior Software Engineer','AI Research Engineer','Data Scientist','Product Manager','Cloud Architect','Security Engineer','Engineering Manager','Full Stack Developer'])[1+(i%8)] || ' at ' ||
  (array['Google','Microsoft','Amazon','TCS','Infosys','Flipkart','Zoho','Razorpay','Swiggy','Freshworks','Practo','Wipro','Adobe','Nvidia'])[1+(i%14)],
  'Graduated in ' || (2010 + (i%14))::text || ' and now builds large-scale systems. Mentors students on interview preparation, portfolio building and long-term career strategy.',
  (array['Computer Science','Information Technology','Electronics','Mechanical','Data Science'])[1+(i%5)],
  2010 + (i%14),
  (array['Bengaluru','Hyderabad','Pune','Chennai','Mumbai','Delhi NCR','Remote'])[1+(i%7)],
  (array['Google','Microsoft','Amazon','TCS','Infosys','Flipkart','Zoho','Razorpay','Swiggy','Freshworks','Practo','Wipro','Adobe','Nvidia'])[1+(i%14)],
  (select id from public.companies c where c.name = (array['Google','Microsoft','Amazon','TCS','Infosys','Flipkart','Zoho','Razorpay','Swiggy','Freshworks','Practo','Wipro','Adobe','Nvidia'])[1+(i%14)]),
  (array['Senior Software Engineer','AI Research Engineer','Data Scientist','Product Manager','Cloud Architect','Security Engineer','Engineering Manager','Full Stack Developer'])[1+(i%8)],
  (select id from public.industries ind where ind.name = (array['Software','Artificial Intelligence','Finance','Consulting','E-commerce','Healthcare Tech','Cybersecurity','Cloud Infrastructure','Education','Product Design'])[1+(i%10)]),
  2 + (i%14),
  (i%4) <> 0,
  string_to_array((array['Career guidance|Technical interviews','AI/ML|Research','Resume review|Career guidance','System design|Technical interviews','Product thinking|Career guidance'])[1+(i%5)], '|'),
  (array['weekends','weekdays','flexible'])[1+(i%3)],
  (array['public','students_only','public','alumni_only'])[1+(i%4)]::public.visibility_level,
  (i%5) <> 0,
  now() - ((i%90) || ' days')::interval,
  60 + (i%40),
  true,
  40 + ((i*7)%61),
  (i*3)%25,
  true,
  'https://api.dicebear.com/7.x/initials/svg?seed=' || replace(n,' ','%20')
from seq;

with names(n) as (values
 ('Aryan Kulkarni'),('Sanya Mehta'),('Dhruv Nanda'),('Ira Balan'),('Aman Trivedi'),('Zoya Sheikh'),
 ('Kunal Bose'),('Naina Rawat'),('Om Prakash Yadav'),('Tanvi Hegde'),('Vivaan Grover'),('Mira Fernandes'),
 ('Rudra Panicker'),('Ayesha Khan'),('Parth Vasani'),('Sara Thomas'),('Advait Kale'),('Juhi Chandel')
), seq as (select n, row_number() over () i from names)
insert into public.profiles (role, full_name, headline, department, graduation_year, location, career_goal, looking_for, visibility, profile_completion, onboarding_complete, is_demo, avatar_url)
select 'student', n,
  'Final-year ' || (array['Computer Science','Information Technology','Electronics','Data Science'])[1+(i%4)] || ' student',
  (array['Computer Science','Information Technology','Electronics','Data Science'])[1+(i%4)],
  2026 + (i%3),
  (array['Bengaluru','Hyderabad','Pune','Chennai','Mumbai','Delhi NCR'])[1+(i%6)],
  (array['Software Engineer','AI Engineer','Data Scientist','Product Manager','Cybersecurity','Cloud Engineer','Entrepreneur'])[1+(i%7)],
  string_to_array((array['mentorship|internships','jobs|networking','mentorship|events','internships|networking'])[1+(i%4)], '|'),
  'students_only',
  45 + (i%50),
  true, true,
  'https://api.dicebear.com/7.x/initials/svg?seed=' || replace(n,' ','%20')
from seq;

with p as (select id, row_number() over (order by created_at, id) i from public.profiles),
     s as (select id, row_number() over (order by name) j from public.skills)
insert into public.profile_skills (profile_id, skill_id)
select p.id, s.id from p join s on s.j in (1+((p.i*3)%30), 1+((p.i*5+7)%30), 1+((p.i*11+3)%30))
on conflict do nothing;

insert into public.education (profile_id, institution, degree, field, start_year, end_year)
select id, 'National Institute of Technology (Demo University)', 'B.Tech', coalesce(department,'Engineering'),
  coalesce(graduation_year,2026) - 4, coalesce(graduation_year,2026)
from public.profiles;

insert into public.employment (profile_id, company_id, company_name, title, location, start_year, is_current)
select id, company_id, company_name, designation, location, coalesce(graduation_year,2015)+1, true
from public.profiles where role='alumni';

insert into public.engagement_scores (profile_id, score, tier, last_active_at)
select id, engagement_score,
  case when engagement_score >= 70 then 'active' when engagement_score >= 45 then 'declining' else 'inactive' end,
  now() - ((engagement_score % 60) || ' days')::interval
from public.profiles where role='alumni'
on conflict (profile_id) do nothing;

with a as (select id, company_id, company_name, location, row_number() over (order by full_name) i from public.profiles where role='alumni' limit 14)
insert into public.opportunities (posted_by, title, kind, company_id, company_name, location, description, required_skills, experience_required, stipend_or_salary, apply_deadline)
select a.id,
  (array['Software Engineer I','Machine Learning Intern','Backend Engineer','Data Analyst Intern','Cloud Engineer','Security Analyst','Frontend Engineer','Product Analyst','Research Intern (NLP)','Referral: SDE-2','Full Stack Developer','DevOps Engineer','Campus Project: Smart Campus App','Associate Product Manager'])[a.i],
  (array['job','internship','job','internship','job','job','job','job','internship','referral','job','job','project','job'])[a.i]::public.opportunity_kind,
  a.company_id, a.company_name, a.location,
  'Open to graduating students and recent alumni of the institute. Posted by an alumnus so juniors get a direct path in, with screening handled through the alumni referral track.',
  string_to_array((array['Java|DSA|System Design','Python|Machine Learning|SQL','Node.js|SQL|Docker','SQL|Data Analysis|Power BI','AWS|Kubernetes|Docker','Cybersecurity|Networking|Penetration Testing','React|TypeScript|JavaScript','SQL|Product Management|Data Analysis','Python|NLP|Deep Learning','Java|System Design|DSA','React|Node.js|TypeScript','Docker|Kubernetes|AWS','React|Figma|UX Research','Product Management|UX Research|SQL'])[a.i], '|'),
  (array['0-1 years','Student','2-4 years','Student','3-5 years','1-3 years','1-3 years','0-2 years','Student','4-6 years','2-4 years','2-5 years','Student','0-2 years'])[a.i],
  (array['18-24 LPA','50,000/month','22-30 LPA','35,000/month','28-36 LPA','14-20 LPA','16-22 LPA','12-18 LPA','40,000/month','35-45 LPA','20-26 LPA','24-32 LPA','Unpaid / academic credit','18-24 LPA'])[a.i],
  (current_date + ((a.i*5) || ' days')::interval)::date
from a;

insert into public.events (title, description, starts_at, location, mode, host_profile_id, capacity)
select t.title, t.descr, now() + (t.days || ' days')::interval, t.loc, t.mode,
  (select id from public.profiles where role='alumni' order by full_name limit 1 offset t.off), t.cap
from (values
 ('AI Alumni Summit 2026','A full-day summit where alumni working in AI share what the field actually demands from new graduates.',18,'Bengaluru','In-person',0,250),
 ('Mock Technical Interview Marathon','Senior alumni run back-to-back mock interviews with live feedback for final-year students.',7,'Online','Virtual',1,120),
 ('Product Management Career Clinic','Alumni PMs break down how to switch into product from an engineering background.',25,'Online','Virtual',2,80),
 ('Annual Alumni Homecoming','Batch reunions, campus tours and the institutional impact report for the year.',60,'Campus','In-person',3,600),
 ('Startup Founders Fireside','Alumni founders on fundraising, first hires and building from a tier-2 city.',33,'Hyderabad','Hybrid',4,150)
) as t(title, descr, days, loc, mode, off, cap);

insert into public.communities (name, description, category, created_by)
select c.name, c.descr, c.cat, (select id from public.profiles where role='alumni' order by full_name limit 1 offset c.off)
from (values
 ('AI & Machine Learning Guild','Papers, projects and hiring signals for anyone serious about ML.','Technology',0),
 ('Product & Design Circle','Portfolio reviews and product teardowns run by alumni PMs and designers.','Product',1),
 ('Cloud & DevOps Network','Certifications, architecture debates and referral drops.','Technology',2),
 ('Founders & Entrepreneurs','Alumni founders and student builders swapping notes.','Entrepreneurship',3),
 ('Higher Studies Abroad','Applications, SOPs and funding for MS and PhD aspirants.','Academics',4)
) as c(name, descr, cat, off);

insert into public.donations (campaign, donor_profile_id, amount, is_anonymous)
select d.campaign, (select id from public.profiles where role='alumni' order by full_name limit 1 offset d.off), d.amt, false
from (values
 ('Student Scholarship Fund',0,250000),('Student Scholarship Fund',1,120000),('Campus AI Lab',2,500000),
 ('Campus AI Lab',3,300000),('Sports Complex Upgrade',4,175000),('Student Scholarship Fund',5,90000),
 ('Innovation Grant',6,220000),('Innovation Grant',7,140000)
) as d(campaign, off, amt);

insert into public.verifications (profile_id, method, status, notes)
select id, 'institution_records', 'verified', 'Matched against demo institutional records.'
from public.profiles where role='alumni' and is_verified;