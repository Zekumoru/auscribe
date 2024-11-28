import { ChangeEvent, FormEvent, useState } from 'react';

export function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0)
      return setFile(null);
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return setStatus('Please select an audio file to upload.');

    const formData = new FormData();
    formData.append('audio', file);

    try {
      setStatus('Processing audio...');

      const response: Response = await fetch(
        'https://auscribe-api.zekumoru.com/api/transcribe',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) return setStatus('Cannot upload audio file');

      const data = (await response.json()) as {
        status: number;
        message: string;
      };

      if (!data) {
        setStatus('An error occurred while processing the audio file.');
        return;
      }

      const blob = new Blob([data.message], { type: 'text/plain ' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `${file.name.substring(
        0,
        file.name.lastIndexOf('.')
      )}.srt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      setStatus('Audio has been processed successfully!');
    } catch (error) {
      if (error instanceof Error)
        setStatus(`An error occurred: ${error.message}`);
      else setStatus('An unknown error occurred.');
    }
  };

  return (
    <main className="flex flex-col justify-center p-4 min-h-screen max-w-4xl m-auto">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label htmlFor="audio">Select an audio</label>
        <input
          id="audio"
          name="audio"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={status.startsWith('Processing')}
        />
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 disabled:text-gray-600 disabled:bg-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          disabled={status.startsWith('Processing')}
        >
          Upload
        </button>
      </form>
      {status && <p>Status: {status}</p>}
    </main>
  );
}

export default App;
