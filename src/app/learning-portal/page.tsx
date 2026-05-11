import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Learning Portal | Nigerian Safety Investigation Bureau",
  description: "Access NSIB's learning resources, courses, and certifications.",
};

export default function LearningPortal() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>NSIB Learning Portal</h1>
          <p className={styles.subtitle}>
            Welcome to the official NSIB Learning Portal. Enhance your knowledge with our safety courses, training modules, and certification programs.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.coursesGrid}>
            <div className={styles.courseCard}>
              <div className={styles.courseIcon}>✈️</div>
              <h3>Aviation Safety Course</h3>
              <p>Learn the fundamentals of aviation accident investigation and proactive safety measures.</p>
              <button className={`btn btn-primary ${styles.actionBtn}`}>Enroll Now</button>
            </div>
            <div className={styles.courseCard}>
              <div className={styles.courseIcon}>🚢</div>
              <h3>Maritime Incident Analysis</h3>
              <p>Deep dive into marine casualties, safety reporting, and investigation methodologies.</p>
              <button className={`btn btn-primary ${styles.actionBtn}`}>Enroll Now</button>
            </div>
            <div className={styles.courseCard}>
              <div className={styles.courseIcon}>🚆</div>
              <h3>Railway Safety Standards</h3>
              <p>Understand the critical frameworks and standards for a safe national rail network.</p>
              <button className={`btn btn-primary ${styles.actionBtn}`}>Enroll Now</button>
            </div>
          </div>

          <div className={styles.comingSoon}>
            <h2>More courses are coming soon!</h2>
            <p>We are actively developing new curriculum to support our stakeholders.</p>
            <Link href="/" className="btn btn-outline" style={{ marginTop: "1.5rem", display: "inline-block" }}>
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
