import fs from 'fs/promises';
import { createClient, srt } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const transcribe = async (filepath: string): Promise<string> => {
  const file = await fs.readFile(filepath);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    file,
    {
      model: 'nova-2',
      language: 'it',
      smart_format: true,
    }
  );

  if (error) {
    throw error;
  }

  return srt(result);
};

export default transcribe;
