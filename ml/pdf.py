import json
import random
import pdfkit
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, storage

# Load JSON data
# with open('output.json') as f:
#     data = json.load(f)

cred = credentials.Certificate(os.getenv('FIREBASE_ADMIN_SDK'))
firebase_admin.initialize_app(cred, {
    'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')  # Your Firebase Storage bucket name
})

# Function to generate random appointment time within the next week
def generate_random_appointment():
    # Generate a random day within the next 7 days
    today = datetime.today()
    random_day = today + timedelta(days=random.randint(1, 7))
    
    # Generate a random time between 8 AM and 6 PM
    random_hour = random.randint(8, 17)  # Business hours: 8 AM to 5 PM
    random_minute = random.randint(0, 59)
    
    # Set the appointment time
    appointment_time = random_day.replace(hour=random_hour, minute=random_minute)
    
    # Format date and time
    appointment_date = appointment_time.strftime("%b %d, %Y")
    appointment_time_str = appointment_time.strftime("%I:%M %p")
    
    return appointment_date, appointment_time_str

# Get random appointment date and time
# next_appointment_date, next_appointment_time = generate_random_appointment()

def generate_pdf(audio_file_path):
    with open(audio_file_path, 'r') as f:
        data = json.load(f)
    # Get random appointment date and time
    next_appointment_date, next_appointment_time = generate_random_appointment()

    patient_number = random.randint(1000000000, 9999999999)

    # Example HTML Template with dynamic content
    html_template = """
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f9f9f9;
        }}
        .header {{
            background-color: #C44D35;
            color: white;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            padding: 20px 0;
            margin-bottom: 0;
        }}
        .sub-header {{
            background-color: black;
            color: white;
            display: flex;
            justify-content: space-between;
            padding: 10px 40px;
            font-size: 14px;
            font-weight: bold;
        }}
        .section {{
            margin-bottom: 30px;
        }}
        .section-title {{
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }}
        .field-box {{
            border: 1px solid black;
            height: 80px;
            margin-bottom: 20px;
            padding: 10px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 40px;
        }}
        table, th, td {{
            border: 1px solid black;
        }}
        th, td {{
            padding: 10px;
            text-align: left;
        }}
        th {{
            background-color: #f2f2f2;
            font-weight: bold;
        }}
        .signature {{
            margin-top: 40px;
            font-size: 14px;
        }}
        .footer {{
            margin-top: 30px;
            border-top: 1px solid #000;
            padding-top: 10px;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <div class="header">
        Your Conslt Prescription
    </div>

    <div class="sub-header">
        <div>CONSLT.AI</div>
        <div>DATE: {date}</div>
    </div>

    <table>
        <tr>
            <th>Date:</th>
            <td>{date}</td>
            <th>Time:</th>
            <td>{time}</td>
        </tr>
        <tr>
            <th>Name:</th>
            <td>John Doe</td>
            <th>Age:</th>
            <td>48 years</td>
        </tr>
        <tr>
            <th>Hospital:</th>
            <td>Stanford Health</td>
            <th>Height:</th>
            <td>181 cm</td>
        </tr>
        <tr>
            <th>Contact info:</th>
            <td>+1(408) 000-000</td>
            <th>Weight:</th>
            <td>74 Kg</td>
        </tr>
    </table>

    <div class="section">
        <div class="section-title">Reason for Visit</div>
        <div class="field-box">{reason_for_visit}</div>
    </div>

    <div class="section">
        <div class="section-title">Doctor's Comments</div>
        <div class="field-box">{doctors_comments}</div>
    </div>

    <div class="section">
        <div class="section-title">Prescription & Instructions</div>
        <div class="field-box">{prescription}</div>
    </div>

    <div class="signature">
        <div>Signature: ______________________</div>
    </div>

    <div class="footer">
        Follow Up Date: {next_appointment_date} | Time: {next_appointment_time}
    </div>

    <div class="patient-number">
        Patient Number: {patient_number}
    </div>
</body>
</html>
"""

    # Assuming medicines, exercises, and tests are dictionaries, use their values for concatenation
    # prescription=", ".join(list(data["medicines"].values()) + list(data["exercises"].values()) + list(data["tests"].values()))

    # Fill HTML template with dynamic content
    filled_html = html_template.format(
    date=datetime.today().strftime("%b %d, %Y"),
    time="10:00 AM",
    reason_for_visit=data["diagnosis"],
    doctors_comments=data["summary"],
    prescription=", ".join(data["medicines"] + data["exercises"] + data["tests"]),
    next_appointment_date=next_appointment_date,
    next_appointment_time=next_appointment_time,
    patient_number=patient_number
)

    # Generate the PDF from the filled HTML
    pdf_filename = f'{patient_number}.pdf'
    pdfkit.from_string(filled_html, pdf_filename)

    # Upload the PDF to Firebase Storage
    try:
        bucket = storage.bucket()  # Get a reference to the storage bucket
        blob = bucket.blob(f'pdfs/{pdf_filename}')  # Create a unique path for the PDF in Firebase Storage
        blob.upload_from_filename(pdf_filename)
        print("PDF successfully uploaded to Firebase Storage.")
    except Exception as e:
        print(f"Failed to upload PDF: {e}")
