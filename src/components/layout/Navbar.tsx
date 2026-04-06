"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const HERO_PAGES = ["/"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hasHero = HERO_PAGES.includes(pathname);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = scrolled || !hasHero;

  return (
    <header className={`${styles.header} ${isSolid ? styles.scrolled : ""}`}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src="/images/nsib-logo.png"
              alt="NSIB Logo"
              width={200}
              height={60}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        <button 
          className={`${styles.mobileMenuBtn} ${mobileMenuOpen ? styles.active : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <div className={styles.navItem}>
            <Link href="/">Home</Link>
          </div>

          <div className={styles.navItem}>
            <Link href="/about">About <span className={styles.chevron}>▼</span></Link>
            <div className={styles.dropdown}>
              <Link href="/team" className={styles.dropdownLink}>Management Team</Link>
              <Link href="/history" className={styles.dropdownLink}>History</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link href="/directorates">Directorate <span className={styles.chevron}>▼</span></Link>
            <div className={styles.dropdown}>
              <Link href="/directorates" className={styles.dropdownLink}>All Directorates</Link>
              <Link href="/page-service" className={styles.dropdownLink}>NSIB Services</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link href="/operations-centre">Operations Centre <span className={styles.chevron}>▼</span></Link>
            <div className={styles.dropdown}>
              <Link href="/flight-track" className={styles.dropdownLink}>Flight Tracking</Link>
              <Link href="/vessel-tracking" className={styles.dropdownLink}>Ship & Vessel Tracking</Link>
              <Link href="/help-desk" className={styles.dropdownLink}>Operational Help Desk</Link>
              <Link href="/open-ticket" className={styles.dropdownLink}>Check Existing Tickets</Link>
              <Link href="/login" className={styles.dropdownLink}>Sign up to OLC</Link>
              <Link href="/reporting-guidelines" className={styles.dropdownLink}>Reporting Guidelines</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link href="/publications">News & Pubs <span className={styles.chevron}>▼</span></Link>
            <div className={styles.dropdown}>
              <Link href="/legislations" className={styles.dropdownLink}>Legislations</Link>
              <Link href="/mou" className={styles.dropdownLink}>MOU</Link>
              <Link href="/rail-reports" className={styles.dropdownLink}>Rail Accident Reports</Link>
              <Link href="/marine-reports" className={styles.dropdownLink}>Marine Accident Reports</Link>
              <Link href="/air-reports" className={styles.dropdownLink}>Aircraft Accident Reports</Link>
              <Link href="/investigation-forms-and-checklists" className={styles.dropdownLink}>Forms and Checklists</Link>
              <Link href="/investigation-manuals" className={styles.dropdownLink}>Investigation Manuals</Link>
              <Link href="/foi" className={styles.dropdownLink}>FOI</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link href="/contact-us">Contact <span className={styles.chevron}>▼</span></Link>
            <div className={styles.dropdown}>
              <Link href="/comment-on-regulations" className={styles.dropdownLink}>Comments On Regulations</Link>
              <Link href="/reporting" className={styles.dropdownLink}>Report an Accident</Link>
              <Link href="/vacancies" className={styles.dropdownLink}>Vacancies</Link>
              <Link href="/contact-us" className={styles.dropdownLink}>Contact Us</Link>
            </div>
          </div>

          <Link href="/reporting" className={`btn btn-secondary ${styles.reportBtn}`}>Report Accident</Link>
        </nav>
      </div>
    </header>
  );
}
