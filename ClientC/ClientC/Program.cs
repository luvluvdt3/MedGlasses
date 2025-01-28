using System.Net.WebSockets;
using System.Text;
using OpenCvSharp;

namespace ClientC
{
    public abstract class Program
    {
        private static Point? _point;
        static async Task ReceiveDataAsync(WebSocket socket, int width, int height)
        {
            var receiveBuffer = new byte[1024 * 4]; // Buffer pour la réception des messages
            while (socket.State == WebSocketState.Open)
            {
                try
                {
                    var result = await socket.ReceiveAsync(
                        new ArraySegment<byte>(receiveBuffer),
                        CancellationToken.None
                    );
                    
                    var receivedMessage = Encoding.UTF8.GetString(receiveBuffer, 0, result.Count);
                    string[] splitted = receivedMessage.Split(',');
                    int x = int.Parse(splitted[0]);
                    int y = int.Parse(splitted[1]);
                    Console.WriteLine(x + " " + y);
                    Console.WriteLine(width + " " + height);
                    
                    _point = new Point(width * (1.0 * x / 100), height * (1.0 * y / 100));
                    Console.WriteLine(_point.ToString());
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Erreur lors de la réception des données : " + ex.Message);
                }
            }
        }
        
        static async Task Main()
        {
            string serverUri = "ws://127.0.0.1:5000/ws"; // Adresse du serveur WebSocket

            try
            {
                // Initialiser la caméra
                using var capture = new VideoCapture(0); // 0 pour la caméra par défaut
                if (!capture.IsOpened())
                {
                    Console.WriteLine("Impossible d'accéder à la caméra.");
                    return;
                }

                // Connecter le client au serveur WebSocket
                using var clientWebSocket = new ClientWebSocket();
                await clientWebSocket.ConnectAsync(new Uri(serverUri), CancellationToken.None);

                var messageBytes = "infirmier"u8.ToArray();
                var buffer = new ArraySegment<byte>(messageBytes);
                await clientWebSocket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                Console.WriteLine("Connexion au serveur WebSocket réussie. Capture en cours...");
                var window = new Window("Flux Vidéo");
                window.Resize(640, 480);
                using var mat = new Mat();

                ReceiveDataAsync(clientWebSocket, 640, 480);
                
                // Lire et envoyer des images en boucle
                var cancellationToken = CancellationToken.None;
                
                while (clientWebSocket.State == WebSocketState.Open)
                {
                    capture.Read(mat); // Capturer une frame
                    if (mat.Empty()) break;

                    if (_point.HasValue)
                        Cv2.Circle(mat, _point.Value, 5, new Scalar(0, 0, 255), -1); 
                    
                    window.ShowImage(mat);

                    // Encoder l'image en JPEG
                    byte[] imageBytes = mat.ToBytes(".jpg");

                    // Envoyer les données via WebSocket
                    await clientWebSocket.SendAsync(
                        new ArraySegment<byte>(imageBytes),
                        WebSocketMessageType.Binary,
                        true,
                        cancellationToken
                    );

                    Console.WriteLine($"Frame envoyée ({imageBytes.Length} octets)");

                    // Pause pour limiter la fréquence (par exemple, 30 FPS)
                    Cv2.WaitKey(50); // Attendre ~33ms pour 30 FPS
                }

                // Fermer la connexion WebSocket proprement
                await clientWebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Fermeture normale", cancellationToken);
                Console.WriteLine("Connexion WebSocket fermée.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur : " + ex.Message);
            }
        }
    }
}
