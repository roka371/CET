from django.http import HttpResponse, HttpResponseRedirect
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from feed.models import *
from django.utils.timezone import utc
import datetime
from PIL import Image
'''
class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ['email', 'password', 'is_active']

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]
'''
class UserProfilePictureForm(forms.Form):
	user_image = forms.ImageField(
		label = "Select a profile picture",
		help_text='Upload a picture for your profile picture')

class UserProjectPictureForm(forms.Form):
	project_image = forms.ImageField(
		label = "Select a project picture",
		help_text='Upload a picture for your project picture')

class UserEducationPictureForm(forms.Form):
	education_image = forms.ImageField(
		label = "Select a education picture",
		help_text='Upload a picture for your education picture')

class UserJobPictureForm(forms.Form):
	job_image = forms.ImageField(
		label = "Select a job picture",
		help_text='Upload a picture for your job picture')

class CompanyProfilePictureForm(forms.Form):
	company_image = forms.ImageField(
		label = "Select a company picture",
		help_text='Upload a picture for your profile picture')

class CompanyCoverPictureForm(forms.Form):
	company_cover = forms.ImageField(
		label = "Select a company cover",
		help_text='Upload a picture for your profile picture')

class CompanyMemberPictureForm(forms.Form):
	member_image = forms.ImageField(
		label = "Select a team member picture",
		help_text='Upload a picture for your member picture')

class PostPictureForm(forms.Form):
	post_image = forms.ImageField(
		label = "Select a team member picture",
		help_text='Upload a picture for your member picture')