from django.db import models

class JerseyDesign(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    jersey_type = models.CharField(max_length=20)
    
    # Front design
    front_primary_color = models.CharField(max_length=7)
    front_secondary_color = models.CharField(max_length=7)
    front_text_color = models.CharField(max_length=7)
    front_number = models.CharField(max_length=2, blank=True)
    front_pattern = models.CharField(max_length=50, blank=True)
    front_logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    front_logo_size = models.FloatField(default=0.5)
    
    # Back design
    back_primary_color = models.CharField(max_length=7)
    back_secondary_color = models.CharField(max_length=7)
    back_text_color = models.CharField(max_length=7)
    back_name = models.CharField(max_length=15, blank=True)
    back_number = models.CharField(max_length=2, blank=True)
    back_pattern = models.CharField(max_length=50, blank=True)
    back_logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    back_logo_size = models.FloatField(default=0.5)
    
    def __str__(self):
        return self.name