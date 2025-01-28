using System.Net.WebSockets;
using System.Speech.Recognition;
using System.Text;
using NAudio.Wave;
using NAudio.Lame;
using OpenCvSharp;

namespace ClientC
{
    public abstract class Program
    {
        private static Point? _point;
        private static ClientWebSocket? _client;

        private static void RecognizeSpeech()
        {
            SpeechRecognitionEngine recognizer = new SpeechRecognitionEngine(new System.Globalization.CultureInfo("fr-FR"));
            recognizer.SetInputToDefaultAudioDevice();

            // Ajouter des mots-clés à reconnaître
            Choices commands = new Choices();
            commands.Add("Appeler");

            GrammarBuilder gb = new GrammarBuilder();
            gb.Culture = new System.Globalization.CultureInfo("fr-FR");
            gb.Append(commands);

            Grammar grammar = new Grammar(gb);
            recognizer.LoadGrammar(grammar);

            recognizer.SpeechRecognized += (sender, e) =>
            {
                foreach (var result in e.Result.Words)
                {
                    if (result.Text == "Appeler")
                    {
                        Console.WriteLine("Commande reconnue : Appeler");
                        Task.Run(StartClient); // Démarre le client dans un thread séparé
                    }
                }
            };

            recognizer.RecognizeAsync(RecognizeMode.Multiple);
            Console.WriteLine("Reconnaissance vocale en cours... Dites 'Appeler' pour démarrer le client.");
        }

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

        static void SendAudioAsync(object? obj, WaveInEventArgs args)
        {
            if (_client == null)
                return;

            if (_client.State != WebSocketState.Open)
                return;

            // Encoder les données PCM en MP3
            byte[] mp3Bytes = ConvertToMp3(args.Buffer);

            // Ajouter un en-tête pour indiquer qu'il s'agit d'audio MP3
            byte[] header = { 0x02 }; // En-tête spécifiant que ce sont des données audio MP3
            byte[] audioBytes = header.Concat(mp3Bytes).ToArray();

            // Envoyer les données MP3 via WebSocket
            _client.SendAsync(new ArraySegment<byte>(audioBytes), WebSocketMessageType.Binary, true, CancellationToken.None);
        }

        static byte[] ConvertToMp3(byte[] pcmData)
        {
            using (var ms = new System.IO.MemoryStream())
            {
                // Créer un encodeur MP3 avec un taux de bits de 128 kbps
                using (var mp3Writer = new LameMP3FileWriter(ms, new WaveFormat(44100, 1), 128))
                {
                    mp3Writer.Write(pcmData, 0, pcmData.Length);
                }
                return ms.ToArray();
            }
        }

        static async Task StartClient()
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
                _client = new ClientWebSocket();
                await _client.ConnectAsync(new Uri(serverUri), CancellationToken.None);

                var messageBytes = "infirmier"u8.ToArray();
                var buffer = new ArraySegment<byte>(messageBytes);
                await _client.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                Console.WriteLine("Connexion au serveur WebSocket réussie. Capture en cours...");
                var window = new Window("Flux Vidéo");
                window.Resize(640, 480);
                using var mat = new Mat();
                var waveIn = new WaveInEvent();
                waveIn.WaveFormat = new WaveFormat(44100, 1);
                waveIn.DataAvailable += SendAudioAsync;
                waveIn.StartRecording();

                ReceiveDataAsync(_client, 640, 480);

                // Lire et envoyer des images en boucle
                var cancellationToken = CancellationToken.None;

                while (_client.State == WebSocketState.Open)
                {
                    capture.Read(mat); // Capturer une frame
                    if (mat.Empty()) break;

                    if (_point.HasValue)
                        Cv2.Circle(mat, _point.Value, 5, new Scalar(0, 0, 255), -1);

                    window.ShowImage(mat);

                    // Encoder l'image en JPEG
                    byte[] header = { 0x01 };
                    byte[] imageBytes = header.Concat(mat.ToBytes(".jpg")).ToArray();
                    // Envoyer les données via WebSocket
                    await _client.SendAsync(
                        new ArraySegment<byte>(imageBytes),
                        WebSocketMessageType.Binary,
                        true,
                        cancellationToken
                    );

                    Console.WriteLine($"Frame envoyée ({imageBytes.Length} octets)");

                    // Pause pour limiter la fréquence (par exemple, 30 FPS)
                    Cv2.WaitKey(50); // Attendre ~33ms pour 30 FPS
                }

                waveIn.StopRecording();
                // Fermer la connexion WebSocket proprement
                await _client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Fermeture normale", cancellationToken);
                Console.WriteLine("Connexion WebSocket fermée.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur : " + ex.Message);
            }
        }

        static void Main()
        {
            RecognizeSpeech(); // Activer la reconnaissance vocale
            Console.WriteLine("Appuyez sur une touche pour quitter...");
            Console.ReadKey(); // Maintenir l'application ouverte
        }
    }
}
