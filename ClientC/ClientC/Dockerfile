FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

WORKDIR /app

COPY . .

RUN dotnet restore ClientC.csproj

RUN dotnet build ClientC.csproj --configuration Release

RUN dotnet publish ClientC.csproj --configuration Release --output /app/publish --runtime win-x64 --self-contained

