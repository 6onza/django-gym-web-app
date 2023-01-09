from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication


class LoginView(APIView):

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        try:
            user = User.objects.create_user(username, email, password)
        except IntegrityError:
            return Response({"error": "That username has already been taken. Please choose a new username"},
                            status=status.HTTP_400_BAD_REQUEST)
        token = Token.objects.create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)

class VerifyAuthView(APIView):
    authentication_classes = (TokenAuthentication,)

    def __init__(self):
        self.authentication = TokenAuthentication()

    def post(self, request):
        user, _ = self.authentication.authenticate_credentials(request.META.get("HTTP_AUTHORIZATION"))
        if user is not None:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)