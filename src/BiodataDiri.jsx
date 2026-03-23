import React from "react";
import "./App.css";

//6 Component untuk Biodata Diri

// Layout Wrapper
const Layout = ({ children }) => (
    <div className="layout">{children}</div>
);

// Header Component
const Header = () => (
    <header className="header">
        <h1>✨ Delita Portofolio👩‍💻</h1>
        <p>Sistem Informasi</p>
    </header>
);

// Profile Card 
const ProfileCard = ({ name, location }) => (
    <div className="profile-card glass">
        <h2>{name}</h2>
        <p>{location}</p>
    </div>
);

// Reusable Info Card 
const InfoCard = ({ icon, title, value }) => (
    <div className="card glass">
        <h4>{icon} {title}</h4>
        <p>{value}</p>
    </div>
);

// Section Wrapper
const Section = ({ title, children }) => (
    <section className="section glass">
        <h3>{title}</h3>
        {children}
    </section>
);


// Experience Component (
const experiences = [
    "Semester 2: Membuat Projek Sederhana dengan HTML, CSS, dan JavaScript",
];

const Experience = () => (
    <ul>
        {experiences.map((exp, i) => (
            <li key={i}>{exp}</li>
        ))}
    </ul>
);

// Parent COMPONENT
function BiodataDiri() {
    return (
        <Layout>
            <Header />

            <ProfileCard name="Delita Br Tinambunan" location="RowoSari, Rumbai" />

            <div className="grid">
                <InfoCard icon="🎓" title="NIM" value="2457301031" />
                <InfoCard icon="📚" title="Jurusan" value="Sistem Informasi" />
                <InfoCard icon="📧" title="Email" value="delita24si@mahasiswa.pcr.ac.id" />
                <InfoCard icon="🎧" title="Hobi" value="Musik & Membaca Novel" />
            </div>

            <Section title="Tentang Saya">
                <p>
                    Saya mahasiswa Sistem Informasi semester 4 saya saat 
                    ini sedang belajar React di matakuliah Pemrograman Framework Lanjutan.
                </p>
            </Section>

            <Section title="Pengalaman">
                <Experience />
            </Section>
        </Layout>
    );
}

export default BiodataDiri;