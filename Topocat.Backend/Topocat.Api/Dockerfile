FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["Topocat.API/Topocat.API.csproj", "Topocat.API/"]
COPY ["Topocat.DB/Topocat.DB.csproj", "Topocat.DB/"]
COPY ["Topocat.Domain/Topocat.Domain.csproj", "Topocat.Domain/"]
COPY ["Topocat.Common/Topocat.Common.csproj", "Topocat.Common/"]
COPY ["Topocat.Services/Topocat.Services.csproj", "Topocat.Services/"]
RUN dotnet restore "Topocat.API/Topocat.API.csproj"
COPY . .
WORKDIR "/src/Topocat.API"
RUN dotnet build "Topocat.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Topocat.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Topocat.API.dll"]
