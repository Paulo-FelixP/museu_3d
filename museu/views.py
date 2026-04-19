from django.shortcuts import render

def museu_view(request):
    return render(request, 'museu/museu.html')