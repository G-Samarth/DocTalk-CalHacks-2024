import os
from deepgram import Deepgram
from dotenv import load_dotenv
import json

from deepgram import(
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)

# Load env variable
load_dotenv()

# Get the current file's directory
# current_dir = os.path.dirname(os.path.abspath(_file_))

# Access a file in the same directory
# AUDIO_FILE_PATH = os.path.join(current_dir, 'audiofile.wav')

# Fetch API key from env file
API_KEY = os.getenv("DG_API_KEY")

def main(audio_file_path):
    try:
        # STEP 1 Create a Deepgram client using the API key
        deepgram = DeepgramClient(API_KEY)

        with open(audio_file_path, "rb") as file:
            buffer_data = file.read()

        payload: FileSource = {
            "buffer": buffer_data,
        }

        #STEP 2: Configure Deepgram options for audio analysis
        options = PrerecordedOptions(
            model="nova-2-medical",
            punctuate= True,
            smart_format=True,
            diarize= True,
            language= 'en-US',
        )

        # STEP 3: Call the transcribe_file method with the text payload and options
        response = deepgram.listen.rest.v("1").transcribe_file(payload, options, timeout = 300)

        # STEP 4: return the response
        response = response.to_json(indent=4)
        transcript = json.loads(response)
        return transcript['results']['channels'][0]['alternatives'][0]['paragraphs']['transcript']

    # Error handling for no file found
    except FileNotFoundError:
        print(f"Audio file not found at path: {audio_file_path}")    

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "_main_":
    main()