from flask import Flask, request, jsonify
import os
import json
import re
from groq import Groq
from audio_to_text import main as get_transcription
from pdf import generate_pdf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

@app.route('/process_transcription', methods=['POST'])
def process_transcription():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    
    # Save the file temporarily
    temp_path = 'temp_audio.wav'
    audio_file.save(temp_path)

    # Call the main method to get transcription
    transcription = get_transcription(temp_path)

    # Remove the temporary file
    os.remove(temp_path)

    if not transcription:
        return 'Transcription failed or empty', 500

    # Create a custom prompt for Groq to extract information
    prompt = f"""
   <s> [INST] Given the following conversation between a doctor and a patient, please extract and provide the following information in JSON format:
    1. Medicines prescribed.
    2. Timings for when to take medicine.
    3. Exercises or other non-medicinal recommendations.
    4. Diagnosis by the doctor.
    5. Next appointment or follow-up details.
    6. Tests that the patient needs to undergo.
    7. A summary of the conversation.

    Maintain the order. And if any of these are not found in the conversation, you can skip it completely.
    Conversation:
    {transcription}
    
    Please provide the output as a JSON object with keys: 'medicines', 'exercises', 'diagnosis', 'next_appointment', 'tests', and 'summary'. [/INST] </s>
    Don't have any key as two words. For example: use "next_appointment" rather than "next appointment"
    """

    # Send the transcription to Groq
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="mixtral-8x7b-32768",
    )

    # Get the response from Groq API
    response = chat_completion.choices[0].message.content

    # Extract the JSON part from the response
    json_match = re.search(r"\{.*\}", response, re.DOTALL)

    if json_match:
        json_str = json_match.group(0)  # Extract the matched JSON string

        # Try to load the JSON
        try:
          print("in try")
        
        # Save the JSON string directly to a file
          json_file_path = 'output_data.json'
          with open(json_file_path, 'w') as json_file:
              json_file.write(json_str)  # Write the JSON string directly
          
          # Pass the path to the JSON file to generate_pdf
          generate_pdf(json_file_path)

          return jsonify({"status": "PDF generated successfully"}), 200
        except Exception as e:
          return jsonify({"error": f"Error occurred: {e}"}), 500
    else:
        print("outoutoutout")
        return "No valid JSON found in the response.", 500
  
    return jsonify({"status": "PDF generated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)


# /Users/naisheel/Documents/calhacks/groq/bin/python /Users/naisheel/Documents/calhacks/audio_test.py
# /Users/naisheel/Documents/calhacks/groq/bin/python /Users/naisheel/Documents/calhacks/firstApi.py