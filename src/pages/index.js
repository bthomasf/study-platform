import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import "./index.css"

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title hero__title__custom">{siteConfig.title}</h1>
        <div className='intro__description'>
          <p data-text={siteConfig.tagline}>{siteConfig.tagline}</p>
        </div>
        <div className={styles.buttons} >
          <Link
            className="intro__button button button--primary button_start"
            to="/docs/algorithm/leetcode/hot100_1">
            QuickStart
          </Link>
          <Link
            className="intro__button button button--primary btn_no_border"
            to="/docs/backend/kubernetes/K8S_Install">
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
