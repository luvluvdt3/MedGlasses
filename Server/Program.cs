using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
app.UseWebSockets();

byte[] lastImage;
Dictionary<String, WebSocket> connectedClients = []; // Liste pour garder les autres clients

app.Map("/ws", async context =>
{
if (context.WebSockets.IsWebSocketRequest)
{
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        Console.WriteLine("Client WebSocket connected.");

        var buffer = new byte[1024 * 4];
        var rec = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        var clientType = Encoding.UTF8.GetString(buffer, 0, rec.Count).Trim();

        if (clientType == "infirmier")
        {
            connectedClients.Add(clientType, webSocket);
            await HandleInfirmierrsync(webSocket);
            connectedClients.Remove(clientType);
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
        }
        else if (clientType == "Medecin")
        {
            connectedClients.Add(clientType, webSocket);
            await HandleMedecinnsync(webSocket);
            connectedClients.Remove(clientType);
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
        }
        else
        {
            Console.WriteLine("Unknown client type: " + clientType);
            await webSocket.CloseAsync(WebSocketCloseStatus.InvalidPayloadData, "Unknown client type", CancellationToken.None);
        }
}
else
{
        context.Response.StatusCode = 400;
}
});


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => "Hello World!");


app.MapGet("/client-ip", (HttpContext context) =>
{
    var clientIp = context.Connection.RemoteIpAddress?.ToString();
    return Results.Ok(new { ClientIP = clientIp });
});

app.Run("http://0.0.0.0:5000");
return;

async Task HandleMedecinnsync(WebSocket socket)
{
    while (socket.State == WebSocketState.Open)
    {
        var buffer = new byte[1024 * 4];
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        
        if (result.MessageType == WebSocketMessageType.Text)
        {
            if (!connectedClients.TryGetValue("infirmier", out var infirmier)) 
                continue;
            
            await infirmier.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}

async Task HandleInfirmierrsync(WebSocket socket)
{
    
    // Écouter et traiter les messages WebSocket
    while (socket.State == WebSocketState.Open)
    {
        var buffer = new byte[1024 * 128];
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Binary)
        {
            // Sauvegarder la dernière image reçue
            lastImage = new byte[result.Count];
            Array.Copy(buffer, lastImage, result.Count);
            Console.WriteLine($"Binary data received: {result.Count} bytes");

            if (!connectedClients.TryGetValue("Medecin", out var medecin)) 
                continue;
            Console.WriteLine(lastImage.Length);
            
            await medecin.SendAsync(new ArraySegment<byte>(lastImage), WebSocketMessageType.Binary, true, CancellationToken.None);
        }
    }
}