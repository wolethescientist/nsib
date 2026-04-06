import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMemberBySlug, teamMembers } from "../data";
import styles from "./profile.module.css";

export function generateStaticParams() {
  return teamMembers.map((m) => ({ slug: m.slug }));
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) notFound();

  return (
    <main className={styles.page}>
      {/* Hero banner */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.photoWrapper}>
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
            <div className={styles.photoOverlay} />
          </div>

          <div className={styles.heroContent}>
            <Link href="/team" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Management Team
            </Link>
            <p className={styles.heroLabel}>Leadership Profile</p>
            <h1 className={styles.heroName}>{member.name}</h1>
            <div className={styles.heroDivider} />
            <p className={styles.heroTitle}>{member.title}</p>
            <p className={styles.heroOrg}>Nigerian Safety Investigation Bureau</p>
          </div>
        </div>
      </div>

      {/* Bio section */}
      <div className={styles.bioSection}>
        <div className={styles.bioInner}>
          <div className={styles.bioAside}>
            <div className={styles.asideCard}>
              <span className={styles.asideLabel}>Position</span>
              <span className={styles.asideValue}>{member.title}</span>
            </div>
          </div>

          <div className={styles.bioBody}>
            <h2 className={styles.bioHeading}>About</h2>
            {member.bio.map((paragraph, i) => (
              <p key={i} className={styles.bioParagraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
