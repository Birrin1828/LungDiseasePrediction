from flask import Flask, jsonify, send_file, request,send_from_directory
from flask_cors import CORS
import os
import numpy as np
from MODEL import fe
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

@app.route("/api/audio", methods=['POST'])
def process_audio():
    try:
        if 'audioFile' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audioFile']
        audio_file_path = './uploaded_audio.wav'
        audio_file.save(audio_file_path)

        probabilities = fe(audio_file_path)+100
        # serve_symptoms(probabilities)
        classes = ['Bronchiectasis', 'Bronchiolitis', 'COPD', 'Healthy', 'Pneumonia', 'URTI']

        plt.rcParams.update({'font.size': 50})
        plt.figure(figsize=(30, 16))
        bar_width=0.5
        plt.bar(classes, probabilities, width=bar_width,color='skyblue')
        plt.title('Probability of Each Class')
        plt.xlabel('Classes')
        plt.ylabel('Probability')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        graph_path = 'disease_graph.png'
        plt.savefig(graph_path)
        plt.close()  # Close the plot to free up resources

        # Return the generated image
        return send_file(graph_path, mimetype='image/png')

    except Exception as e:
        # Log the exception for debugging purposes
        app.logger.error(f"Error processing audio: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

    # finally:
    #     # Clean up the uploaded audio file and the generated image
    #     if os.path.exists(audio_file_path):
    #         os.remove(audio_file_path)
    #     if 'graph_path' in locals() and os.path.exists(graph_path):
    #         os.remove(graph_path)


# @app.route("/api/symptoms")
# def serve_symptoms():
#     probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]  # Example probabilities, replace with actual probabilities from your backend
#     symptoms_array = np.array([
#         ["Bronchiectasis", "Chronic cough", "Production of large amounts of sputum (phlegm)", "Shortness of breath", "Chest pain", "Recurrent respiratory infections"],
#         ["Bronchiolitis", "Runny or stuffy nose", "Cough", "Mild fever", "Wheezing", "Rapid breathing"],
#         ["COPD", "Shortness of breath, especially during physical activities", "Wheezing", "Chest tightness", "Chronic cough with mucus production", "Fatigue", "Frequent respiratory infections"],
#         ["Healthy", "No significant respiratory symptoms or abnormalities"],
#         ["Pneumonia", "Cough, which may produce greenish, yellow or even bloody mucus", "Fever, sweating and shaking chills", "Shortness of breath", "Rapid, shallow breathing", "Sharp or stabbing chest pain that gets worse when you breathe deeply or cough"],
#         ["URTI", "Runny or congested nose", "Sneezing", "Cough", "Sore throat", "Mild headache", "Mild body aches", "Low-grade fever"]
#     ])
#     max_prob_index = np.argmax(probabilities)
#     return jsonify({
#         "disease": symptoms_array[max_prob_index][0],
#         "symptoms": list(symptoms_array[max_prob_index][1:])
#     })


if __name__ == '__main__':
    app.run(debug=True)
 