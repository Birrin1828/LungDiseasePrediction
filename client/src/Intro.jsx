import React, { useState, useEffect } from 'react';
import backgroundImage from "./background.jpg";

function Intro() {
  const styles = {
    paragraph: {
      color: 'white',
      fontFamily: 'monospace, sans',
      fontSize: '1.5rem',
      letterSpacing: '0.002em',
      marginBottom: '30px',
      lineHeight: '1.5'
    },
    container: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.9
    },
    content: {
      maxWidth: '800px', 
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      borderRadius: '20px' 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'white', textAlign: 'center' ,textDecoration:"underline"}}>
          CNN-MoE Based Framework for<br /> Classification of Lung Disease Detection
        </h1>
        <p style={styles.paragraph}>
          <p style={{color:'#5BBCFF',fontSize:'2.54rem'}}>The World Health Organization (WHO)</p> emphasizes the significance of respiratory illnesses, including lung cancer, tuberculosis (TB), asthma, chronic obstructive pulmonary disease (COPD), and lower respiratory tract infections (LRTI), as major contributors to global mortality. For instance, TB affects around 10 million people, COPD affects 65 million, and asthma affects 334 million individuals worldwide.
        </p>
        <p style={styles.paragraph}>
          The WHO estimates that annually, TB, lung cancer, and COPD combined cause approximately 5 million deaths.
        </p>
        <p style={styles.paragraph}>
          Early detection is crucial in managing respiratory diseases effectively, which includes timely intervention and containment. Lung auscultation, or listening to respiratory sounds through a stethoscope, plays a vital role in diagnosing respiratory conditions.
        </p>
        <p style={styles.paragraph}>
          Anomalous respiratory sounds, such as Crackles and Wheezes, are often indicative of pulmonary disorders. Automating the detection of these abnormal sounds could enhance early diagnosis and enable broader population screening compared to manual methods.
        </p>
        <p style={styles.paragraph}>
          Project Description: CNN-MoE Based Framework for Classification of Lung Disease Detection. The project focuses on the development of a deep learning framework utilizing a Convolutional Neural Network (CNN) with Mixture of Experts (MoE) architecture for the classification of lung diseases. Respiratory illnesses, such as lung cancer, tuberculosis (TB), asthma, chronic obstructive pulmonary disease (COPD), and lower respiratory tract infections (LRTI), are significant contributors to global mortality according to the World Health Organization (WHO).
        </p>
      </div>
    </div>
  );
}

export default Intro;
