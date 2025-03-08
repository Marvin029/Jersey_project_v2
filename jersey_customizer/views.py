from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
import json
import os
from django.conf import settings

def home(request):
    return render(request, 'jersey_customizer/home.html')

def jersey_customizer(request):
    patterns = get_patterns()
    return render(request, 'jersey_customizer/customizer.html', {
        'patterns': patterns
    })

def pre_order(request):
    return render(request, 'jersey_customizer/pre-order.html')

def about(request):
    return render(request, 'jersey_customizer/about.html')

def logout_view(request):
    logout(request)
    return redirect('home')

def get_patterns():
    pattern_dir = os.path.join(settings.BASE_DIR, 'static', 'patterns')
    if not os.path.exists(pattern_dir):
        os.makedirs(pattern_dir, exist_ok=True)
        return []
    
    try:
        patterns = [f for f in os.listdir(pattern_dir) if f.endswith('.png')]
        return [os.path.splitext(p)[0] for p in patterns]
    except:
        return []

@csrf_exempt
def save_design(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # In a real application, you would save this to your database
        # For now, we'll just return success
        return JsonResponse({
            "status": "success",
            "message": "Design saved successfully"
        })
    return JsonResponse({
        "status": "error",
        "message": "Invalid request method"
    })