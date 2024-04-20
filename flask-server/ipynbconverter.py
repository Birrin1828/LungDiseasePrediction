from nbconvert import PythonExporter
import nbformat
import os
import importlib.util

def import_notebook(notebook_path):
    # Convert the notebook to a Python script
    exporter = PythonExporter()
    content, _ = exporter.from_filename(notebook_path)
    
    # Create a temporary Python file with the notebook content
    temp_py_file = notebook_path.replace('.ipynb', '.py')
    with open(temp_py_file, 'w') as f:
        f.write(content)
    
    # Load the temporary Python file as a module
    spec = importlib.util.spec_from_file_location("temp_module", temp_py_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    
    # Remove the temporary Python file
    os.remove(temp_py_file)
    
    return module

# Example usage
if __name__ == "__main__":
    notebook_path = "flask-server/MODEL.ipynb"
    notebook_module = import_notebook(notebook_path)
    
    # Now you can access functions or variables defined in the notebook module
    # For example:
    probabilities = notebook_module.fe("flask-server/another.wav")
    print(probabilities)
