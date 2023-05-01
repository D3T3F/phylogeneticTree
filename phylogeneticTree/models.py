from django.db import models


# Create your models here.

class Species(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'species'
