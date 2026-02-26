import React, { useState, useContext } from "react";
import API from "../services/apiService";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import StepIndicator from "../components/StepIndicator";
import DetailsStep from "../components/DetailsStep";
import LocationStep from "../components/LocationStep";
import ReviewStep from "../components/ReviewStep";

function getCurrentCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 60000,
      }
    );
  });
}

function SubmitComplaint() {
  const { user } = useContext(AuthContext);

  if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ added

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (loading) return false;
    try {
      setLoading(true);
      const capturedCoordinates =
        coordinates && coordinates.lat && coordinates.lng
          ? coordinates
          : await getCurrentCoordinates();

      const formData = new FormData();
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append(
        "location",
        JSON.stringify({
          address: location,
          lat: capturedCoordinates?.lat,
          lng: capturedCoordinates?.lng,
        })
      );

      if (image) formData.append("image", image);
      await API.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;

    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <StepIndicator step={step} />

        {step === 1 && (
          <DetailsStep
            description={description}
            setDescription={setDescription}
            priority={priority}
            setPriority={setPriority}
            image={image}
            setImage={setImage}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 2 && (
          <LocationStep
            location={location}
            setLocation={setLocation}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 3 && (
          <ReviewStep
            description={description}
            priority={priority}
            location={location}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            loading={loading}   
          />
        )}

      </div>
    </div>
  );
}

export default SubmitComplaint;
