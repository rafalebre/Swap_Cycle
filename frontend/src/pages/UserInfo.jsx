import React, { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../services/authService";
import { useNavigate } from "react-router-dom";
import GoogleMapsAutocomplete from "../components/GoogleMapsAutocomplete"; // Usando o componente correto

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    name: "",
    surname: "",
    birth_date: "",
    profile_picture: "",
    address: "",
    latitude: "", // Inicializado corretamente
    longitude: "", // Inicializado corretamente
  });
  const [initialAddress, setInitialAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    setLoading(true);
    getUserInfo()
      .then((data) => {
        setUserInfo({
          ...data,
          latitude: data.latitude || "", // Garantir que latitude esteja configurada
          longitude: data.longitude || "", // Garantir que longitude esteja configurada
        });
        setInitialAddress(data.address); // Armazena o endereço inicial
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user data");
        setLoading(false);
      });
  }, []);

  const handlePlaceSelect = (address, lat, lng) => {
    setUserInfo({
      ...userInfo,
      address: address,
      latitude: lat,
      longitude: lng
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updateData = await updateUserInfo(userInfo);
      console.log("Update Success:", updateData.message);
      navigate("/dashboard"); // Navigate para dashboard após atualização
    } catch (error) {
      console.error("Update failed:", error);
      setError("Update failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard"); // Função para navegar diretamente para dashboard
  };

  if (loading) return <div>Loading...</div>; // Exibe mensagem de carregamento

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={userInfo.email} onChange={handleChange} disabled />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
      </div>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={userInfo.name} onChange={handleChange} />
      </div>
      <div>
        <label>Surname:</label>
        <input type="text" name="surname" value={userInfo.surname} onChange={handleChange} />
      </div>
      <div>
        <label>Birth Date:</label>
        <input type="date" name="birth_date" value={userInfo.birth_date} onChange={handleChange} />
      </div>
      <div>
        <label>Registered Address:</label>
        <span>
          {initialAddress || "You don't have an address registered yet."}
        </span>
      </div>
      <div>
        <label>New Address (Enter manually or use the autocomplete on the Map) :</label>
        <GoogleMapsAutocomplete onPlaceSelected={handlePlaceSelect} />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        Update Info
      </button>
      <button type="button" onClick={handleGoToDashboard} disabled={loading}>
        Go to Dashboard
      </button>
    </form>
  );
};

export default UserInfo;
