from django.http import HttpResponse, HttpResponseRedirect
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils.timezone import utc
import datetime
from PIL import Image
from cet.settings import MEDIA_ROOT, STATIC_URL
from django.shortcuts import get_object_or_404
from django.db.models import SET_NULL


# UserManager to handle user creation
class UserManager(BaseUserManager):
    def create_user(self, email, password):
        if not email:
            raise ValueError('User must have an email')
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email,
            password=password,
        )
        user.is_staff = True
        user.save(using=self._db)

        return user

#User is the custom authentication model to store User data
class User(AbstractBaseUser):
    # Human-readable tuple for user affiliation
    CURRENT_STUDENT = 0
    ALUMNUS = 1
    SCHOLAR = 2
    STAFF = 3
    AFFILIATION = (
        (CURRENT_STUDENT,'Student'),
        (ALUMNUS, 'Alumnus'),
        (SCHOLAR, 'SCHOLAR'),
        (STAFF, 'Staff'),
    )
    # Human-readable tuple for user background
    ENTREPRENEUR = 0
    ANGEL_INVESTOR = 1
    VENTURE_CAPITALIST = 2
    CONSULTANT = 3
    TECHNOLOGIST = 4
    BACKGROUND = (
        (ENTREPRENEUR, 'Entrepreneur'),
        (ANGEL_INVESTOR, 'Angel Investor'),
        (VENTURE_CAPITALIST, 'Venture Capitalist'),
        (CONSULTANT, 'Consultant'),
        (TECHNOLOGIST, 'Technologists'),
    )
    
    # Associate UserManager as the Manager for User
    objects = UserManager()

    # The unique identifier for the user is just going to be the email
    email = models.EmailField(max_length=75, unique=True, db_index=True)
    USERNAME_FIELD = 'email'

    # Other fields identifying the user
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_joined = models.DateTimeField(auto_now_add=True)

    affiliation = models.IntegerField(choices=AFFILIATION, null=True)
    background = models.IntegerField(choices=BACKGROUND, null=True)

    about = models.CharField(max_length=240,default=None, null=True)
    description = models.TextField(default=None, null=True)
    twitter_username = models.TextField(default=None, null=True)
    facebook = models.URLField(default=None, null=True)
    website = models.URLField(default=None, null=True)
    linkedin = models.URLField(default=None, null=True)
    
    featured = models.BooleanField(default=0)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    login_count = models.IntegerField(default = 0)
    
    image = models.ForeignKey('Images', blank = True, null= True, default= None, on_delete = SET_NULL)
    #image = models.ImageField(upload_to = "user/profile/", blank=True, null=True, default=None)
    #imagedate = models.DateTimeField(blank=True, null=True, default=None)
    
    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.first_name
    
    def get_created_companies(self):
    	return Company.objects.filter(company_creator = self)
   
    def get_latest_education(self):
        r = list(Education.objects.filter(user = self).order_by('-education_gradyear')[:1])
        if r:
            return r[0]
        return None
    
    def get_latest_job(self):
        r = list(Job.objects.filter(user = self).order_by('-job_start_year', '-job_start_month')[:1])
        if r:
            return r[0]
        return None
    
    def get_interests_as_list(self):
        return Interest.objects.filter(user = self)
    
    def get_follower_count(self):
        return UserConnection.objects.filter(userconnection_target_user = self).count()

    def get_following_count(self):
        return UserConnection.objects.filter(userconnection_follower = self).count()

    def get_posts_as_list(self):
        return Post.objects.filter(post_author = self)

    def get_user_profile_url(self):
        if self.image != None:
            return Images.objects.get(pk = self.image.pk).image.url
        else:
            if (Images.objects.filter(user_uploader = self.pk)): # if the code has an error and this user's image is not updated, then look in the images table for user foreign key
                for image in Images.objects.filter(user_uploader = self.pk):
                    if image.major_type == 1 and image.minor_type == 1:
                        return image.url
            else:
                return STATIC_URL+"assets/thumbnails/default.png"
        return STATIC_URL+"assets/thumbnails/default.png"

    def get_join_date(self):
        return self.date_joined.strftime('%b %e, %Y')
    
    def get_last_login_date(self):
        return self.last_login.strftime('%b %e, %Y')

    def __unicode__(self):
        return self.email

#macro function to get image urls of various profile elements of users
def get_user_information_image_url(model, minor_type, model_image):
        if model_image != None:
            return Images.objects.get(pk = model_image.pk).image.url
        else:
            return ""
        return ""

def upload_to_final(instance, filename):
    upload_to_final = '' 
    major_type = instance.major_type
    minor_type = instance.minor_type
    user_pk = instance.user_uploader.pk
    if instance.company_uploader != None:
        company_pk = instance.company_uploader.pk 
    if(major_type == 1):
        upload_to_final = (Images.MAJORTYPES[major_type-1])[1]+ '/' + (Images.MINORTYPES[minor_type-1])[1] + '/' + str(user_pk) + '/'+ filename
    elif (major_type == 2 and bool(company_pk)) == True:
        upload_to_final = (Images.MAJORTYPES[major_type-1])[1] + '/' + (Images.MINORTYPES[minor_type-1])[1] + '/' + str(company_pk) + '/'+ filename
    elif(major_type == 3):
        upload_to_final = Images.MAJORTYPES[major_type-1][1] + '/' + (Images.MINORTYPES[minor_type-1])[1] + '/'+filename
    return upload_to_final
    

class Images(models.Model):
    #CONSTANTS:
    USER, USERIMAGE, USER_IMAGE = (1,)*3
    COMPANY, JOB, USERJOB, USER_JOB = (2,)*4
    POST, PROJECT, PROJECTIMAGE = (3,)*3

    EDUCATION, USER_EDUCATION, USEREDUCATION = (4,)*3
    COMPANYTHUMBNAIL, COMPANY_THUMBNAIL = (5,)*2
    COMPANYCOVER, COVER, COMPANY_COVER, C_COVER, COMPANYIMAGE, COMPANY_IMAGE, C_IMAGE = (6,)*7
    COMPANYMEMBER, TEAMMEMBER, T_MEMBER, COMPANY_MEMBER, C_MEMBER = (7,)*5
    #The posts
    TEXTPOST, TEXT, FREE, FREEPOST, TEXT_POST, FREE_POST = (8,)*6
    EVENT, EVENTPOST, EVENT_POST, EVENTS = (9,)*4
    TEAMBUILDING, TEAMBUILDINGPOST, TEAMBUILDING_POST, TEAM_BUILDING_POST, TEAM_BUILDING, TEAM_POST = (10,)*6
    STARTUP, START_UP, STARTUPPOST, STARTUP_POST, START_UP_POST = (11,)*5
    MENTORING_POST, MENTORING, MENTORINGPOST = (12,)*3
    FUNDRAISING_POST, FUNDRAISING, FUNDRAISINGPOST, FUND_RAISING_POST = (13,)*4

    MAJORTYPES = (
        (1,'user'),
        (2,'company'),
        (3, 'post'),
    )

    MINORTYPES = (
        (1,'profile'),(2, 'job'),(3, 'project'),(4, 'education'),(5, 'image'),(6, 'cover'),(7, 'member'),(8, 'text'),(9, 'event'),
        (10, 'team_building'),(11, 'startup'),(12,'mentoring'),(13, 'fundraising'),
    )

    major_type = models.IntegerField(blank = False, choices = MAJORTYPES)
    minor_type = models.IntegerField(blank = False, choices = MINORTYPES)
    user_uploader = models.ForeignKey(User, blank = False, null = True, on_delete = models.SET_NULL, help_text='the person who uploaded this')
    company_uploader = models.ForeignKey('Company', blank= True, null = True, default=None, on_delete= models.SET_NULL, help_text='the company which uploaded this')
    image_date = models.DateTimeField(auto_now_add=True)
    #unique_type_identifier = models.CharField(str(major_type) + '/' + str(minor_type))
    in_use = models.BooleanField(default = True)

    image = models.ImageField(upload_to = upload_to_final)# user_uploader.pk ))#company_uploader.pk))
    caption = models.CharField(blank = True, null = True, default = None, max_length=50, help_text='title of the image. Can be useful for suggesting images. this is the same as the Porject, job, or education titles')


    class Meta:
        verbose_name = ('All the images of the system')
        verbose_name_plural = ('Images')



# Education stores education data about a user
class Education(models.Model):
    # Human-readable tuple for user types
    UNDERGRADUATE = 0
    GRADUATE = 1
    RESEARCHER = 2
    LEVEL = (
        (UNDERGRADUATE, 'Undergraduate'),
        (GRADUATE, 'Graduate'),
        (RESEARCHER, 'Researcher'),
    )
    user = models.ForeignKey(User)

    #the image stuff
    image = models.ForeignKey('Images', blank = True, null= True, default= None, on_delete = SET_NULL)
    education_school = models.TextField()
    education_level = models.IntegerField(choices=LEVEL, null=True)
    education_major = models.TextField()
    education_gradyear = models.IntegerField(max_length = 4)
    education_courses = models.TextField()                                      # This is a semi-colon delimted list.
    education_CETcertified = models.BooleanField(default=False, blank=True)
   
    def courses_as_list(self):
        if self.education_courses == '':
	       return None
        else:
    	   return self.education_courses.split(';')
   
    def get_education_picture_url(self):
        return get_user_information_image_url(self, Images.EDUCATION, self.image)
        """if bool(self.education_image)== False:
            return ''
        else:
            return self.education_image.url"""


# Job stores job data about a user
class Job(models.Model):
    MONTHS = (
        (0, None),  #if there is no end date
        (1,'Jan'),
        (2,'Feb'),
        (3,'Mar'),
        (4,'Apr'),
        (5,'May'),
        (6,'Jun'),
        (7,'Jul'),
        (8,'Aug'),
        (9,'Sep'),
        (10,'Oct'),
        (11,'Nov'),
        (12,'Dec'),
    )
   
    user = models.ForeignKey(User)


	#the image stuff
    image = models.ForeignKey('Images', blank = True, null= True, default= None, on_delete = SET_NULL)
    job_company = models.TextField()
    job_position = models.TextField()
    job_description = models.TextField()
    job_start_month = models.IntegerField(choices = MONTHS)
    job_start_year = models.IntegerField(max_length = 4)
    job_end_month = models.IntegerField(choices = MONTHS, blank=True, null=True, )#default=None)
    job_end_year = models.IntegerField(max_length = 4 , blank=True, null=True, )#default=None)   #if the person is still working there, this is set to 0. Python isn't allowing me to change it to null

    def get_job_picture_url(self):
        return get_user_information_image_url(self, Images.JOB, self.image)
    
    def get_job_end(self):
        if self.job_end_year == 0 and self.job_end_month == 0:
            return "Present"
        else:
            retstr = str(self.MONTHS[self.job_end_month][1]) + " " + str(self.job_end_year)
        return retstr

    def get_job_timeperiod(self):
        if self.job_start_month == 0 and self.job_start_year == 0 and self.job_end_year == 0 and self.job_end_month == 0:
            return 'Present'
        elif self.job_end_year == 0 and self.job_end_month == 0:
            return 'From ' + self.MONTHS[self.job_start_month][1] + ' ' + str(self.job_start_year) + ' to ' + ' Present'
        else:
            return 'From ' + self.MONTHS[self.job_start_month][1] + ' ' + str(self.job_start_year) + ' to ' + self.MONTHS[self.job_end_month][1] + " " + str(self.job_end_year)

# Project stores information about projects the user has worked on
class Project(models.Model):
    # Human-readable tuple
    MONTHS = (
        (1,'Jan'),
        (2,'Feb'),
        (3,'Mar'),
        (4,'Apr'),
        (5,'May'),
        (6,'Jun'),
        (7,'Jul'),
        (8,'Aug'),
        (9,'Sep'),
        (10,'Oct'),
        (11,'Nov'),
        (12,'Dec'),
    )
   
    user = models.ForeignKey(User)

    #the image stuff
    image = models.ForeignKey('Images', blank = True, null= True, default= None, on_delete = SET_NULL)
   
    project_name = models.TextField()
    project_position = models.TextField()
    project_description = models.TextField()
    project_start_month = models.IntegerField(choices = MONTHS)
    project_start_year = models.IntegerField(max_length = 4)
    project_end_month = models.IntegerField(choices = MONTHS)
    project_end_year = models.IntegerField(max_length = 4)
    
    def get_project_picture_url(self):
        return get_user_information_image_url(self, Images.PROJECT, self.image)
        """if bool(self.project_image)== False:
            return ''
        else:
            return self.project_image.url"""

    def get_project_timeperiod(self):
        retstr = "From " + self.MONTHS[self.project_start_month][1] + " " + str(self.project_start_year) + " to "
        if (self.project_end_year == 0 and self.project_end_month == 0) or (self.project_end_year >= datetime.datetime.now().year and self.project_end_month >= datetime.datetime.now().month):
            retstr = retstr + "Present"
        else:
            retstr = retstr + str(self.MONTHS[self.project_end_month][1]) + " " + str(self.project_end_year)
        return retstr


# Skill stores a user's skills
class Skill(models.Model):
    user = models.ForeignKey(User)
    skill = models.TextField()
# Interest stores a user's interests
class Interest(models.Model):
    user = models.ForeignKey(User)
    interest = models.TextField()
 
# Company stores information about companies on CET. Basis for company profiles.
class Company(models.Model):
    company_creator = models.ForeignKey(User)
    company_name = models.TextField()
    company_founded_year = models.IntegerField(max_length = 4)
    company_description = models.TextField()
    company_facebook = models.URLField(null=True, default=None)
    company_website = models.URLField(null=True, default=None)
    company_email = models.EmailField(null=True, default=None)
    company_demo = models.URLField(null=True, default=None)
    #the image stuff
    thumbnail = models.ForeignKey(Images, blank = True, null= True, default= None, on_delete = SET_NULL, related_name='c_profile')
    image = models.ForeignKey(Images, blank = True, null= True, default= None, on_delete = SET_NULL, related_name='c_image') #same thing as cover
    def get_members_as_list(self):
        return CompanyMember.objects.filter(company = self)
   
    def get_tags_as_list(self):
        return CompanyTag.objects.filter(company = self)
   
    def get_tags_as_string(self):
        l = CompanyTag.objects.filter(company = self).values('companytag_tag')
        return ';'.join(l['companytag_tag'] for l in l)
   
    def get_canvas_type_as_list(self, mytype):
        return CompanyCanvasItem.objects.filter(company = self, companycanvas_type = mytype)
   
    def get_canvas_type_as_string(self, mytype):
        l = CompanyCanvasItem.objects.filter(company = self, companycanvas_type = mytype).values('companycanvas_item')
        return ';'.join(l['companycanvas_item'] for l in l)

    def get_company_image_url(self):
        if self.image != None:
            return Images.objects.get(pk = self.image.pk).image.url
        else:
            return ""

    def get_company_cover_url(self):
        return self.get_company_image_url()

    def get_company_thumbnail_url(self):
        if bool(self.image) != False:
            return Images.objects.get(pk = self.image.pk).image.url
        else:
            return STATIC_URL+"assets/thumbnails/default_company.png"


# CompanyTag stores tag information about a company
class CompanyTag(models.Model):
    company = models.ForeignKey(Company)
    companytag_tag = models.TextField()

# CompanyMember keeps track of the people in companies
class CompanyMember(models.Model):

    company = models.ForeignKey(Company)
   
    companymember_name = models.TextField()
    companymember_position = models.TextField()
    companymember_description = models.TextField()
    #the image stuff
    image = models.ForeignKey(Images, blank = True, null= True, default= None, on_delete = SET_NULL)    # The team member may or may not have a profile. If they don't, leave the field blank.
    companymember_profile = models.ForeignKey(User, blank=True, null=True, default=None, on_delete=SET_NULL)

    def get_company_member_profile_url(self):
        if self.companymember_profile != None:
            return User.objects.get(pk = self.companymember_profile.pk).get_user_profile_url()
        else:
            if self.image != None:
                return Images.objects.get(pk = self.image.pk).image.url
            else:
                return ""


# CompanyCanvas stores the data from a company's canvas        
class CompanyCanvasItem(models.Model):
    # Human-readable tuple
    PARTNER = 0
    ACTIVITY = 1
    RESOURCE = 2
    VALUE = 3
    CUSTOMER = 4
    RELATIONSHIP = 5
    CHANNEL = 6
    COSTS = 7
    REVENUE = 8
    CANVAS_ELEMENT_TYPES = (
        (PARTNER,'Partner'),
        (ACTIVITY,'Activity'),
        (RESOURCE,'Resource'),
        (VALUE,'Value'),
        (CUSTOMER,'Customer'),
        (RELATIONSHIP,'Relationship'),
        (CHANNEL,'Channel'),
        (COSTS,'Costs'),
        (REVENUE,'Revenue'),
    )
   
    company = models.ForeignKey(Company)                                                            # Only allow for one canvas.
    companycanvas_item = models.TextField()
    companycanvas_type = models.IntegerField(choices=CANVAS_ELEMENT_TYPES)
 
# UserConnection defines relationships between users and companies in terms of being followed
# One of the target fields needs to be occupied. The other one will be NULL
class UserConnection(models.Model):
    # The person who follows a target
    userconnection_follower = models.ForeignKey(User, related_name='follower_user')
    # The person being followed
    userconnection_target_user = models.ForeignKey(User, related_name='target_user', default=None, null=True)              
    # The company being followed           
    userconnection_target_company = models.ForeignKey(Company, related_name='target_company', default=None, null=True)

# OfficeHours defines the time and location a user is availible
class OfficeHours(models.Model):
    officehours_time = models.DateTimeField()
    officehours_creator = models.ForeignKey(User)
    officehours_location = models.TextField()
       
 
# PostManager is a manager for Posts.
class PostManager(models.Manager):
    def get_popular(self, category, page):
        if(category == -1):
            return self.order_by('-post_popularity')[(page-1)*10:page*10]
        return self.filter(post_type = category).order_by('-post_popularity')[(page-1)*10:page*10]

    def get_recent(self, category, page):
        if(category == -1):
            return self.order_by('-post_timestamp')[(page-1)*10:page*10]
        return self.filter(post_type = category).order_by('-post_timestamp')[(page-1)*10:page*10]
 
# Post stores data about the posts made on the CET feed.
# All posts are stored in one table
# Leave fields as Null if they do not apply to a certain type of Post
class Post(models.Model):
    # Make Post types human readable
    TEXT_POST = 0
    EVENT_POST = 1
    TEAM_BUILDING_POST = 2
    STARTUP_HOSTING_POST = 3
    MENTORING_POST = 4
    FUNDRAISING_POST = 5
   
    POST_TYPES = (
        (TEXT_POST,'TextPost'),
        (EVENT_POST,'EventPost'),
        (TEAM_BUILDING_POST,'TeamBuildingPost'),
        (STARTUP_HOSTING_POST,'StartupHostingPost'),
        (MENTORING_POST,'MentoringPost'),
        (FUNDRAISING_POST,'FundraisingPost'),
    )
    objects = PostManager()

    image = models.ForeignKey(Images, blank = True, null= True, default= None, on_delete = SET_NULL)
    # General post and text post fields
    post_author = models.ForeignKey(User, related_name = 'author')
    post_type = models.IntegerField(choices = POST_TYPES)
    #       post_photo = models.ImageField(default=None)                            We'll get to image fields later.
    post_title = models.TextField()
    post_content = models.TextField()
    post_timestamp = models.DateTimeField(auto_now_add=True)
    post_link = models.URLField(default=None, null=True)
    post_popularity = models.DecimalField(max_digits=10, decimal_places = 2)
    
    post_featured = models.BooleanField(default = 0)
    post_flagged = models.BooleanField(default = 0)
    # Event post fields
    eventpost_location = models.TextField(default=None, null=True)
    eventpost_date_start = models.DateField(default=None, null=True)
    eventpost_time_start = models.TextField(default=None, null=True)
    eventpost_date_end = models.DateField(default=None, null=True)
    eventpost_time_end = models.TextField(default=None, null=True)
   
    # Mentoring post fields (These also use the eventpost fields)
    mentoringpost_name = models.TextField(default=None, null=True)
    mentoringpost_shortbio = models.TextField(default=None, null=True)
    mentoringpost_bio = models.TextField(default=None, null=True)
    mentoringpost_mentor_profile = models.ForeignKey(User, related_name = 'mentor', blank=True, null=True, default=None)
   
    # Fundraising post fields
    fundraisingpost_company = models.ForeignKey(Company, default=None, null=True)
    fundraisingpost_money = models.TextField(default=None, null=True)
   
    def get_comments(self):
        return Comment.objects.filter(comment_post = self)

    def get_comment_count(self):
        return Comment.objects.filter(comment_post = self).count()
   
    def get_like_count(self):
        return PostBump.objects.filter(postbump_post = self).count()
   
    def get_clip_count(self):
        return Clip.objects.filter(clip_post = self).count()
   
    def get_author_name(self):
        return self.post_author.get_full_name()
        #def get_author_profile_pic(self):
        #       return self.post_author.user_profile_pic
    
    def get_event_time_interval(self):
		ret_str = self.eventpost_date_start.strftime("%B") + " " + str(self.eventpost_date_start.day)
		try:
			if int(self.eventpost_date_start.strftime('%Y')) > datetime.datetime.now().year or int(self.eventpost_date_end.strftime('%Y')) > datetime.datetime.now().year or int(self.eventpost_date_start.strftime('%Y')) > int(self.eventpost_date_end.strftime('%Y')):
				ret_str = ret_str + ", " + self.eventpost_date_start.strftime('%Y')
		except:
			pass

		if self.eventpost_date_end != None:
			if not self.eventpost_date_end == self.eventpost_date_start:
				if self.eventpost_time_start != None:
					ret_str = ret_str + " at " + self.eventpost_time_start
				ret_str = ret_str + " until " + self.eventpost_date_end.strftime("%B") + " " + str(self.eventpost_date_end.day)
				if int(self.eventpost_date_start.strftime('%Y')) > datetime.datetime.now().year or int(self.eventpost_date_end.strftime('%Y')) > datetime.datetime.now().year or int(self.eventpost_date_start.strftime('%Y')) > int(self.eventpost_date_end.strftime('%Y')):
					ret_str = ret_str + ", " + self.eventpost_date_end.strftime('%Y')
				if self.eventpost_time_end != None:
					ret_str = ret_str + " at " + self.eventpost_time_end
			elif self.eventpost_time_start != None:
				if self.eventpost_time_end != None:
					ret_str = ret_str + " from " + self.eventpost_time_start + " to " + self.eventpost_time_end
				else:
					ret_str = ret_str + " at " + self.eventpost_time_start
			elif self.eventpost_date_end == self.eventpost_date_start and self.eventpost_time_end == None:
				self.eventpost_date_end = None
				ret_str = self.eventpost_date_start.strftime("%B") + " " + str(self.eventpost_date_start.day)
				return ret_str
		elif self.eventpost_time_start != None:
			ret_str = ret_str + " at " + self.eventpost_time_start
		return ret_str

    def get_timestamp(self):
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        d = self.post_timestamp
        delta = now - d
        s = delta.seconds
        if delta.days > 7 or delta.days < 0:
            return d.strftime('%e %b %Y')
        elif delta.days == 1:
            return '1 day ago'
        elif delta.days > 1:
            return '{} days ago'.format(delta.days)
        elif s <= 1:
            return 'just now'
        elif s < 60:
            return '{} seconds ago'.format(s)
        elif s < 120:
            return '1 minute ago'
        elif s < 3600:
            return '{} minutes ago'.format(s/60)
        elif s < 7200:
            return '1 hour ago'
        else:
            return '{} hours ago'.format(s/3600)

    def get_tags_as_list(self):
        return PostTag.objects.filter(posttag_post = self)
   
    def get_potential_positions_as_list(self):
        return PotentialPosition.objects.filter(post = self)
   
    def get_startup_team_members_as_list(self):
        return StartupTeamMember.objects.filter(post = self)

    def get_post_image_url(self):
        if self.image != None:
            return (Images.objects.get(pk = self.image.pk)).image.url
        else:
            return ""

    def get_post_author_image(self):
        return self.post_author.get_user_profile_url()


# PotentialMember stores data about the people that TEAM_BUILDING_POSTs are looking for.
class PotentialPosition(models.Model):
    post = models.ForeignKey(Post)
    potentialposition_position = models.TextField()
    potentialposition_quantity = models.TextField()
    potentialposition_skills = models.TextField()
   
    def get_skills_as_list(self):
        return self.potentialposition_skills.split(";")
 
# StartupTeamMember stores data about the people in a startup in a STARTUP_HOSTING_POST
class StartupTeamMember(models.Model):
    # If the member is a user in the db, then the name is autofilled.
    post = models.ForeignKey(Post)
    startupteammember_profile = models.ForeignKey(User, blank=True, null=True, default=None)
    startupteammember_name = models.TextField()
    startupteammember_position = models.TextField()
   
    def get_team_member_profile(self):
        return self.startupteammember_profile
 
# Tag stores information about the tags a Post is made with
class PostTag(models.Model):
    posttag_post = models.ForeignKey(Post)
    posttag_tag = models.TextField()
 
# Comment stores comments on posts.
# Comments are linear (Facebook style). No cascade.
class Comment(models.Model):
    comment_post = models.ForeignKey(Post)
    comment_author = models.ForeignKey(User)
    comment_content = models.TextField()
    comment_timestamp = models.DateTimeField(auto_now=True)

    def get_timestamp(self):
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        d = self.comment_timestamp
        delta = now - d
        s = delta.seconds
        if delta.days > 7 or delta.days < 0:
            return d.strftime('%e %b %y')
        elif delta.days == 1:
            return '1 day ago'
        elif delta.days > 1:
            return '{} days ago'.format(delta.days)
        elif s <= 1:
            return 'just now'
        elif s < 60:
            return '{} seconds ago'.format(s)
        elif s < 120:
            return '1 minute ago'
        elif s < 3600:
            return '{} minutes ago'.format(s/60)
        elif s < 7200:
            return '1 hour ago'
        else:
            return '{} hours ago'.format(s/3600)

    def get_like_count(self):
        return CommentBump.objects.filter(commentbump_comment = self).count()

    def get_comment_author_image(self):
        author = self.comment_author
        if bool(author.image) == False:
            return STATIC_URL+"assets/thumbnails/default.png"
        else:
            return author.image.url


	def get_comment_author_image(self):
		author = self.comment_author
		if bool(author.image) == False:
			return STATIC_URL+"assets/thumbnails/ego.png"
		else:
			return author.image.url

# Clip stores data about the posts a user or company has saved
class Clip(models.Model):
    clip_user = models.ForeignKey(User)
    clip_post = models.ForeignKey(Post)
 
# Bump stores data about the posts a user has bumped
class PostBump(models.Model):
    postbump_user = models.ForeignKey(User)
    postbump_post = models.ForeignKey(Post)
# CommentBump stores data about a comment that a user has bumped
class CommentBump(models.Model):
    commentbump_user = models.ForeignKey(User)
    commentbump_comment = models.ForeignKey(Comment)
 
# Message for the messaging system
class Message(models.Model):
    message_sender = models.ForeignKey(User, related_name="sender")
    message_reciever = models.ForeignKey(User, related_name="reciever")
    message_text = models.TextField()
