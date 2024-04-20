import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import base64
import os

# Function to execute notebook cells and retrieve output
def execute_notebook(input_notebook, audio_file_path):
    # Read the notebook file
    with open(input_notebook, 'r') as f:
        nb = nbformat.read(f, as_version=4)

    # Initialize the ExecutePreprocessor
    ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

    # Define input parameters for the notebook
    inputs = {
        'file': base64.b64encode(audio_file_path.encode()).decode(),
    }

    # Inject input parameters into the notebook cells
    for cell in nb.cells:
        if cell.cell_type == 'code':
            cell.source = cell.source.format(**inputs)

    # Execute the notebook
    try:
        ep.preprocess(nb)
    except Exception as e:
        raise Exception(f"Error executing notebook: {e}")

    # Retrieve output from the notebook
    probabilities = None
    for cell in nb.cells:
        if 'probabilities=' in cell.source:
            exec(cell.source)
            probabilities = locals()['probabilities']
            break

    return probabilities

# Main function
def main():
    # Path to the input notebook
    input_notebook = 'flask-server/MODEL.ipynb'

    # Path to the audio file
    audio_file_path = './pneumonia.wav'

    # Execute the notebook cells and retrieve output
    probabilities = execute_notebook(input_notebook, audio_file_path)

    # Print the probabilities
    if probabilities is not None:
        print(probabilities)
        classes = ['Bronchiectasis', 'Bronchiolitis', 'COPD', 'Healthy', 'Pneumonia', 'URTI']
        for class_name, percentage in zip(classes, probabilities):
            print(f'{class_name}: {percentage:.2f}%')

if __name__ == "__main__":
    main()
