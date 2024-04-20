import librosa
from keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt

classes = ['Bronchiectasis', 'Bronchiolitis', 'COPD', 'Healthy', 'Pneumonia', 'URTI']

def fe(file):
    n=128
    a,s=librosa.load(file)
    m= librosa.feature.mfcc(y=a, sr=s, n_mfcc=n)
    mfc_mean=np.mean(m.T,axis=0)
    mfc_mean=mfc_mean.reshape(1,n)
    
    mody=load_model('./Ann0.h5')
    p=mody.predict(mfc_mean)[0]
    return p*100

if __name__ == "__main__":
    print(fe("./pneumonia.wav"))
