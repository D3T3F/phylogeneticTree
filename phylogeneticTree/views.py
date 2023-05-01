from django.shortcuts import render
from django.http import JsonResponse
from .models import Species


# Create your views here.


def index(request):
    return render(request, 'index.html')


def species_data(request):
    data = Species.objects.values('name', 'description')
    return JsonResponse(list(data), safe=False)


def graphics(request):
    return render(request, 'graphics.html')


def species(request, specie):
    try:
        data = Species.objects.get(name=specie)
        return render(request, 'species_page/species.html', {
            'name': data.name,
            'description': data.description
        })
    except:
        return render(request, 'species_page/not_found.html', {
            'name': specie
        })
