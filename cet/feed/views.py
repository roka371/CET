import datetime
import re
from urlparse import urlparse, parse_qs
import decimal
import math

from django import template
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect, render, get_object_or_404
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth import *
from django.core.management import call_command
from django.db import connection
from django.db.models import Q
from django.core.files.images import ImageFile
from feed.models import *

from feed.forms import *

# Create sample data in the database
def create_sample_data(request):
	# Connect to db
	cursor = connection.cursor()
	cursor.execute("DROP DATABASE cet")
	cursor.execute("CREATE DATABASE cet")
	cursor.execute("USE cet")
	
	# Create the tables in the database
	call_command('syncdb', interactive=True)
	
	# Create the first user
	u1 = User.objects.create_user('rnanda1243@gmail.com', 'Ego371!')
	
	# Set the first name and last name separately. 
	u1.first_name = 'Rachit'
	u1.last_name = 'Nanda'

	# Additional info about Rachit
	u1.about = 'Hi. I\'m Rachit. I should probably put something like Lorem Ipsum here but I don\'t know what to do.'
	u1.description = 'Rachit Nanda is a second-year Mechanical Engineering student at UC Berkeley. Rachit is from Houston, Texas and has also lived in New Delhi, India where he was born. He has a decade of experience in computer programming, mostly in .NET and Java. He has designed several apps for companies in the Oil and Gas industry. He was an intern in the software engineering department of Weatherford International during the summer of 2012, where he designed several apps using C#. Recently, he has been working on back-end engineering and business strategy for Ego. His interests include algorithm design, entrepreneurship, astronomy, and product design.'
	u1.twitter_username = 'rachitnanda'
	u1.facebook = 'https://www.facebook.com/rachitnanda'
	u1.website = 'egodecal.com'
	u1.linkedin = 'http://www.linkedin.com/profile/view?id=229508260'

	u1.affiliation = 0
	u1.background = 0
	
	u1.save()
	
	# Add skills for Rachit
	u1skills = 'c++;php;python;django'
	u1skills = u1skills.split(';')
	
	for my_skill in u1skills:
		s = Skill(user = u1, skill = my_skill)
		s.save()
	
	# Add interests for Rachit
	u1interests = 'arrested development;psych;contract;michael;me'
	u1interests = u1interests.split(';')
	
	for my_interest in u1interests:
		i = Interest(user = u1, interest = my_interest)
		i.save()


	# Create the second user
	u2 = User.objects.create_user('abhi.kalakuntla@gmail.com', 'Ego371!')
	
	# Set the first name and last name separately. 
	u2.first_name = 'Abhi'
	u2.last_name = 'Kalakuntla'
	
	# Add personal data for Abhi
	u2.about = 'Hi. I\'m Abhi. The person writing this is tired. Okay. Now there\'s data! Yay!'
	u2.description = 'Abhinav Kalakuntla is a second-year at UC Berkeley. He plans on double majoring in molecular cell biology and computer science. He has lived in India, and has been living in Bay Area since 1999. He has 4 years of experience in Computer Science, and is proficient in Java, C++, Python, and PHP. He is also currently learning node.js and JavaScript. Abhi has worked in robotics, by competing in Vex Robotics competition and more recently at UC Berkeley\'s Gallant Laboratory. Over there he has used his computer science skills to build a robot that can be driven from a remote location and has also built software to filter MRI data for analysis. Right now, he is working on the backend algorithms to help run Ego. His other hobbies are hiking, learning German, computer hardware and product design.'
	u2.twitter_username = 'abhi'
	u2.facebook = 'https://www.facebook.com/abhi.kalakuntla'
	u2.website = 'egodecal.com'
	u2.linkedin = 'http://www.linkedin.com/profile/view?id=229536144'

	u2.affiliation = 0
	u2.background = 0
	
	u2.save()
	
	# Add skills for Abhi
	u2skills = 'c+something;the dark side;php;codeigniter'
	u2skills = u2skills.split(';')
	
	for my_skill in u2skills:
		s = Skill(user = u2, skill = my_skill)
		s.save()
	
	# Add interests for Abhi
	u2interests = 'these;are;my;interests'
	u2interests = u2interests.split(';')
	
	for my_interest in u2interests:
		i = Interest(user = u2, interest = my_interest)
		i.save()
	
	# Create the third user
	u3 = User.objects.create_user('roka371@gmail.com', 'Ego371!')
	
	# Set the first name and last name separately. 
	u3.first_name = 'Shawn'
	u3.last_name = 'Park'
	
	
	# Add personal data for Shawn
	u3.about = 'Hi. I\'m Shawn. More stuff about shawn goes here.'
	u3.description = 'I am Shawn Park, a co-founder of Ego, a UI guru, a K-pop maniac, and a critical narcissist. I love my UI designs, which I call an embodiment of myself, but at the same time I don\'t hesitate to tear them down. The moment I hate the most is when I scrap my design that I have worked on for weeks, but it eventually becomes the moment I love when it opens up to a whole new world of design. (which might be scrapped some time later to pave way for others.) Aside from design, I spend my time with friends, listening to music and singing, and contemplating.'
	u3.twitter_username = 'abhi'
	u3.facebook = 'https://www.facebook.com/rokaiam'
	u3.website = 'egodecal.com'
	u3.linkedin = 'http://www.linkedin.com/profile/view?id=183103635'

	u3.affiliation = 0
	u3.background = 0
	
	u3.save()
	
	# Add skills for Shawn
	u3skills = 'php;django;candy making;codeigniter'
	u3skills = u3skills.split(';')
	
	for my_skill in u3skills:
		s = Skill(user = u3, skill = my_skill)
		s.save()
	
	# Add interests for Abhi
	u3interests = 'candy crush saga;android;steve jobs;ego'
	u3interests = u3interests.split(';')
	
	for my_interest in u3interests:
		i = Interest(user = u3, interest = my_interest)
		i.save()
	
	# Create a company
	c = Company(company_creator = u1, company_name = "Ego", company_founded_year = 2011, company_description = "Ego is a personalized news community that allows users to receive and discuss information related to their interests. Receiving information related to your interest is easier than ever, as you can subscribe to any keyword and receive a news feed based on it, instead of visiting numerous websites individually. Users can also discuss their interest with other people by sharing thoughts about the articles they receive on Ego, adding an additional layer of community across their internet activities. Eventually, this will change the way we use the Internet, from ?visiting websites? to ?receiving feeds? to receive information about our interests.", company_website = "egodecal.com", company_demo = "http://www.youtube.com/embed/G2CpulLWeyo")
	c.save()
	#create a test canvas for example company
	testCanvasPartner = CompanyCanvasItem(company = c, companycanvas_item = "testPartner", companycanvas_type = 0) 
	testCanvasPartner.save()
	testCanvasActivity = CompanyCanvasItem(company = c, companycanvas_item = "testActivity", companycanvas_type = 1) 
	testCanvasActivity.save()
	testCanvasResource = CompanyCanvasItem(company = c, companycanvas_item = "testResource", companycanvas_type = 2) 
	testCanvasResource.save()
	testCanvasValue = CompanyCanvasItem(company = c, companycanvas_item = "testValue", companycanvas_type = 3) 
	testCanvasValue.save()
	testCanvasCustomer = CompanyCanvasItem(company = c, companycanvas_item = "testCustomer", companycanvas_type = 4) 
	testCanvasCustomer.save()
	testCanvasRelationship = CompanyCanvasItem(company = c, companycanvas_item = "testRelationship", companycanvas_type = 5) 
	testCanvasRelationship.save()
	testCanvasChannel = CompanyCanvasItem(company = c, companycanvas_item = "testChannel", companycanvas_type = 6) 
	testCanvasChannel.save()
	testCanvasCosts = CompanyCanvasItem(company = c, companycanvas_item = "testCosts", companycanvas_type = 7) 
	testCanvasCosts.save()
	testCanvasRevenue = CompanyCanvasItem(company = c, companycanvas_item = "testRevenue", companycanvas_type = 8) 
	testCanvasRevenue.save()
	
	
	
	company_tags = "Journalism;News;Web Syndication;Social Network;Opinion;Media;Feeds"
	company_tags = company_tags.split(';')
	for tag in company_tags:
		s = CompanyTag(company = c, companytag_tag = tag)
		s.save()
	
	# Create the first company member (Rachit)
	cm1 = CompanyMember(company = c, companymember_name = u1.get_full_name(), companymember_position = "Engineer and Founder", companymember_description = "Rachit Nanda is a second-year Mechanical Engineering student at UC Berkeley. Rachit is from Houston, Texas and has also lived in New Delhi, India where he was born. He has a decade of experience in computer programming, mostly in .NET and Java. He has designed several apps for companies in the Oil and Gas industry. He was an intern in the software engineering department of Weatherford International during the summer of 2012, where he designed several apps using C#. Recently, he has been working on back-end engineering and business strategy for Ego. His interests include algorithm design, entrepreneurship, astronomy, and product design.", companymember_profile = u1)
	
	cm1.save()
	
	# Create the second company member (Abhi)
	cm2 = CompanyMember(company = c, companymember_name = u2.get_full_name(), companymember_position = "Engineer and Founder", companymember_description = "Abhinav Kalakuntla is a second-year at UC Berkeley. He plans on double majoring in molecular cell biology and computer science. He has lived in India, and has been living in Bay Area since 1999. He has 4 years of experience in Computer Science, and is proficient in Java, C++, Python, and PHP. He is also currently learning node.js and JavaScript. Abhi has worked in robotics, by competing in Vex Robotics competition and more recently at UC Berkeley's Gallant Laboratory. Over there he has used his computer science skills to build a robot that can be driven from a remote location and has also built software to filter MRI data for analysis. Right now, he is working on the backend algorithms to help run Ego. His other hobbies are hiking, learning German, computer hardware and product design.", companymember_profile = u2)
	
	cm2.save()
	# Create a connection between Rachit and Ego
	u_conn = UserConnection(userconnection_follower = u1, userconnection_target_company = c)
	u_conn.save()
	
	# Create education 1 for Rachit
	u1Edu1 = Education(user = u1, education_school = "University of California, Berkeley", education_major = "Mechanical Engineering", education_gradyear = 2015, education_courses = "ME 40: Thermodynamics;ME 85: Statics;ME 132: Dynamic Systems and Feedback;ME 104: Dynamics;ME108: Mechanics of Materials;E 177: Advanced Programming in MATLAB")
	
	# Save education 1 for Rachit
	u1Edu1.save()
	
	# Create education 2 for Rachit
	u1Edu2 = Education(user = u1, education_school = "University of California, LA", education_major = "Civil Engineering", education_gradyear = 2016, education_courses = "ME 40: Thermodynamics;ME 85: Statics;ME 132: Dynamic Systems and Feedback;ME 104: Dynamics")
	
	# Save education 2 for Rachit
	u1Edu2.save()
	
	# Create education 1 for Abhi
	u2Edu1 = Education(user = u2, education_school = "University of California, Berkeley", education_major = "Computer Science", education_gradyear = 2015, education_courses = "CS 61A;CS 61B;CS 61C;CS 70")
	
	# Save education 1 for Abhi
	u2Edu1.save()
	
	# Create job 1 for Rachit
	u1Job1 = Job(user = u1, job_company = "Weatherford", job_position = "Software Intern", job_description = "I made stuffs and things. That is it.", job_start_month = 6, job_start_year = 2012, job_end_month = 8, job_end_year = 2012)
	
	# Save job 1 for Rachit
	u1Job1.save()
	
	# Create job 2 for Rachit
	u1Job2 = Job(user = u1, job_company = "Ego", job_position = "Engineer and Founder", job_description = "I made a website. It's awesome.", job_start_month = 8, job_start_year = 2011, job_end_month = 12, job_end_year = 2099)
	
	# Save job 2 for Rachit
	u1Job2.save()
	
	# Create job 1 for Abhi
	u2Job1 = Job(user = u2, job_company = "Ego", job_position = "Engineerz and Founder", job_description = "I made a website too! It's awesome.", job_start_month = 8, job_start_year = 2011, job_end_month = 12, job_end_year = 2099)
	
	# Save job 1 for Abhi
	u2Job1.save()
	
	# Create project for Rachit
	u1Proj = Project(user = u1, project_name = "InfoGraph", project_position = "Backend coder", project_description = "Awesome project with many twists and turns", project_start_month = 11, project_start_year = 2012, project_end_month = 12, project_end_year = 2012)
	
	u1Proj.save()
	
	for i in range(5):
		txtPost1 = Post()
		txtPost1.post_author = u1
		txtPost1.post_type = Post.TEXT_POST
		txtPost1.post_title = "Mobile Miscellany: week of January 28th, 2013"
		txtPost1.post_content = "xyxyxyxyxyxyx" + str(i)
		txtPost1.post_link = "http://www.egodecal.com"
		txtPost1.post_popularity = 0
		txtPost1.save()
		for j in range(4):
			tag = PostTag()
			tag.posttag_post = txtPost1
			tag.posttag_tag = "tag" + str(i) + str(j)
			tag.save()
	
	evPost1 = Post()
	evPost1.post_author = u2
	evPost1.post_type = Post.EVENT_POST
	evPost1.post_title = "Mobile Miscellany: week of January 28th, 2013"
	evPost1.post_content = "xyxyxyxyxyxyx"
	evPost1.post_link = "http://www.egodecal.com"
	evPost1.post_popularity = 0
	evPost1.eventpost_location = "Berkeley, CA"
	evPost1.eventpost_date_start = datetime.date(year=2013, month=1, day=18)
	evPost1.eventpost_time_start = "3:12 PM"
	evPost1.eventpost_date_end = datetime.date(year=2013, month=5, day=8)
	evPost1.eventpost_time_end = "3:45 PM"
	evPost1.save()
	for j in range(4):
		tag = PostTag()
		tag.posttag_post = evPost1
		tag.posttag_tag = "tag" + str(i) + str(j)
		tag.save()
	
	evPost2 = Post()
	evPost2.post_author = u2
	evPost2.post_type = Post.EVENT_POST
	evPost2.post_title = "Mobile Miscellany: week of January 28th, 2013"
	evPost2.post_content = "xyxyxyxyxyxyx"
	evPost2.post_link = "http://www.egodecal.com"
	evPost2.post_popularity = 0
	evPost2.eventpost_location = "Berkeley, CA"
	evPost2.eventpost_date_start = datetime.date(year=2013, month=1, day=18)
	evPost2.eventpost_time_start = "3:12 PM"
	evPost2.save()
	for j in range(4):
		tag = PostTag()
		tag.posttag_post = evPost2
		tag.posttag_tag = "tag" + str(i) + str(j)
		tag.save()
	
	evPost3 = Post()
	evPost3.post_author = u2
	evPost3.post_type = Post.EVENT_POST
	evPost3.post_title = "Mobile Miscellany: week of January 28th, 2013"
	evPost3.post_content = "xyxyxyxyxyxyx"
	evPost3.post_link = "http://www.egodecal.com"
	evPost3.eventpost_location = "Berkeley, CA"
	evPost3.post_popularity = 0
	evPost3.eventpost_date_start = datetime.date(year=2013, month=1, day=18)
	evPost3.save()
	for j in range(4):
		tag = PostTag()
		tag.posttag_post = evPost3
		tag.posttag_tag = "tag" + str(i) + str(j)
		tag.save()
	
	for i in range(5):
		teamPost = Post()
		teamPost.post_author = u1
		teamPost.post_type = Post.TEAM_BUILDING_POST
		teamPost.post_title = "Mobile Miscellany: week of January 28th, 2013"
		teamPost.post_content = "xyxyxyxyxyxyx" + str(i)
		teamPost.post_link = "http://www.egodecal.com"
		teamPost.post_popularity = 0
		teamPost.save()
		for j in range(4):
			tag = PostTag()
			tag.posttag_post = teamPost
			tag.posttag_tag = "tag" + str(i) + str(j)
			tag.save()
		for j in range(5):
			pp = PotentialPosition()
			pp.post = teamPost
			pp.potentialposition_position = "PositionType " + str(j)
			pp.potentialposition_quantity = j
			pp.potentialposition_skills = str(i) + ";" + str(j)
			pp.save()
	
	stPost3 = Post()
	stPost3.post_author = u2
	stPost3.post_type = Post.STARTUP_HOSTING_POST
	stPost3.post_title = "Mobile Miscellany: week of January 28th, 2013"
	stPost3.post_content = "xyxyxyxyxyxyx"
	stPost3.post_link = "http://www.egodecal.com"
	stPost3.post_popularity = 0
	stPost3.save()
	
	stm1 = StartupTeamMember()
	stm1.post = stPost3
	stm1.startupteammember_profile = u1
	stm1.startupteammember_name = u1.get_full_name()
	stm1.startupteammember_position = "Director of Awesome"
	stm1.save()
	
	stm2 = StartupTeamMember()
	stm2.post = stPost3
	stm2.startupteammember_profile = u2
	stm2.startupteammember_name = u2.get_full_name()
	stm2.startupteammember_position = "Director of Awesomeness"
	stm2.save()
	
	stm3 = StartupTeamMember()
	stm3.post = stPost3
	stm3.startupteammember_name = "Shawn Park"
	stm3.startupteammember_position = "Director of Awful"
	stm3.save()
	
	mentorPost = Post()
	mentorPost.post_author = u1
	mentorPost.post_type = Post.MENTORING_POST
	mentorPost.post_title = "Startup Therapy @ The Center"
	mentorPost.post_content = "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
	mentorPost.post_link = "http://www.egodecal.com"
	mentorPost.post_popularity = 0
	mentorPost.mentoringpost_name = "Eric Muller"
	mentorPost.mentoringpost_shortbio = "Lead Advisor, German Silicon Valley Accelerator"
	mentorPost.mentoringpost_bio = "Lorem ipsum dolor sit amet, con"
	mentorPost.eventpost_location = "Berkeley, CA"
	mentorPost.eventpost_date_start = datetime.date(year=2013, month=1, day=18)
	mentorPost.eventpost_time_start = "3:12 PM"
	mentorPost.eventpost_date_end = datetime.date(year=2013, month=5, day=8)
	mentorPost.eventpost_time_end = "3:45 PM"
	mentorPost.save()
	
	fundPost1 = Post()
	fundPost1.post_author = u2
	fundPost1.post_type = Post.FUNDRAISING_POST
	fundPost1.post_title = "Mobile Miscellany: week of January 28th, 2013"
	fundPost1.post_content = "xyxyxyxyxyxyx" + str(i)
	fundPost1.post_link = "http://www.egodecal.com"
	fundPost1.post_popularity = 0
	fundPost1.fundraisingpost_money = 7.25
	fundPost1.save()
	
	# Return a success message
	return HttpResponse('database created')
def clear_database(request):
	cursor = connection.cursor()
	cursor.execute("DROP DATABASE cet")
	cursor.execute("CREATE DATABASE cet")
	cursor.execute("USE cet")
	
	# Create the tables in the database
	call_command('syncdb', interactive=True)

	return HttpResponseRedirect('/')

# User profile view
def user_dashboard_profile(request, user_id = None):
	# If the user isn't authenticated, take them to the landing page.
	if not request.user.is_authenticated():
		return redirect('/')
	# If the user_id wasn't set, but there is a user logged in, show the profile for the logged in user.
	if user_id == None:
		user_id = request.user.id
	
	# Get the currently logged in user
	u_logged_in = request.user
	
	# Get the user and the user profile
	u = get_object_or_404(User, id = user_id)
	
	# Get a QuerySet of the companies the user is affiliated with
	u_affiliations = Company.objects.filter(companymember__companymember_profile = u)
	
	# Get the follower and following counts from the UserConnection table
	u_follower_count = UserConnection.objects.filter(userconnection_target_user = u).count()
	u_following_count = UserConnection.objects.filter(userconnection_follower = u).count()
	
	# Get the clips count
	u_clip_count = Clip.objects.filter(clip_user = u).count()
	
	# Get the number of posts this user has made
	u_post_count = Post.objects.filter(post_author = u).count()
	
	# Get the educations that this user has
	u_educations = Education.objects.filter(user = u)
	
	# Get the jobs that this user has had
	u_jobs = Job.objects.filter(user = u)
	
	# Get the projects that this user has done
	u_projects = Project.objects.filter(user = u)
	
	# Get the skills that this user has
	u_skills = Skill.objects.filter(user = u)
	
	# Get the interests this user has
	u_interests = Interest.objects.filter(user = u)
	
	u_editable = u_logged_in.id == u.id

	u_followed = UserConnection.objects.filter(userconnection_follower = u_logged_in, userconnection_target_user = u).count() > 0

	# Create a context with the values needed from the database
	context = {
		'content': "User Profile",
		'u_logged_in':u_logged_in, 
		'user':u,
		'u_profile':u,
		'u_affiliations':u_affiliations, 
		'u_follower_count':u_follower_count, 
		'u_following_count':u_following_count, 
		'u_clip_count':u_clip_count, 
		'u_post_count':u_post_count, 
		'u_educations':u_educations,
		'u_jobs':u_jobs,
		'u_projects':u_projects,
		'u_skills':u_skills,
		'u_interests':u_interests,
		'u_editable':u_editable,
		'u_followed':u_followed,
		'is_new':False,							# Value to tell the template that this load is not creating new educations, jobs or porjects.
	}
	
	# Render the profile with this context
	return render_to_response('cet/dashboard_profile.html', context, context_instance=RequestContext(request))
# Show the view for adding education data for a user
def user_add_education(request):
	education = Education()
	
	context = {
		'education':education,
		'size':education.education_courses,
		'user': request.user,
		'u_logged_in':request.user,
		'is_new':True							# Value to tell the template that this load is creating a new education
	}
	return render_to_response('components/profile_education.html', context, context_instance=RequestContext(request))
# [POST] Add the new or editted user education data
def user_edit_education(request):
	# If id = 0, this is a new education.
	if(request.POST['id'] == "0"):
		education = Education(
			user = get_object_or_404(User, id = request.POST['user_id']),
			education_school = request.POST['school'],
			education_major = request.POST['major'],
			education_gradyear = request.POST['gradyear'],
			education_courses = request.POST['courses'][:-1]
			)
		education.save()
		#image updating
		if request.POST['image_attached'] == "1" and request.method == "POST":
			update_image_handler(request.FILES['image'], Images.USER, Images.EDUCATION, education.user, education.image , education, None, education.education_school)
		education.save()
		return HttpResponse('added education')
	# Otherwise, it's an update to an old education
	else:	
		education = get_object_or_404(Education, id= request.POST['id'])
		education.education_school = request.POST['school']
		education.education_major = request.POST['major']
		education.education_gradyear = request.POST['gradyear']
		education.education_courses = request.POST['courses'][:-1]
		#handling the file upload
		education.save()

		
		if request.POST['image_attached'] == "1" and request.method == "POST":
			user = get_object_or_404(User, id = request.POST['user_id'])
			update_image_handler(request.FILES['image'], Images.USER, Images.EDUCATION, user, education.image , education, None, education.education_school)
		
		education.save()
		return HttpResponse('updated education')	
# Show the view for adding job data for a user
def user_add_job(request):
	job = Job()
	
	context = {
		'job':job,
		'user': request.user,
		'u_logged_in':request.user,
		'is_new':True							# Value to tell the template that this load is creating a new job
	}
	return render_to_response('components/profile_job.html', context, context_instance=RequestContext(request))
# [POST] Add the new or editted user job data
def user_edit_job(request):
	MONTHS = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
	if(request.POST['id'] == "0"):
		if(request.POST['timeperiod_from_year'] != '' and request.POST['timeperiod_from_month'] != ''):
			start_year = str(request.POST['timeperiod_from_year'])
			start_month = MONTHS[request.POST['timeperiod_from_month']]
		else:
			start_year = 0
			start_month = 0
		if(request.POST['timeperiod_to_year'] != '' and request.POST['timeperiod_to_month'] != ''):
			end_month = MONTHS[request.POST['timeperiod_to_month']]
			end_year = str(request.POST['timeperiod_to_year'])
		else:
			end_year = 0
			end_month = 0
		job = Job(
			user = get_object_or_404(User, id = request.POST['user_id']),
			job_company = request.POST['company'],
			job_position = request.POST['position'],
			job_start_month = start_month,
			job_start_year = start_year,
			job_end_month = end_month,
			job_end_year = end_year,
			job_description = request.POST['description']
			)

		if request.POST['image_attached'] == "1" and request.method == "POST":
			update_image_handler(request.FILES['image'], Images.USER, Images.JOB, job.user, job.image, job, None, job.job_company)

		job.save()
		return HttpResponse('added jobs')
	#or update
	else:
		job = get_object_or_404(Job, id= request.POST['id'])
		job.job_company = request.POST['company']
		job.job_position = request.POST['position']
		job.job_description = request.POST['description']

		if(request.POST['timeperiod_from_year'] != '' and request.POST['timeperiod_from_month'] != ''):
			job.job_start_year = str(request.POST['timeperiod_from_year'])
			job.job_start_month = MONTHS[request.POST['timeperiod_from_month']]
		else:
			job.job_start_year = 0
			job.job_start_month = 0
		if(request.POST['timeperiod_to_year'] != '' and request.POST['timeperiod_to_month'] != ''):
			job.job_end_month = MONTHS[request.POST['timeperiod_to_month']]
			job.job_end_year = str(request.POST['timeperiod_to_year'])
		else:
			job.job_end_year = 0
			job.job_end_month = 0
		
		job.save()
		
		if request.POST['image_attached'] == "1" and request.method == "POST":
			user = get_object_or_404(User, id = request.POST['user_id'])
			update_image_handler(request.FILES['image'], Images.USER, Images.JOB, user, job.image ,job, None, job.job_company)
		job.save()

		return HttpResponse('updated job')
# Show the view for adding project data for a user
def user_add_project(request):
	project = Project()
	
	context = {
		'project':project,
		'user': request.user,
		'u_logged_in':request.user,
		'is_new':True							# Value to tell the template that this load is creating a new project
	}
	return render_to_response('components/profile_project.html', context, context_instance=RequestContext(request))
# [POST] Add the new or editted user project data
def user_edit_project(request):
	MONTHS = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
	#create
	if(request.POST['id'] == "0"):
		if(request.POST['timeperiod_from_year'] != '' and request.POST['timeperiod_from_month'] != ''):
			start_year = str(request.POST['timeperiod_from_year'])
			start_month = MONTHS[request.POST['timeperiod_from_month']]
		else:
			start_year = 0
			start_month = 0
		if(request.POST['timeperiod_to_year'] != '' and request.POST['timeperiod_to_month'] != ''):
			end_month = MONTHS[request.POST['timeperiod_to_month']]
			end_year = str(request.POST['timeperiod_to_year'])
		else:
			end_year = 0
			end_month = 0

		project = Project.objects.create(
			user = get_object_or_404(User, id = request.POST['user_id']),
			project_name = request.POST['project'],
			project_position = request.POST['position'],
			project_start_month = start_month,
			project_start_year = start_year,
			project_end_month = end_month,
			project_end_year = end_year,
			project_description = request.POST['description']
			)

		if request.POST['image_attached'] == "1" and request.method == "POST":
			update_image_handler(request.FILES['image'], Images.USER, Images.PROJECT, project.user, project.image ,project, None, project.project_name)
		
		project.save()
		return HttpResponse('added project')
	#or update
	else:
		project = get_object_or_404(Project, id= request.POST['id'])
		project.project_name = request.POST['project']
		project.project_position = request.POST['position']
		project.project_start_month = MONTHS[request.POST['timeperiod_from_month']]
		project.project_start_year = request.POST['timeperiod_from_year']
		project.project_end_month = MONTHS[request.POST['timeperiod_to_month']]
		project.project_end_year = request.POST['timeperiod_to_year']
		project.project_description = request.POST['description']
		
		if(request.POST['timeperiod_from_year'] != '' and request.POST['timeperiod_from_month'] != ''):
			project.project_start_year = str(request.POST['timeperiod_from_year'])
			project.project_start_month = MONTHS[request.POST['timeperiod_from_month']]
		else:
			project.project_start_year = 0
			project.project_start_month = 0
		if(request.POST['timeperiod_to_year'] != '' and request.POST['timeperiod_to_month'] != ''):
			project.project_end_month = MONTHS[request.POST['timeperiod_to_month']]
			project.project_end_year = str(request.POST['timeperiod_to_year'])
		else:
			project.project_end_year = 0
			project.project_end_month = 0

		project.save()

		if request.POST['image_attached'] == "1" and request.method == "POST":
			user = get_object_or_404(User, id = request.POST['user_id'])
			update_image_handler(request.FILES['image'], Images.USER, Images.PROJECT, user, project.image, project, None, project.project_name)
		project.save()

		return HttpResponse('updated project')
# [POST] Add a skill for a user
def user_add_skill(request):
	skill = Skill.objects.create(
			user = get_object_or_404(User, id = request.POST['user_id']),
			skill = request.POST['skill']
		)
	skill.save()
	return HttpResponse('skill added')
# [POST] Remove an interest for a user
def user_remove_skill(request):
	get_object_or_404(Skill, id = request.POST['skill_id']).delete()
	return HttpResponse('Skill deleted')
# [POST] Add an interest for a user
def user_add_interest(request):
	interest = Interest.objects.create(
			user = get_object_or_404(User, id = request.POST['user_id']),
			interest = request.POST['interest']
		)
	interest.save()
	return HttpResponse('interest added')
# [POST] Remove an interest for a user
def user_remove_interest(request):
	get_object_or_404(Interest, id = request.POST['interest_id']).delete()
	return HttpResponse('Interest deleted')
# [POST] Edit the personal data for a user
def user_edit_personal(request):
	u_profile = get_object_or_404(User, id = request.POST['user_id'])
	u_profile.description = request.POST['description']
	u_profile.twitter_username = request.POST['twitter']
	u_profile.facebook = correct_link(request.POST['facebook'])
	u_profile.website = correct_link(request.POST['website'])
	u_profile.linkedin = correct_link(request.POST['linkedin'])
	u_profile.save()
	return HttpResponse('User personal info saved')
# CET dashboard view
def user_dashboard_overview (request):
	# If the user isn't authenticated, take them to the landing page.
	if not request.user.is_authenticated():
		return redirect('/')
	
	# Code to put together the CET dashboard
	return render_to_response('cet/dashboard_overview.html', {"foo":"bar"}, context_instance=RequestContext(request))


# Company profile view
def company_profile(request, company_id):
	# If the user isn't authenticated, take them to the landing page.
	if not request.user.is_authenticated():
		return redirect('/')
	
	# Get the company to display
	c = get_object_or_404(Company, id = company_id)
	
	# Decide whether the company currently being viewed is editable
	c_editable = False
	if(c.company_creator == request.user):
		c_editable = True
	
	# Get the follower and following counts for this company
	c_follower_count = UserConnection.objects.filter(userconnection_target_company = c).count()
	c_following_count = UserConnection.objects.filter(userconnection_follower = c).count()
	
	companyProfiles = CompanyMember.objects.filter(company = c)
	# Get the number of things people in this company have clipped
	c_clip_count = 0
	# Get the number of posts people in this company have made
	c_post_count = 0
	for member in companyProfiles:
		if member.companymember_profile != None:
			c_clip_count += Clip.objects.filter(clip_user = member.companymember_profile).count()
			c_post_count += Post.objects.filter(post_author = member.companymember_profile).count()
	# Create a context dict to pass
	context = {
		'content': 'Company Profile',
		'company':c,
		'u_logged_in':request.user,
		'c_editable':c_editable,
		'c_follower_count':c_follower_count,
		'c_following_count':0,									# Take this out when we solve this.
		'c_clip_count':c_clip_count,
		'c_post_count':c_post_count,
		'canvas_partner': c.get_canvas_type_as_list(CompanyCanvasItem.PARTNER),
		'canvas_activity': c.get_canvas_type_as_list(CompanyCanvasItem.ACTIVITY),
		'canvas_resource': c.get_canvas_type_as_list(CompanyCanvasItem.RESOURCE),
		'canvas_value': c.get_canvas_type_as_list(CompanyCanvasItem.VALUE),
		'canvas_customer': c.get_canvas_type_as_list(CompanyCanvasItem.CUSTOMER),
		'canvas_relationship': c.get_canvas_type_as_list(CompanyCanvasItem.RELATIONSHIP),
		'canvas_channel': c.get_canvas_type_as_list(CompanyCanvasItem.CHANNEL),
		'canvas_costs': c.get_canvas_type_as_list(CompanyCanvasItem.COSTS),
		'canvas_revenue': c.get_canvas_type_as_list(CompanyCanvasItem.REVENUE),
		'is_new': False,
	}
	return render_to_response('cet/company_profile.html', context, context_instance=RequestContext(request))

# [POST] Create a new company
def company_create_new(request):
	creator = get_object_or_404(User, id = request.POST['user_id'])
	
	c = Company()
	c.company_creator = creator
	c.company_name = request.POST['name']
	try:
		c.company_founded_year = int(request.POST['year'])
	except:
		return HttpResponse('Year must be an integer')
	c.company_description = request.POST['description']
	
	c.save()
	
	return HttpResponse(c.id)

# [POST] Edit basic info for a company
# beware once thumbnail field gets edittable -- some things will fall apart 
def edit_company_info(request):
	c = get_object_or_404(Company, id = request.POST['company_id'])
	c.company_name = request.POST['company']
	
	c.company_founded_year = request.POST['foundedyear']
	c.company_description = request.POST['description']
	
	tags_old = c.get_tags_as_string().split(';')
	tags_new = request.POST['tags'].split(';')
	
	# Put in the new tags
	for new_tag in tags_new:
		if not new_tag in tags_old:
			ct = CompanyTag(company = c, companytag_tag = new_tag)
			ct.save()
	
	# Take out old tags that are no longer there
	for old_tag in tags_old:
		if not old_tag in tags_new:
			ct = CompanyTag.objects.get(company = c, companytag_tag = old_tag)
			ct.delete()


	#handling the file upload
	#request.FILES['user_image'] = request.POST['profile_pic']
	if request.POST['image_attached'] == "1" and request.method == "POST":
		#company_cover_updating = get_object_or_404(Company, id = request.POST['company_id'])
		user = get_object_or_404(User, id = request.POST['user_id'])
		update_image_handler(request.FILES['image'], Images.COMPANY, Images.COMPANY_IMAGE, user, c.image, c, c, c.company_name)
	
	c.save()
	user.save()
	return HttpResponse('Company saved.')

# [POST] Update company demo video URL (Youtube)
def company_edit_demo(request):
	#get_object_or_404(Model_name, pk)
	company = get_object_or_404(Company, id = request.POST['company_id'])
	
	url_data = urlparse(request.POST['demo'])
	query = parse_qs(url_data.query)
	company.company_demo = 'http://www.youtube.com/embed/' + query["v"][0]
	
	company.save()
	return HttpResponse(company.company_demo)
# Show the view for adding team member data for a company

def company_add_teammember(request):
	team_member = CompanyMember()
	
	context = {
		'member':team_member,
		'c_editable':True,
		'is_new':True							# Value to tell the template that this load is creating a new teammember
	}
	return render_to_response('components/profile_team.html', context, context_instance=RequestContext(request))
	
# [POST] Add the new or editted user project data
def company_edit_teammember(request):
	#create
	if(request.POST['id'] == "0"):
		form = CompanyMemberPictureForm(request.POST, request.FILES)
		member = CompanyMember.objects.create(
			company = get_object_or_404(Company, id = request.POST['company_id']),
			companymember_name = request.POST['name'],
			companymember_position = request.POST['position'],
			companymember_description = request.POST['description']
		)
		if request.POST['image_attached'] == "1" and request.method == "POST":
			user = get_object_or_404(User, id = request.POST['user_id'])
			update_image_handler(request.FILES['image'], Images.COMPANY, Images.TEAMMEMBER, user, member.image, member, member.company, member.companymember_name)
		member.save()
		return HttpResponse('added team member')
	#or update
	else:
		member = get_object_or_404(CompanyMember, id= request.POST['id'])
		member.companymember_name = request.POST['name']
		member.companymember_position = request.POST['position']
		member.companymember_description = request.POST['description']
		member.save()

		#handling the file upload
		if request.POST['image_attached'] == "1" and request.method == "POST":
			user = get_object_or_404(User, id = request.POST['user_id'])
			update_image_handler(request.FILES['image'], Images.COMPANY, Images.COMPANYMEMBER, user, member.image, member, member.company, member.companymember_name)
		member.save()

		return HttpResponse('updated team member')

# [POST] Edit company contact informaiton
def company_edit_contact(request):
	c = get_object_or_404(Company, id = request.POST['company_id'])
	c.company_facebook = correct_link(request.POST['facebook'])
	c.company_website = correct_link(request.POST['website'])
	c.company_email = request.POST['email']
	c.save()
	
	return HttpResponse('Company contact stuff saved.')
# [POST] Add an item to a company's canvas
def company_add_canvasitem(request):
	type_to_num = {
		'customer':CompanyCanvasItem.CUSTOMER,
		'relationship':CompanyCanvasItem.RELATIONSHIP,
		'channel':CompanyCanvasItem.CHANNEL,
		'value':CompanyCanvasItem.VALUE,
		'activity':CompanyCanvasItem.ACTIVITY,
		'resource':CompanyCanvasItem.RESOURCE,
		'partner':CompanyCanvasItem.PARTNER,
		'cost':CompanyCanvasItem.COSTS,
		'revenue':CompanyCanvasItem.REVENUE
	}
	if not len(request.POST['item'].strip()) > 0 or not len(request.POST['type'].strip()) > 0:
		return HttpResponse('Bad Canvas Item')
	
	canvasitem = CompanyCanvasItem.objects.create(
		company = get_object_or_404(Company, id = request.POST['company_id']),
		companycanvas_item = request.POST['item'],
		companycanvas_type = type_to_num[request.POST['type']]
	)
	canvasitem.save()
	
	return HttpResponse('Canvas Item saved.')


# Load feed
# The filters input is structured like the following [Post Type]_[sorting]
def feed(request, filters = 'all_recent'):
	# If the user isn't authenticated, take them to the landing page.
	if not request.user.is_authenticated():
		return redirect('/')
	
	# Get the category from the filter
	filters = filters.split('_')
	category = filters[0]

	# If there is a sorting, get the sorting
	try:
		sorting = filters[1]
	except IndexError:
		sorting = 'recent'
	
	# Load the first page
	page = 1
	
	# Create a context
	context = {
		'page': page,
		'category':category,
		'sorting':sorting,
		'u_logged_in':request.user,
		'content': "Feed"
	}
	return render_to_response('cet/feed.html', context, context_instance=RequestContext(request))
# [POST] Show the correct posts for the feed
def feed_show(request):
	category = request.POST['category']
	page = int(request.POST['page'])
	sorting = request.POST['sorting']
	u_logged_in = get_object_or_404(User, id = request.POST['u_logged_in_id'])

	# Convert the category to its corresponding integer in the model
	category2int = {'all':-1, 'text':0, 'event':1, 'team':2, 'startup':3, 'mentoring':4, 'fundraising':5}

	# Get the posts
	if sorting == 'popular':
		try:
			posts = Post.objects.get_popular(category2int[category], page)
		except:
			posts = Post.objects.get_popular(category2int['all'], page)
	elif sorting == 'recent':
		try:
			posts = Post.objects.get_recent(category2int[category], page)
		except:
			posts = Post.objects.get_recent(category2int['all'], page)

	context = {
		'posts':posts,
		'u_logged_in':u_logged_in,
	}

	return render_to_response('components/feed_content.html', context, context_instance=RequestContext(request))
# [POST] Search for posts in the feed
def feed_search(request):
	# Get the values from the post call
	keyword = request.POST['keyword'].lower()
	if(keyword == 'keyword'):
		keyword = ''
	author = request.POST['author'].lower()
	if(author == 'author'):
		author = ''
	category = request.POST['category'].lower()
	if(category == 'category'):
		category = 'all'
	timeframe = request.POST['timeframe'].lower()
	if(timeframe == 'timeframe'):
		timeframe = 'anytime'
	
	# If there were no specific search terms entered, return no results
	if(keyword == '' and author == '' and category == 'all' and timeframe == 'anytime'):
		return HttpResponse('')
	
	# Convert the category to its corresponding integer in the model
	category2Q = { 
		'free post':Q(post_type = 0), 
		'events':Q(post_type = 1), 
		'team building':Q(post_type = 2), 
		'startup posting':Q(post_type = 3), 
		'mentoring':Q(post_type = 4), 
		'fundraising':Q(post_type = 5)
	}
	timeframe2Q = {
		'last day': Q(post_timestamp__gt = datetime.datetime.utcnow().replace(tzinfo=utc) - datetime.timedelta(days = 1)),
		'last hour': Q(post_timestamp__gt = datetime.datetime.utcnow().replace(tzinfo=utc) - datetime.timedelta(hours = 1)),
		'last month': Q(post_timestamp__gt = datetime.datetime.utcnow().replace(tzinfo=utc) - datetime.timedelta(days = 32)),
		'last year': Q(post_timestamp__gt = datetime.datetime.utcnow().replace(tzinfo=utc) - datetime.timedelta(days = 366)),
	}
	post_q = Q(post_content__icontains = keyword) | Q(post_title__icontains = keyword) | Q(mentoringpost_name__icontains = keyword) | Q(mentoringpost_shortbio__icontains = keyword) | Q(mentoringpost_shortbio__icontains = keyword)
	
	post_q = post_q & (Q(post_author__first_name__icontains = author) | Q(post_author__last_name__icontains = author))
	
	if(not timeframe == 'anytime'):
		post_q = post_q & timeframe2Q[timeframe]
		
	if (not category == 'all'):
		post_q = post_q & category2Q[category]
		
	posts = Post.objects.filter(post_q)
	return render_to_response('components/feed_content.html', {'posts':posts}, context_instance=RequestContext(request))
# [POST] Make a text post.
def feed_post_text(request):
	if request.POST['title'] == "" or request.POST['content'] == "":
		return HttpResponse('Invalid data')
	
	# Add the usual values for a post
	p = Post()
	p.post_author = get_object_or_404(User, id = request.POST['user_id'])
	p.post_type = Post.TEXT_POST
	p.post_title = request.POST['title']
	p.post_content = request.POST['content']
	if not request.POST['link'] == '':
		p.post_link = correct_link(request.POST['link'])
	p.post_popularity = 0
	
	p.save()
	
	# Add the tags for the post (if given)
	if not request.POST['tags'] == "":
		for tag in request.POST['tags'][:-1].split(';'):
			t = PostTag(posttag_post = p, posttag_tag = tag)
			t.save()

	#add the image
	if request.POST['image_attached'] == "1" and request.method == "POST":
		user = p.post_author
		update_image_handler(request.FILES['image'], Images.POST, Images.TEXT_POST, user, p.image, p, None, p.post_title)
	
	p.save()

	#redirect to the main profile after:
	return render_to_response('components/post_text.html', {'post':p, 'u_logged_in':p.post_author}, context_instance=RequestContext(request))


# [POST] Make an event post
def feed_post_event(request):
	# Check that the required fields are there
	if request.POST['title'] == "" or request.POST['content'] == "" or request.POST['from_year'] == "" or request.POST['from_month'] == "" or request.POST['from_day'] == "":
		return HttpResponse('Invalid data')
	
	# Create a dictionary to go from month string to number
	MONTHS = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
	
	# Create a post with the fields relavent to all posts
	p = Post()
	p.post_author = get_object_or_404(User, id = request.POST['user_id'])
	p.post_type = Post.EVENT_POST
	# post_photo = models.ImageField(default=None)									We'll get to image fields later.
	p.post_title = request.POST['title']
	p.post_content = request.POST['content']
	if not request.POST['link'] == '':
		p.post_link = correct_link(request.POST['link'])
	p.post_popularity = 0
	
	# Event post fields
	p.eventpost_location = request.POST['location']
	try:
		p.eventpost_date_start = datetime.date(int(request.POST['from_year']), MONTHS[request.POST['from_month']], int(request.POST['from_day']))
	except ValueError:
		return HttpResponse('Invalid data')
	if request.POST['from_time'] == 'All Day':
		p.eventpost_time_start = None
	else:
		p.eventpost_time_start = request.POST['from_time']
	
	# If an ending date is given, add it
	if not request.POST['to_year'] == "" and not request.POST['to_month'] == "" and not request.POST['to_day'] == "":
		try:
			p.eventpost_date_end = datetime.date(int(request.POST['to_year']), MONTHS[request.POST['to_month']], int(request.POST['to_day']))
		except ValueError:
			return HttpResponse('Invalid data')
		
		if request.POST['to_time'] == 'All Day':
			p.eventpost_time_end = None
		else:
			p.eventpost_time_end = request.POST['to_time']
		
		# Check to make sure that the start date is before the end date
		if p.eventpost_date_start > p.eventpost_date_end:
			return HttpResponse('Invalid data')
	
	# Save the post to the database
	p.save()
	
	# Add the tags for the post (if given)
	if not request.POST['tags'] == "":
		for tag in request.POST['tags'][:-1].split(';'):
			t = PostTag(posttag_post = p, posttag_tag = tag)
			t.save()

	#add the event image
	if request.POST['image_attached'] == "1" and request.method == "POST":
		user = p.post_author
		update_image_handler(request.FILES['image'], Images.POST, Images.EVENT_POST, user, p.image, p, None, p.post_title)

	p.save()
	
	# Return a event post box that is added to the current feed for the user.
	return render_to_response('components/post_event.html', {'post':p, 'u_logged_in':p.post_author}, context_instance=RequestContext(request))
# [POST] Make a team building post
def feed_post_team(request):
	if request.POST['title'] == "" or request.POST['content'] == "":
		return HttpResponse('Invalid data')
	
	# Regular post items
	p = Post()
	p.post_author = get_object_or_404(User, id = request.POST['user_id'])
	p.post_type = Post.TEAM_BUILDING_POST
	# post_photo = models.ImageField(default=None)									We'll get to image fields later.
	p.post_title = request.POST['title']
	p.post_content = request.POST['content']
	if not request.POST['link'] == '':
		p.post_link = correct_link(request.POST['link'])
	p.post_popularity = 0
	p.save()
	
	positions = request.POST['position'][:-1].split('&')
	quantities = request.POST['qty'][:-1].split('&')
	skills = request.POST['skill'][:-1].split('&')
	
	for i, position in enumerate(positions):
		potpos = PotentialPosition()
		potpos.post = p
		potpos.potentialposition_position = position
		potpos.potentialposition_quantity = quantities[i]
		potpos.potentialposition_skills = skills[i][:-1]
		potpos.save()
	
	# Add the tags for the post (if given)
	if not request.POST['tags'] == "":
		for tag in request.POST['tags'][:-1].split(';'):
			t = PostTag(posttag_post = p, posttag_tag = tag)
			t.save()

	#add the image
	if request.POST['image_attached'] == "1" and request.method == "POST":
		user = p.post_author
		update_image_handler(request.FILES['image'], Images.POST, Images.TEAM_POST, user, p.image, p, None, p.post_title)
	p.save()
	
	return render_to_response('components/post_team.html', {'post':p, 'u_logged_in':p.post_author}, context_instance=RequestContext(request))
# [POST] Make a startup hosting post
def feed_post_startup(request):
	if request.POST['title'] == "" or request.POST['content'] == "":
		return HttpResponse('Invalid data')
	
	# Add the usual values for a post
	p = Post()
	p.post_author = get_object_or_404(User, id = request.POST['user_id'])
	p.post_type = Post.STARTUP_HOSTING_POST
	# post_photo = models.ImageField(default=None)									We'll get to image fields later.
	p.post_title = request.POST['title']
	p.post_content = request.POST['content']
	if not request.POST['link'] == '':
		p.post_link = correct_link(request.POST['link'])
	p.post_popularity = 0
	
	members = request.POST['name'][:-1].split('&')
	positions = request.POST['position'][:-1].split('&')
	
	p.save()
	
	for i, member in enumerate(members):
		stm = StartupTeamMember()
		stm.post = p
		stm.startupteammember_name = member
		stm.startupteammember_position = positions[i]
		stm.save()
	
	# Add the tags for the post (if given)
	if not request.POST['tags'] == "":
		for tag in request.POST['tags'][:-1].split(';'):
			t = PostTag(posttag_post = p, posttag_tag = tag)
			t.save()

	#add the image -
	if request.POST['image_attached'] == "1" and request.method == "POST":
		user = p.post_author
		update_image_handler(request.FILES['image'], Images.POST, Images.STARTUP_POST, user, p.image, p, None, p.post_title)
	p.save()
	
	return render_to_response('components/post_startup.html', {'post':p, 'u_logged_in':p.post_author}, context_instance=RequestContext(request))
# [POST] Make a mentoring session post
def feed_post_mentoring(request):
	# Check that the required fields are there
	if request.POST['title'] == "" or request.POST['content'] == "" or request.POST['from_year'] == "" or request.POST['from_month'] == "" or request.POST['from_day'] == "":
		return HttpResponse('Invalid data')
	
	# Create a dictionary to go from month string to number
	MONTHS = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
	
	# Create a post with the fields relavent to all posts
	p = Post()
	p.post_author = get_object_or_404(User, id = request.POST['user_id'])
	p.post_type = Post.MENTORING_POST
	# post_photo = models.ImageField(default=None)									We'll get to image fields later.
	p.post_title = request.POST['title']
	p.post_content = request.POST['content']
	if not request.POST['link'] == '':
		p.post_link = correct_link(request.POST['link'])
	p.post_popularity = 0
	
	# Event post fields
	p.eventpost_location = request.POST['location']
	try:
		p.eventpost_date_start = datetime.date(int(request.POST['from_year']), MONTHS[request.POST['from_month']], int(request.POST['from_day']))
	except ValueError:
		return HttpResponse('Invalid data')
	if request.POST['from_time'] == 'All Day':
		p.eventpost_time_start = None
	else:
		p.eventpost_time_start = request.POST['from_time']
	
	# If an ending date is given, add it
	if not request.POST['to_year'] == "" and not request.POST['to_month'] == "" and not request.POST['to_day'] == "":
		try:
			p.eventpost_date_end = datetime.date(int(request.POST['to_year']), MONTHS[request.POST['to_month']], int(request.POST['to_day']))
		except ValueError:
			return HttpResponse('Invalid data')
		
		if request.POST['to_time'] == 'All Day':
			p.eventpost_time_end = None
		else:
			p.eventpost_time_end = request.POST['to_time']
	
	# Mentoring post things
	p.mentoringpost_name = request.POST['mentor_name']
	p.mentoringpost_shortbio = request.POST['mentor_position']
	p.mentoringpost_bio = request.POST['mentor_description']
	
	# Save the post to the database
	p.save()
	
	# Add the tags for the post (if given)
	if not request.POST['tags'] == "":
		for tag in request.POST['tags'][:-1].split(';'):
			t = PostTag(posttag_post = p, posttag_tag = tag)
			t.save()

	if request.POST['image_attached'] == "1" and request.method == "POST":
		user = p.post_author
		update_image_handler(request.FILES['image'], Images.POST, Images.MENTORING_POST, user, p.image, p, None, p.post_title)
	p.save()

	# Return a event post box that is added to the current feed for the user.
	return render_to_response('components/post_mentor.html', {'post':p, 'u_logged_in':p.post_author}, context_instance=RequestContext(request))
# [POST] Make a fundraising post
def feed_post_fundraising(request):
	if request.POST['title'] == "" or request.POST['content'] == "" or request.POST['money'] == "":
		return HttpResponse('Invalid data')
	
	p = Post()
	p.post_author = get_object_or_404(User, id = request.POST['user_id'])
	p.post_type = Post.FUNDRAISING_POST
	# post_photo = models.ImageField(default=None)									We'll get to image fields later.
	p.post_title = request.POST['title']
	p.post_content = request.POST['content']
	if not request.POST['link'] == '':
		p.post_link = correct_link(request.POST['link'])
	p.post_popularity = 0
	money = request.POST['money']
	if not money.strip()[0] == '$':
		money = '$ ' + money.strip()
	else:
		money = '$ ' + money[1:].strip()
	p.fundraisingpost_money = money
	p.save()
	
	# Add the tags for the post (if given)
	if not request.POST['tags'] == "":
		for tag in request.POST['tags'][:-1].split(';'):
			t = PostTag(posttag_post = p, posttag_tag = tag)
			t.save()

	#add the image
	if request.POST['image_attached'] == "1" and request.method == "POST":
		user = p.post_author
		update_image_handler(request.FILES['image'], Images.POST, Images.FUNDRAISING_POST, user, p.image, p, None, p.post_title)
	p.save()
	
	return render_to_response('components/post_investment.html', {'post':p, 'u_logged_in':p.post_author}, context_instance=RequestContext(request))

# Like a post
def feed_post_like(request):
	# Get the post bumped and the user who bumped
	post = get_object_or_404(Post, id = request.POST['post_id'])
	user = get_object_or_404(User, id = request.POST['user_id'])
	
	# Get if the user has already bumped this post
	bumped = PostBump.objects.filter(postbump_user = user, postbump_post = post).count()
	
	# If they haven't already bumped it, bump the post
	if bumped == 0:
		pb = PostBump(postbump_user = user, postbump_post = post)
		pb.save()
	# Otherwise, unlike the post
	else:
		pb = PostBump.objects.get(postbump_user = user, postbump_post = post).delete()
	
	# update the popularity of the post
	update_post_popularity(post)
	
	# Return the current bump/like count
	return HttpResponse(post.get_like_count())
# Comment on a post
def feed_post_comment(request):
	# Get the text of the comment
	text = request.POST['comment']
	
	# Get the post and the user of the comment
	post = get_object_or_404(Post, id = request.POST['post_id'])
	user = get_object_or_404(User, id = request.POST['user_id'])

	# Create the comment and save
	comment = Comment(comment_post = post, comment_author = user, comment_content = text)
	comment.save()

	# Construct a context for the comment component and show it
	context = {
		'comment':comment,
		'u_logged_in':user
	}

	update_post_popularity(post)
	return render_to_response('components/comment_item.html', context, context_instance=RequestContext(request))
# Like a comment
def feed_comment_like(request):
	# Get the comment bumped and the user who bumped
	comment = get_object_or_404(Comment, id = request.POST['comment_id'])
	user = get_object_or_404(User, id = request.POST['user_id'])
	
	# Get if the user has already bumped this comment
	bumped = CommentBump.objects.filter(commentbump_user = user, commentbump_comment = comment).count()
	
	# If they haven't already bumped it, bump the comment
	if bumped == 0:
		pb = CommentBump(commentbump_user = user, commentbump_comment = comment)
		pb.save()
	# Otherwise, unlike the comment
	else:
		pb = CommentBump.objects.get(commentbump_user = user, commentbump_comment = comment).delete()
	
	# Return the current bump/like count
	return HttpResponse(comment.get_like_count())
# Update the popularity of a post
def update_post_popularity(post):
	like_count = post.get_like_count()
	comment_count = post.get_comment_count()
	
	score = like_count + comment_count
	
	epoch_time = datetime.datetime(2012, 5, 5, 4, 0, 0).replace(tzinfo=utc)
	delta = (post.post_timestamp - epoch_time).total_seconds()
	
	sign = 0
	if score > 0:
		sign = 1
	
	score = max(score, 1)
	
	popularity = math.log10(score) + ((sign*delta)/(86400))
	
	post.post_popularity = popularity
	post.save()
	
	return popularity


# Connect
def connect(request, category = 'featured'):
	if not request.user.is_authenticated():
		return redirect('/')

	return render_to_response('cet/connect.html',{"u_logged_in":request.user, 'category':category, 'content': 'Connect'},context_instance=RequestContext(request))
# Load the featured people
def connect_show(request, category = 'featured'):
	u_logged_in = get_object_or_404(User, id = request.POST['user_id'])
	u_conns = UserConnection.objects.raw('''SELECT id, userconnection_target_user_id, COUNT(*) 
											FROM feed_userconnection 
											WHERE userconnection_target_user_id IS NOT NULL 
											GROUP BY userconnection_target_user_id 
											ORDER BY COUNT(*) DESC''')
	

	u_list = []
	for counter, u_conn in enumerate(u_conns):
		u_list.insert(counter, u_conn.userconnection_target_user.id)

	if category == 'featured':
		# Get the featured people
		found_entries_featured = User.objects.filter(id__in = u_list).exclude(id = u_logged_in.id)
		# Convert the list and sort the list by the same order as u_list (most followers to least)
		featured_list = list(found_entries_featured)
		featured_list.sort(key=lambda user: u_list.index(user.id))
		# Get the people with no followers
		others = User.objects.all().exclude(id__in = u_list).exclude(id = u_logged_in.id)
		# Convert the list
		others_list = list(others)
		# Concactenate the lists
		found_entries = featured_list + others_list
	elif category == 'entrepreneurs':
		# Get the featured people
		found_entries_featured = User.objects.filter(id__in = u_list, background = User.ENTREPRENEUR).exclude(id = u_logged_in.id)
		# Convert the list and sort the list by the same order as u_list (most followers to least)
		featured_list = list(found_entries_featured)
		featured_list.sort(key=lambda user: u_list.index(user.id))
		# Get the people with no followers
		others = User.objects.filter(background = User.ENTREPRENEUR).exclude(id__in = u_list)
		others = others.exclude(id = u_logged_in.id)
		# Convert the list
		others_list = list(others)
		# Concactenate the lists
		found_entries = featured_list + others_list
	elif category == 'angelinvestors':
		# Get the featured people
		found_entries_featured = User.objects.filter(id__in = u_list, background = User.ANGEL_INVESTOR).exclude(id = u_logged_in.id)
		# Convert the list and sort the list by the same order as u_list (most followers to least)
		featured_list = list(found_entries_featured)
		featured_list.sort(key=lambda user: u_list.index(user.id))
		# Get the people with no followers
		others = User.objects.filter(background = User.ANGEL_INVESTOR).exclude(id__in = u_list)
		others = others.exclude(id = u_logged_in.id)
		# Convert the list
		others_list = list(others)
		# Concactenate the lists
		found_entries = featured_list + others_list
	elif category == 'venturecapitalists':
		# Get the featured people
		found_entries_featured = User.objects.filter(id__in = u_list, background = User.VENTURE_CAPITALIST).exclude(id = u_logged_in.id)
		# Convert the list and sort the list by the same order as u_list (most followers to least)
		featured_list = list(found_entries_featured)
		featured_list.sort(key=lambda user: u_list.index(user.id))
		# Get the people with no followers
		others = User.objects.filter(background = User.VENTURE_CAPITALIST).exclude(id__in = u_list)
		others = others.exclude(id = u_logged_in.id)
		# Convert the list
		others_list = list(others)
		# Concactenate the lists
		found_entries = featured_list + others_list
	elif category == 'consultants':
		# Get the featured people
		found_entries_featured = User.objects.filter(id__in = u_list, background = User.CONSULTANT).exclude(id = u_logged_in.id)
		# Convert the list and sort the list by the same order as u_list (most followers to least)
		featured_list = list(found_entries_featured)
		featured_list.sort(key=lambda user: u_list.index(user.id))
		# Get the people with no followers
		others = User.objects.filter(background = User.CONSULTANT).exclude(id__in = u_list)
		others = others.exclude(id = u_logged_in.id)
		# Convert the list
		others_list = list(others)
		# Concactenate the lists
		found_entries = featured_list + others_list
	elif category == 'technologists':
		# Get the featured people
		found_entries_featured = User.objects.filter(id__in = u_list, background = User.TECHNOLOGIST).exclude(id = u_logged_in.id)
		# Convert the list and sort the list by the same order as u_list (most followers to least)
		featured_list = list(found_entries_featured)
		featured_list.sort(key=lambda user: u_list.index(user.id))
		# Get the people with no followers
		others = User.objects.filter(background = User.TECHNOLOGIST).exclude(id__in = u_list)
		others = others.exclude(id = u_logged_in.id)
		# Convert the list
		others_list = list(others)
		# Concactenate the lists
		found_entries = featured_list + others_list
	elif category == 'companies':
		found_entries = Company.objects.filter(company_creator=u_logged_in)
		return render_to_response('components/connect_masonry.html', {'company_list':found_entries, 'u_logged_in': u_logged_in}, context_instance=RequestContext(request))

	connections = []
	for counter, user in enumerate(found_entries):
		if UserConnection.objects.filter(userconnection_follower = u_logged_in, userconnection_target_user = user).exists():
			connections.insert(counter, True)
		else:
			connections.insert(counter, False)
	
	return render_to_response('components/connect_masonry.html', {'user_list':found_entries, 'connections':connections, 'u_logged_in': u_logged_in}, context_instance=RequestContext(request))
# Do the search
def connect_search(request):
	query_string = request.POST['query']
	fil = request.POST['filter']
	u_logged_in = get_object_or_404(User, id = request.POST['user_id'])
	found_entries = None
	
	# If the query is blank, don't return any results
	if query_string == "":
		found_entries = None
	# Otherwise, look at the criteria and execute the approproate query
	elif fil == 'Any':
		name_q = Q()
		for token in query_string.split(' '):
			name_q = name_q & (Q(first_name__icontains = token) | Q(last_name__icontains = token))
		
		interest_q = Q()
		for token in query_string.split(' '):
			interest_q = interest_q | Q(interest__interest__icontains = token)
		
		skill_q = Q()
		for token in query_string.split(' '):
			skill_q = skill_q | Q(skill__skill__icontains = token)
		
		job_q = Q()
		for token in query_string.split(' '):
			job_q = job_q | (Q(job__job_company__icontains = token) | Q(job__job_position__icontains = token) | Q(job__job_description__icontains = token))
		
		education_q = Q()
		for token in query_string.split(' '):
			education_q = education_q | (Q(education__education_school__icontains = token) | Q(education__education_major__icontains = token) | Q(education__education_major__icontains = token) | Q(education__education_courses__icontains = token))
		
		any_q = name_q | interest_q | skill_q | job_q | education_q
		
		found_entries = User.objects.filter(any_q).exclude(id = u_logged_in.id).distinct()[:10]
	elif fil == 'Name':
		name_q = Q()
		for token in query_string.split(' '):
			name_q = name_q & (Q(first_name__icontains = token) | Q(last_name__icontains = token))
		found_entries = User.objects.filter(name_q).exclude(id = u_logged_in.id).distinct()[:10]
	elif fil == 'Interest':
		interest_q = Q()
		for token in query_string.split(' '):
			interest_q = interest_q | Q(interest__interest__icontains = token)
		found_entries = User.objects.filter(interest_q).exclude(id = u_logged_in.id).distinct()[:10]
	elif fil == 'Skill':
		skill_q = Q()
		for token in query_string.split(' '):
			skill_q = skill_q | Q(skill__skill__icontains = token)
		found_entries = User.objects.filter(skill_q).exclude(id = u_logged_in.id).distinct()[:10]
	elif fil == 'Job':
		job_q = Q()
		for token in query_string.split(' '):
			job_q = job_q | (Q(job__job_company__icontains = token) | Q(job__job_position__icontains = token) | Q(job__job_description__icontains = token))
		found_entries = User.objects.filter(job_q).exclude(id = u_logged_in.id).distinct()[:10]
	elif fil == 'Education':
		education_q = Q()
		for token in query_string.split(' '):
			education_q = education_q | (Q(education__education_school__icontains = token) | Q(education__education_major__icontains = token) | Q(education__education_major__icontains = token) | Q(education__education_courses__icontains = token))
		found_entries = User.objects.filter(education_q).exclude(id = u_logged_in.id).distinct()[:10]
	
	# Determine the relationships between the returned users and the logged in user (user making the search)
	connections = []
	for counter, user in enumerate(found_entries):
		if UserConnection.objects.filter(userconnection_follower = u_logged_in, userconnection_target_user = user).exists():
			connections.insert(counter, True)
		else:
			connections.insert(counter, False)
	
	return render_to_response('components/connect_masonry.html', {'user_list':found_entries, 'connections':connections}, context_instance=RequestContext(request))
# User to follow a user
def connect_follow_user(request):
	u_followed = get_object_or_404(User, id = request.POST['user_followed_id'])
	u_follower = get_object_or_404(User, id = request.POST['user_follower_id'])
	
	u_conn, created = UserConnection.objects.get_or_create(userconnection_follower = u_follower, userconnection_target_user = u_followed)
	
	return HttpResponse('User followed')
# User to follow a user
def connect_unfollow_user(request):
	u_followed = get_object_or_404(User, id = request.POST['user_followed_id'])
	u_follower = get_object_or_404(User, id = request.POST['user_follower_id'])
	
	get_object_or_404(UserConnection, userconnection_follower = u_follower, userconnection_target_user = u_followed).delete()
	
	return HttpResponse('User unfollowed')
# Get the array of tokens in the search
def normalize_query(query_string, findterms=re.compile(r'"([^"]+)"|(\S+)').findall, normspace=re.compile(r'\s{2,}').sub):
	return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]
# Load a demo of the connect
def connect_demo(request):
	return render_to_response('cet/connect_demo.html',{"u_logged_in":request.user},context_instance=RequestContext(request))
# Messages
def messages(request):
	return render_to_response('cet/messages.html',{"u_logged_in":request.user},context_instance=RequestContext(request))

# Method to correct incomplete links
def correct_link(link):
	if link[:7] != "http://" and link[:8] != "https://" and len(link.strip()) > 0:
		link = "http://" + link
	return link



#image uploading for profile pictures
def update_profile_picture(request):
	#handling the file upload
	user_updating_profile = get_object_or_404(User, pk = request.POST['id'])
	if(request.POST['image_attached'] == "1"):
		if user_updating_profile.image != None:
			old_image_table_row = Images.objects.get(pk = user_updating_profile.image.pk)
			old_image_table_row.in_use = False
			old_image_table_row.save()
		image_table_row = Images(major_type = Images.USER, minor_type = Images.USERIMAGE, user_uploader = user_updating_profile, caption = user_updating_profile.first_name+ " " + user_updating_profile.last_name)
		image_table_row = update_image(request.FILES['image'], image_table_row.image, image_table_row)
		user_updating_profile.image = image_table_row
		image_table_row.save()
	user_updating_profile.save()
	return HttpResponse('profile pic changed')

#handling image uploads for every instance besides profile pictures
def update_image_handler(fileIn, major, minor, user, model_updating_image, model_updating, company = None, image_caption= None):
	if model_updating_image != None:
		old_image_table_row = Images.objects.get(pk = model_updating_image.pk)
		old_image_table_row.in_use = False
		old_image_table_row.save()
	image_table_row = Images(major_type = major, minor_type= minor, user_uploader = user, company_uploader = company, caption = image_caption)
	image_table_row = update_image(fileIn, image_table_row.image, image_table_row)
	#model_updating_image = image_table_row
	model_updating.image = image_table_row
	image_table_row.save()
	model_updating.save()

#send in the entire request AND the reference to the model's image, not just the image, AND the entire model. 
def update_image(fileIn, model_image, model):
	the_image = ImageFile(fileIn)
	model_image.save(fileIn.name, the_image)
	if model != None:
		model.save()
	return model
	#return HttpResponse('image is updated')
