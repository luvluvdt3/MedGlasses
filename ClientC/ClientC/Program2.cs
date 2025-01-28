using SIPSorcery.Net;
using SIPSorceryMedia.Abstractions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

class Program2
{
    public static byte[] ConvertRGBToYUV420(Image<Rgba32> image)
    {
        int width = image.Width;
        int height = image.Height;

        // Allocate the YUV420 frame (Y, U, V planes)
        byte[] yuv420 = new byte[width * height * 3 / 2];
    
        int yIndex = 0, uIndex = width * height, vIndex = uIndex + (width * height) / 4;

        // Convert RGB to YUV420 (simplified)
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                var pixel = image[x, y];
                byte r = pixel.R;
                byte g = pixel.G;
                byte b = pixel.B;

                // YUV conversion formula (ITU-R BT.601)
                byte yValue = (byte)(0.299 * r + 0.587 * g + 0.114 * b);
                byte uValue = (byte)(-0.169 * r - 0.331 * g + 0.499 * b + 128);
                byte vValue = (byte)(0.499 * r - 0.418 * g - 0.0813 * b + 128);

                // Y plane
                yuv420[yIndex++] = yValue;

                // U and V planes (subsampled at 2x2)
                if (y % 2 == 0 && x % 2 == 0)
                {
                    yuv420[uIndex++] = uValue;
                    yuv420[vIndex++] = vValue;
                }
            }
        }

        return yuv420;
    }
    
    static void Main2(string[] args)
    {
        // Initialize WebRTC peer connection
        var peerConnection = new RTCPeerConnection();
        byte[] picture = File.ReadAllBytes("../../../picture/test.jpg");

        // Create a video track
        VideoFormat videoFormat = new VideoFormat
        {
            Codec = VideoCodecsEnum.VP8
        };
        var videoTrack = new MediaStreamTrack(videoFormat, MediaStreamStatusEnum.SendOnly);

        peerConnection.addTrack(videoTrack);
        peerConnection.SendVideo(900, picture);
        Console.WriteLine("Press any key to stop...");
        Console.ReadKey();
    }
}
