import React, { useState } from "react";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";

export default function UserForm() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nilai: "",
    jurusan: "",
    tingkat: "",
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const validate = (name, value) => {
    let errorMsg = "";

    if (name === "nama") {
      if (!value) errorMsg = "Nama wajib diisi";
      else if (/[0-9]/.test(value)) errorMsg = "Tidak boleh angka";
      else if (value.length < 3) errorMsg = "Minimal 3 karakter";
    }

    if (name === "email") {
      if (!value) errorMsg = "Email wajib diisi";
      else if (!value.includes("@")) errorMsg = "Format email tidak valid";
      else if (value.length < 10) errorMsg = "Minimal 10 karakter";
    }

    if (name === "nilai") {
      if (!value) errorMsg = "Nilai wajib diisi";
      else if (isNaN(value)) errorMsg = "Harus angka";
      else if (value < 0 || value > 100) errorMsg = "Rentang 0 - 100";
    }

    if (name === "jurusan" || name === "tingkat") {
      if (!value) errorMsg = "Wajib dipilih";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const isFormValid =
    Object.values(formData).every((val) => val !== "") &&
    Object.values(errors).every((err) => !err);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmittedData(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-200">

      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 border border-pink-200">

        <h2 className="text-xl font-semibold text-center text-pink-500 mb-4">
          🌸 Form Pendaftaran Beasiswa 🌸
        </h2>

        <form onSubmit={handleSubmit}>

          <InputField
            label="Nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            error={errors.nama} />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email} />

          <InputField
            label="Nilai Rata-rata (0 - 100)"
            name="nilai"
            type="text"
            value={formData.nilai}
            onChange={handleChange}
            error={errors.nilai} />

          <SelectField
            label="Jurusan Pilihan"
            name="jurusan"
            value={formData.jurusan}
            onChange={handleChange}
            options={["Informatika", "Sistem Informasi", "Manajemen"]}
            error={errors.jurusan} />

          <SelectField
            label="Jenjang Pendidikan"
            name="tingkat"
            value={formData.tingkat}
            onChange={handleChange}
            options={["D3", "S1", "S2"]}
            error={errors.tingkat} />

          {/* BUTTON CONDITIONAL */}
          {isFormValid && (
            <button className="w-full mt-4 bg-pink-400 hover:bg-pink-500 hover:scale-105 transition text-white p-2 rounded-lg shadow-md">
              Submit
            </button>
          )}
        </form>

        {submittedData && (
          <div className="mt-5 p-4 bg-pink-50 border border-pink-300 rounded-lg text-pink-600 shadow-sm">
            <p className="font-semibold">Data berhasil disimpan</p>
            <p className="text-sm mt-1">Nama: {submittedData.nama}</p>
            <p className="text-sm">Nilai: {submittedData.nilai}</p>
            <p className="text-sm">Jurusan: {submittedData.jurusan}</p>
          </div>
        )}

      </div>
    </div>
  );
}