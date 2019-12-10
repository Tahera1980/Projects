from django import forms
from .models import Comment

# class CommentForm(forms.Form):
# 	content_type = forms.CharField(widget=forms.HiddenInput, required=False)
# 	object_id = forms.IntegerField(widget=forms.HiddenInput, required=False)
# 	content = forms.CharField(label="", widget=forms.Textarea)

class CommentForm(forms.ModelForm):
	# posts = forms.CharField(widget=forms.HiddenInput, required=False)
	# content_type = forms.CharField(widget=forms.HiddenInput, required=False)
	parent_id = forms.IntegerField(widget=forms.HiddenInput, required=False)
	class Meta:
		model = Comment
		fields = [
		"content",
		# "parent",
		# "parent_id",
		]