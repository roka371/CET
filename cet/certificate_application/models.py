#models in cert. app
from django.db import models
from datetime import datetime   

# Create your models here.
class Student(models.Model):
	student_id = models.CharField(max_length = 8)
	student_first_name = models.TextField()
	student_last_name = models.TextField()
	student_phone_number = models.CharField(max_length = 20)
	student_email = models.EmailField()
	student_major = models.TextField()
	student_is_mailed =  models.BooleanField()						# 0 if Picked up from CET, 1 if Mailed
	student_coursework = models.TextField()
	student_address_line_1 = models.TextField()
	student_address_line_2 = models.TextField()
	student_city = models.TextField()
	student_state = models.TextField()
	student_zip = models.CharField(max_length=5)
	student_comments = models.TextField()
	
	student_apply_date = models.DateTimeField(default=datetime.now)
	student_approved = models.BooleanField(default = 0)

	def get_courses_as_list(self):
		if self.student_coursework == '':
			return None
		else:
			return self.student_coursework.split(';')