import streamlit as st
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier, export_text
import shap
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, classification_report

def create_sample_data():
    np.random.seed(42)
    n_samples = 1000
    data = pd.DataFrame({
        'Tenure': np.random.randint(1, 72, size=n_samples),
        'MonthlyCharges': np.random.uniform(18, 118, size=n_samples),
        'TotalCharges': np.random.uniform(18, 8600, size=n_samples),
        'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], size=n_samples),
        'PaymentMethod': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'], size=n_samples),
        'Churn': np.random.choice([0, 1], size=n_samples, p=[0.7, 0.3])
    })
    return data

st.markdown("<h1 style='text-align: center;'>Interpretable and Explainable AI</h1>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

st.markdown("<h3 style='text-align: center;'>The Difference</h3>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    st.markdown("<h4 style='text-align: center;'>Interpretable AI</h4>", unsafe_allow_html=True)
    st.markdown("""
    - Uses inherently transparent models
    - Rules are clear and understandable
    - Model structure is visible
    - Example: Decision Trees, Linear Models
    """)

with col2:
    st.markdown("<h4 style='text-align: center;'>Explainable AI</h4>", unsafe_allow_html=True)
    st.markdown("""
    - Explains complex black-box models
    - Post-hoc explanations
    - Feature attribution methods
    - Example: SHAP, LIME for Random Forests
    """)

st.markdown("<h2 style='text-align: center;'>Use Case : Customer Churn Analysis</h2>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

data = create_sample_data()
X = pd.get_dummies(data.drop('Churn', axis=1))
y = data['Churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown("<h2 style='text-align: center;'>Part 1: Interpretable AI</h2>", unsafe_allow_html=True)
dt_model = DecisionTreeClassifier(max_depth=3, random_state=42)
dt_model.fit(X_train, y_train)
y_pred_dt = dt_model.predict(X_test)

col1, col2 = st.columns(2)

with col1:
    st.subheader("1.1 Decision Tree Rules")
    tree_rules = export_text(dt_model, feature_names=list(X.columns))
    st.code(tree_rules)

with col2:
    st.subheader("1.2 Simple Feature Importance")
    dt_importance = pd.DataFrame({
        'Feature': X.columns,
        'Importance': dt_model.feature_importances_
    }).sort_values('Importance', ascending=False)
    st.bar_chart(dt_importance.set_index('Feature'))

st.markdown("<h2 style='text-align: center;'>Part 2: Explainable AI</h2>", unsafe_allow_html=True)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
y_pred_rf = rf_model.predict(X_test)

col1, col2 = st.columns(2)

with col1:
    st.subheader("2.1 Complex Model Performance")
    st.write(f"Random Forest Accuracy: {accuracy_score(y_test, y_pred_rf):.2f}")
    st.code(classification_report(y_test, y_pred_rf))

with col2:
    st.subheader("2.2 SHAP Values Explanation")
    explainer = shap.TreeExplainer(rf_model)
    shap_values = explainer(X_test[:100])
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values.values[:,:,1], X_test[:100], plot_type="bar")
    st.pyplot(plt.gcf())
    plt.clf()

st.markdown("<br>", unsafe_allow_html=True)
st.header("Interactive Analysis")
col1, col2 = st.columns(2)

with col1:
    tenure = st.number_input("Tenure (months)", 1, 72, 12)
    monthly_charges = st.number_input("Monthly Charges ($)", 18.0, 118.0, 50.0)
with col2:
    contract = st.selectbox("Contract Type", ['Month-to-month', 'One year', 'Two year'])
    payment = st.selectbox("Payment Method", ['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'])

if st.button("Compare Models"):
    input_data = pd.DataFrame({
        'Tenure': [tenure],
        'MonthlyCharges': [monthly_charges],
        'TotalCharges': [monthly_charges * tenure],
        'Contract': [contract],
        'PaymentMethod': [payment]
    })
    
    input_encoded = pd.get_dummies(input_data)
    missing_cols = set(X.columns) - set(input_encoded.columns)
    for col in missing_cols:
        input_encoded[col] = 0
    input_encoded = input_encoded[X.columns]
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("Interpretable AI (Decision Tree)")
        dt_pred = dt_model.predict_proba(input_encoded)[0]
        st.write(f"Churn Probability: {dt_pred[1]:.2%}")
        st.code(export_text(dt_model, feature_names=list(X.columns)))
        
    with col2:
        st.write("Explainable AI (Random Forest + SHAP)")
        rf_pred = rf_model.predict_proba(input_encoded)[0]
        st.write(f"Churn Probability: {rf_pred[1]:.2%}")
        shap_values_single = explainer(input_encoded)
        plt.figure(figsize=(10, 6))
        shap.waterfall_plot(shap_values_single[0,:,1])
        st.pyplot(plt.gcf())
        plt.clf()