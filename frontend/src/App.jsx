import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Youtube } from "lucide-react";
import axios from "axios";

const YouTubeDownloader = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://youtube-video-downloader-df60.onrender.com/download", { url }, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "video.mp4";
      link.click();

      setMessage("Download complete!");
    } catch (error) {
      setMessage("Failed to download video.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark">
      <div className="flex-grow flex justify-center items-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="bg-gray-800 rounded-t-lg border-b border-gray-700">
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center">
              <Youtube className="mr-2 text-red-500" size={32} />
              YouTube Video Downloader
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-800 rounded-b-lg p-6 space-y-4">
            <form onSubmit={handleDownload} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </form>
            {message && (
              <p className={`mt-4 text-center ${message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="bg-gray-900 text-white py-4 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} YouTube Downloader. Not affiliated with YouTube.
          </p>
          <div className="mt-2 text-xs text-gray-400">
            Please respect copyright laws and YouTube's terms of service.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YouTubeDownloader;