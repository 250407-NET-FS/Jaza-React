FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY *.sln .
COPY Project-2.API/*.csproj ./Project-2.API/
COPY Project-2.Data/*.csproj ./Project-2.Data/
COPY Project-2.Models/*.csproj ./Project-2.Models/
COPY Project-2.Services/*.csproj ./Project-2.Services/
COPY Project-2.Tests/*.csproj ./Project-2.Tests/
RUN dotnet restore

COPY . .
WORKDIR /src/Project-2.API
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /src
COPY --from=build /src/Project-2.API/out ./
ENTRYPOINT ["dotnet", "Project-2.API.dll"]